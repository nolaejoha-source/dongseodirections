from pathlib import Path
import json
import math
import re

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
GLB_PATH = ROOT / "public" / "campus_scene.glb"
BLEND_PATH = ROOT / "campus_map.blend"
PREVIEW_PATH = ROOT / "campus_map_preview.png"
COURTYARD_PREVIEW_PATH = ROOT / "campus_courtyard_preview.png"
DEM_PATH = ROOT / "data" / "campus_srtm30m.json"
BASE_ELEVATION_M = 68.0
VERTICAL_SCALE = 0.45


def look_at(obj, point):
    direction = Vector(point) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def bounds_of(objects):
    points = [obj.matrix_world @ Vector(corner) for obj in objects for corner in obj.bound_box]
    return (
        Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points))),
        Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points))),
    )


def make_emission(name, color, strength=1.0):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1.0)
    material.use_nodes = True
    node = material.node_tree.nodes.get("Principled BSDF")
    node.inputs["Base Color"].default_value = (*color, 1.0)
    node.inputs["Emission Color"].default_value = (*color, 1.0)
    node.inputs["Emission Strength"].default_value = strength
    return material


def make_pbr_material(name, color, roughness=0.9):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1.0)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Roughness"].default_value = roughness
    return material


def make_courtyard_grass(name):
    material = make_pbr_material(name, (0.30, 0.49, 0.26), 0.96)
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    shader = nodes.get("Principled BSDF")
    texcoord = nodes.new("ShaderNodeTexCoord")
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 46.0
    noise.inputs["Detail"].default_value = 3.0
    noise.inputs["Roughness"].default_value = 0.72
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.24
    ramp.color_ramp.elements[0].color = (0.20, 0.34, 0.14, 1.0)
    ramp.color_ramp.elements[1].position = 0.78
    ramp.color_ramp.elements[1].color = (0.43, 0.58, 0.29, 1.0)
    links.new(texcoord.outputs["Generated"], noise.inputs["Vector"])
    links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], shader.inputs["Base Color"])
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    bump.inputs["Distance"].default_value = 0.025
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    return material


def make_brick_path_material(name):
    material = make_pbr_material(name, (0.62, 0.34, 0.23), 0.9)
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    shader = nodes.get("Principled BSDF")
    texcoord = nodes.new("ShaderNodeTexCoord")
    brick = nodes.new("ShaderNodeTexBrick")
    brick.inputs["Color1"].default_value = (0.50, 0.20, 0.11, 1.0)
    brick.inputs["Color2"].default_value = (0.63, 0.29, 0.18, 1.0)
    brick.inputs["Mortar"].default_value = (0.29, 0.20, 0.14, 1.0)
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Brick Width"].default_value = 0.92
    brick.inputs["Row Height"].default_value = 0.48
    brick.inputs["Mortar Size"].default_value = 0.025
    brick.inputs["Mortar Smooth"].default_value = 0.05
    brick.inputs["Bias"].default_value = 0.08
    links.new(texcoord.outputs["UV"], brick.inputs["Vector"])
    links.new(brick.outputs["Color"], shader.inputs["Base Color"])
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.16
    bump.inputs["Distance"].default_value = 0.018
    links.new(brick.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], shader.inputs["Normal"])
    return material


def add_courtyard_box(collection, name, location, dimensions, material, bevel=0.08, rotation_z=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    obj.rotation_euler.z = rotation_z
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    if bevel > 0:
        modifier = obj.modifiers.new("Soft stone edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
        obj.modifiers.new("Weighted corner normals", "WEIGHTED_NORMAL")
    for owner in list(obj.users_collection):
        owner.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def blur_grid(grid):
    """Apply one separable 3x3 low-pass pass to reduce cell-edge ripples."""
    height = len(grid)
    width = len(grid[0])
    horizontal = [[0.0] * width for _ in range(height)]
    for j in range(height):
        for i in range(width):
            left = grid[j][max(0, i - 1)]
            center = grid[j][i]
            right = grid[j][min(width - 1, i + 1)]
            horizontal[j][i] = (left + 2.0 * center + right) * 0.25
    vertical = [[0.0] * width for _ in range(height)]
    for j in range(height):
        for i in range(width):
            lower = horizontal[max(0, j - 1)][i]
            center = horizontal[j][i]
            upper = horizontal[min(height - 1, j + 1)][i]
            vertical[j][i] = (lower + 2.0 * center + upper) * 0.25
    return vertical


def smooth_unit(amount):
    amount = max(0.0, min(1.0, amount))
    return amount * amount * (3.0 - 2.0 * amount)


with DEM_PATH.open("r", encoding="utf-8") as dem_file:
    dem = json.load(dem_file)
dem_x = [float(value) for value in dem["x_m"]]
dem_y = [float(value) for value in dem["y_m"]]
dem_z = [[float(value) for value in row] for row in dem["elevation_m"]]
for _ in range(4):
    dem_z = blur_grid(dem_z)


def sample_dem(x, y):
    """Bilinearly sample the smoothed SRTM grid in the scene's local XY meters."""
    x = max(dem_x[0], min(dem_x[-1], x))
    y = max(dem_y[0], min(dem_y[-1], y))
    fx = (x - dem_x[0]) / (dem_x[-1] - dem_x[0]) * (len(dem_x) - 1)
    fy = (y - dem_y[0]) / (dem_y[-1] - dem_y[0]) * (len(dem_y) - 1)
    i0 = min(len(dem_x) - 2, int(fx))
    j0 = min(len(dem_y) - 2, int(fy))
    tx = fx - i0
    ty = fy - j0
    z00 = dem_z[j0][i0]
    z10 = dem_z[j0][i0 + 1]
    z01 = dem_z[j0 + 1][i0]
    z11 = dem_z[j0 + 1][i0 + 1]
    return (z00 * (1.0 - tx) + z10 * tx) * (1.0 - ty) + (z01 * (1.0 - tx) + z11 * tx) * ty


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(GLB_PATH))
scene = bpy.context.scene

terrain = bpy.data.objects.get("Campus_Terrain")
if terrain is None:
    raise RuntimeError("Campus_Terrain was not found in campus_scene.glb")

# Keep the imported map's WGS84-derived XY coordinates. The old GLB terrain
# came from a coarse elevation surface, so drape roads and building bases onto
# a lightly smoothed SRTM 30 m grid without moving them horizontally.
road_network = bpy.data.objects.get("Campus_Road_Network")

building_shift_count = 0
building_pad_targets = []
design_hall = bpy.data.objects.get("09_디자인홀")
new_millennium_hall = bpy.data.objects.get("13_뉴밀레니엄관")
if design_hall is None or new_millennium_hall is None:
    raise RuntimeError("Buildings 09 and 13 are required to place their courtyard.")
design_min, design_max = bounds_of([design_hall])
millennium_min, millennium_max = bounds_of([new_millennium_hall])
COURTYARD_X_MIN = max(design_min.x, millennium_min.x) + 2.0
COURTYARD_X_MAX = min(design_max.x, millennium_max.x) - 2.0
COURTYARD_Y_MIN = design_max.y + 1.15
COURTYARD_Y_MAX = millennium_min.y - 1.15
COURTYARD_CENTER_X = (COURTYARD_X_MIN + COURTYARD_X_MAX) * 0.5
COURTYARD_CENTER_Y = (COURTYARD_Y_MIN + COURTYARD_Y_MAX) * 0.5
DESIGN_CENTER_X = (design_min.x + design_max.x) * 0.5
DESIGN_CENTER_Y = (design_min.y + design_max.y) * 0.5
COURTYARD_LEVEL_Z = (sample_dem(DESIGN_CENTER_X, DESIGN_CENTER_Y) - BASE_ELEVATION_M) * VERTICAL_SCALE
if COURTYARD_X_MIN >= COURTYARD_X_MAX or COURTYARD_Y_MIN >= COURTYARD_Y_MAX:
    raise RuntimeError("The space between Buildings 09 and 13 is too small for the courtyard.")

for obj in list(scene.objects):
    if not re.match(r"^\d{2}_", obj.name):
        continue
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    x = sum(point.x for point in corners) / len(corners)
    y = sum(point.y for point in corners) / len(corners)
    new_height = (sample_dem(x, y) - BASE_ELEVATION_M) * VERTICAL_SCALE
    if obj.name.startswith("13_"):
        # The supplied reference shows a level shared courtyard at the Hall 09 entrance.
        # Align Hall 13's base to that courtyard instead of the coarse DEM's steep local seam.
        new_height = COURTYARD_LEVEL_Z
    current_bottom = min(point.z for point in corners)
    obj.location.z += new_height - current_bottom
    building_shift_count += 1
    number = int(obj.name[:2])
    if number in {26, 29}:
        continue
    aligned_corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    building_pad_targets.append(
        (
            min(point.x for point in aligned_corners),
            max(point.x for point in aligned_corners),
            min(point.y for point in aligned_corners),
            max(point.y for point in aligned_corners),
            min(point.z for point in aligned_corners),
        )
    )

old_materials = list(terrain.data.materials)
terrain_collections = list(terrain.users_collection)
fine_columns = (len(dem_x) - 1) * 4 + 1
fine_rows = (len(dem_y) - 1) * 4 + 1
terrain_vertices = []
for row in range(fine_rows):
    y = dem_y[0] + (dem_y[-1] - dem_y[0]) * row / (fine_rows - 1)
    for column in range(fine_columns):
        x = dem_x[0] + (dem_x[-1] - dem_x[0]) * column / (fine_columns - 1)
        z = (sample_dem(x, y) - BASE_ELEVATION_M) * VERTICAL_SCALE
        interior_pad_heights = []
        transition_weights = []
        for min_x, max_x, min_y, max_y, base_z in building_pad_targets:
            dx = max(min_x - x, 0.0, x - max_x)
            dy = max(min_y - y, 0.0, y - max_y)
            outside_distance = math.hypot(dx, dy)
            if outside_distance <= 0.0:
                interior_pad_heights.append(base_z)
                continue
            if outside_distance > 30.0:
                continue
            weight = 1.0 - outside_distance / 30.0
            weight = weight * weight * (3.0 - 2.0 * weight)
            transition_weights.append((weight, base_z))
        if interior_pad_heights:
            z = sum(interior_pad_heights) / len(interior_pad_heights)
        elif transition_weights:
            influence = 1.0
            weighted_height = 0.0
            total_weight = 0.0
            for weight, base_z in transition_weights:
                influence *= 1.0 - weight
                weighted_height += weight * base_z
                total_weight += weight
            target_z = weighted_height / total_weight
            influence = 1.0 - influence
            z = z * (1.0 - influence) + target_z * influence
        if x < COURTYARD_X_MIN:
            x_weight = smooth_unit((x - (COURTYARD_X_MIN - 14.0)) / 14.0)
        elif x > COURTYARD_X_MAX:
            x_weight = smooth_unit(((COURTYARD_X_MAX + 14.0) - x) / 14.0)
        else:
            x_weight = 1.0
        if y < COURTYARD_Y_MIN:
            y_weight = smooth_unit((y - (COURTYARD_Y_MIN - 14.0)) / 14.0)
        elif y > COURTYARD_Y_MAX:
            y_weight = smooth_unit(((COURTYARD_Y_MAX + 14.0) - y) / 14.0)
        else:
            y_weight = 1.0
        courtyard_weight = x_weight * y_weight
        z = z * (1.0 - courtyard_weight) + COURTYARD_LEVEL_Z * courtyard_weight
        terrain_vertices.append((x, y, z))
terrain_faces = []
for row in range(fine_rows - 1):
    for column in range(fine_columns - 1):
        lower_left = row * fine_columns + column
        lower_right = lower_left + 1
        upper_left = lower_left + fine_columns
        upper_right = upper_left + 1
        terrain_faces.append((lower_left, lower_right, upper_right, upper_left))

terrain_mesh = bpy.data.meshes.new("Campus terrain SRTM30m mesh")
terrain_mesh.from_pydata(terrain_vertices, [], terrain_faces)
terrain_mesh.update()
for material in old_materials:
    terrain_mesh.materials.append(material)
new_terrain = bpy.data.objects.new("Campus_Terrain", terrain_mesh)
for collection in terrain_collections:
    collection.objects.link(new_terrain)
for polygon in terrain_mesh.polygons:
    polygon.use_smooth = True
bpy.data.objects.remove(terrain, do_unlink=True)
new_terrain.name = "Campus_Terrain"

campus_objects = [obj for obj in scene.objects if obj.type == "MESH"]
terrain = new_terrain

minimum, maximum = bounds_of(campus_objects)
center = (minimum + maximum) / 2
center.z = minimum.z
map_width = maximum.x - minimum.x
map_depth = maximum.y - minimum.y

# Organize the imported model so the campus stays easy to edit in Blender.
for name in ("Campus Model", "Campus Labels", "Presentation"):
    if bpy.data.collections.get(name) is None:
        collection = bpy.data.collections.new(name)
        scene.collection.children.link(collection)

model_collection = bpy.data.collections["Campus Model"]
for obj in campus_objects:
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    model_collection.objects.link(obj)

# Rebuild the walking network as smooth splines from the app's WGS84 path graph.
# This avoids the disconnected, jagged ends caused by smoothing a strip mesh.
nodes_path = ROOT / "server" / "data" / "path_nodes.json"
edges_path = ROOT / "server" / "data" / "path_edges.json"
nodes = json.loads(nodes_path.read_text(encoding="utf-8"))
edges = json.loads(edges_path.read_text(encoding="utf-8"))
campus_lat, campus_lng = 35.14495, 129.00945
meters_per_degree_lat = 111_320.0
meters_per_degree_lng = meters_per_degree_lat * math.cos(math.radians(campus_lat))
path_positions = {}
for node in nodes:
    lng, lat = node["location"]["coordinates"]
    x = (lng - campus_lng) * meters_per_degree_lng
    y = (lat - campus_lat) * meters_per_degree_lat
    z = (sample_dem(x, y) - BASE_ELEVATION_M) * VERTICAL_SCALE + 0.8
    if COURTYARD_X_MIN <= x <= COURTYARD_X_MAX and COURTYARD_Y_MIN <= y <= COURTYARD_Y_MAX:
        z = COURTYARD_LEVEL_Z + 0.8
    path_positions[node["id"]] = (x, y, z)

edge_pairs = []
adjacency = {node_id: [] for node_id in path_positions}
for edge in edges:
    a, b = edge["from_node"], edge["to_node"]
    if a not in path_positions or b not in path_positions:
        continue
    edge_index = len(edge_pairs)
    edge_pairs.append((a, b))
    adjacency[a].append(edge_index)
    adjacency[b].append(edge_index)

visited_edges = set()


def walk_path(start_node, first_edge):
    chain = [start_node]
    current_node = start_node
    edge_index = first_edge
    while edge_index not in visited_edges:
        visited_edges.add(edge_index)
        a, b = edge_pairs[edge_index]
        next_node = b if a == current_node else a
        chain.append(next_node)
        if len(adjacency[next_node]) != 2:
            break
        remaining = [candidate for candidate in adjacency[next_node] if candidate not in visited_edges]
        if not remaining:
            break
        current_node = next_node
        edge_index = remaining[0]
    return chain


path_chains = []
for node_id, incident_edges in adjacency.items():
    if len(incident_edges) == 2:
        continue
    for edge_index in incident_edges:
        if edge_index not in visited_edges:
            path_chains.append(walk_path(node_id, edge_index))
for edge_index, (a, _b) in enumerate(edge_pairs):
    if edge_index not in visited_edges:
        path_chains.append(walk_path(a, edge_index))

path_curve = bpy.data.curves.new("Campus smooth walking paths", "CURVE")
path_curve.dimensions = "3D"
path_curve.resolution_u = 10
path_curve.bevel_depth = 0.65
path_curve.bevel_resolution = 3
path_curve.use_fill_caps = True
court_route_margin = path_curve.bevel_depth + 1.0
visible_path_chains = []
minimum_visible_path_length_m = 45.0
for chain in path_chains:
    chain_length = sum(
        math.hypot(
            path_positions[next_id][0] - path_positions[node_id][0],
            path_positions[next_id][1] - path_positions[node_id][1],
        )
        for node_id, next_id in zip(chain, chain[1:])
    )
    if chain_length < minimum_visible_path_length_m:
        continue
    segment = []
    for node_id in chain:
        node_x, node_y, _node_z = path_positions[node_id]
        inside_court = (
            COURTYARD_X_MIN - court_route_margin <= node_x <= COURTYARD_X_MAX + court_route_margin
            and COURTYARD_Y_MIN - court_route_margin <= node_y <= COURTYARD_Y_MAX + court_route_margin
        )
        if inside_court:
            if len(segment) >= 2:
                visible_path_chains.append(segment)
            segment = []
        else:
            segment.append(node_id)
    if len(segment) >= 2:
        visible_path_chains.append(segment)

for chain in visible_path_chains:
    spline = path_curve.splines.new("BEZIER")
    spline.bezier_points.add(len(chain) - 1)
    for point, node_id in zip(spline.bezier_points, chain):
        point.co = path_positions[node_id]
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    if len(chain) > 2 and chain[0] == chain[-1]:
        spline.use_cyclic_u = True
path_obj = bpy.data.objects.new("Campus_Road_Network_Smooth", path_curve)
model_collection.objects.link(path_obj)
road_material = bpy.data.materials.new("Campus paths charcoal")
road_material.diffuse_color = (0.14, 0.17, 0.20, 1.0)
road_material.use_nodes = True
road_bsdf = road_material.node_tree.nodes.get("Principled BSDF")
road_bsdf.inputs["Base Color"].default_value = (0.14, 0.17, 0.20, 1.0)
road_bsdf.inputs["Roughness"].default_value = 0.88
path_curve.materials.append(road_material)
if road_network is not None:
    bpy.data.objects.remove(road_network, do_unlink=True)

# Model the flat planted court visible between New Millennium Hall and Design Hall.
courtyard_collection = bpy.data.collections.new("Courtyard 09-13 · flat garden and brick walks")
scene.collection.children.link(courtyard_collection)
court_grass = make_courtyard_grass("Courtyard lawn · fine mottled grass")
court_brick = make_brick_path_material("Courtyard paths · individual terracotta pavers")
court_stone = make_pbr_material("Courtyard sculpture · pale stone", (0.76, 0.75, 0.68), 0.74)
court_dark = make_pbr_material("Courtyard sculpture · dark inset", (0.19, 0.25, 0.21), 0.72)
court_metal = make_pbr_material("Courtyard sculpture · light metal", (0.91, 0.88, 0.77), 0.36)
court_junction = make_pbr_material("Courtyard fork nodes · terracotta", (0.58, 0.26, 0.17), 0.9)
y0, y1 = COURTYARD_Y_MIN + 0.22, COURTYARD_Y_MAX - 0.22
court_depth = y1 - y0
landscape_width = min(COURTYARD_X_MAX - COURTYARD_X_MIN - 0.9, court_depth * 3.0)
x0, x1 = COURTYARD_CENTER_X - landscape_width * 0.5, COURTYARD_CENTER_X + landscape_width * 0.5
cx, cy = COURTYARD_CENTER_X, COURTYARD_CENTER_Y
court_width = x1 - x0
grass_outline = [
    (x0 + court_width * 0.02, y0 + court_depth * 0.18),
    (x0 + court_width * 0.14, y0 + court_depth * 0.08),
    (x0 + court_width * 0.29, y0 + court_depth * 0.15),
    (x0 + court_width * 0.43, y0 + court_depth * 0.06),
    (x0 + court_width * 0.57, y0 + court_depth * 0.16),
    (x0 + court_width * 0.72, y0 + court_depth * 0.07),
    (x0 + court_width * 0.86, y0 + court_depth * 0.15),
    (x0 + court_width * 0.98, y0 + court_depth * 0.17),
    (x1 - 0.1, y0 + court_depth * 0.34),
    (x1 - 0.2, y1 - court_depth * 0.31),
    (x0 + court_width * 0.96, y1 - court_depth * 0.12),
    (x0 + court_width * 0.82, y1 - court_depth * 0.08),
    (x0 + court_width * 0.68, y1 - court_depth * 0.16),
    (x0 + court_width * 0.53, y1 - court_depth * 0.07),
    (x0 + court_width * 0.38, y1 - court_depth * 0.16),
    (x0 + court_width * 0.23, y1 - court_depth * 0.08),
    (x0 + court_width * 0.08, y1 - court_depth * 0.14),
    (x0 + 0.1, y1 - court_depth * 0.32),
]
grass_mesh = bpy.data.meshes.new("Flat planted courtyard surface")
grass_mesh.from_pydata([(x, y, COURTYARD_LEVEL_Z + 0.08) for x, y in grass_outline], [], [tuple(range(len(grass_outline)))])
grass_mesh.materials.append(court_grass)
grass_mesh.update()
grass_obj = bpy.data.objects.new("Flat lawn between Buildings 09 and 13", grass_mesh)
courtyard_collection.objects.link(grass_obj)


def add_brick_walk(name, points, width=1.45):
    vertices = []
    cumulative_distance = [0.0]
    for index, (x, y) in enumerate(points):
        previous = points[max(0, index - 1)]
        following = points[min(len(points) - 1, index + 1)]
        prev_dx, prev_dy = x - previous[0], y - previous[1]
        next_dx, next_dy = following[0] - x, following[1] - y
        prev_length = max(0.001, math.hypot(prev_dx, prev_dy))
        next_length = max(0.001, math.hypot(next_dx, next_dy))
        prev_normal = (-prev_dy / prev_length, prev_dx / prev_length)
        next_normal = (-next_dy / next_length, next_dx / next_length)
        miter_x, miter_y = prev_normal[0] + next_normal[0], prev_normal[1] + next_normal[1]
        miter_length = max(0.001, math.hypot(miter_x, miter_y))
        miter_x, miter_y = miter_x / miter_length, miter_y / miter_length
        miter_dot = max(0.35, abs(miter_x * next_normal[0] + miter_y * next_normal[1]))
        miter = min(width, width * 0.5 / miter_dot)
        if index:
            cumulative_distance.append(cumulative_distance[-1] + math.hypot(x - points[index - 1][0], y - points[index - 1][1]))
        vertices.extend([
            (x + miter_x * miter, y + miter_y * miter, COURTYARD_LEVEL_Z + 0.18),
            (x - miter_x * miter, y - miter_y * miter, COURTYARD_LEVEL_Z + 0.18),
        ])
    faces = [(index * 2, index * 2 + 1, index * 2 + 3, index * 2 + 2) for index in range(len(points) - 1)]
    mesh = bpy.data.meshes.new(f"{name} paving mesh")
    mesh.from_pydata(vertices, [], faces)
    uv_layer = mesh.uv_layers.new(name="Brick courses")
    for polygon in mesh.polygons:
        for loop_index in polygon.loop_indices:
            vertex_index = mesh.loops[loop_index].vertex_index
            point_index, side = divmod(vertex_index, 2)
            uv_layer.data[loop_index].uv = (
                cumulative_distance[point_index] / 0.62,
                (side * width) / 0.38,
            )
    mesh.materials.append(court_brick)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    courtyard_collection.objects.link(obj)
    return obj


def add_path_junction(name, x, y, diameter=1.05):
    radius = diameter * 0.5
    z = COURTYARD_LEVEL_Z + 0.185
    vertices = [
        (x + radius * math.cos(math.tau * index / 12), y + radius * math.sin(math.tau * index / 12), z)
        for index in range(12)
    ]
    mesh = bpy.data.meshes.new(f"{name} mesh")
    mesh.from_pydata(vertices, [], [tuple(range(12))])
    mesh.materials.append(court_junction)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    courtyard_collection.objects.link(obj)
    return obj


left_x, right_x = x0 + 1.0, x1 - 1.0
upper_y, lower_y = y1 - 0.55, y0 + 0.55
half_width = (x1 - x0) * 0.5
path_width = 1.08
west_junction = x0 + court_width * 0.20
east_junction = x0 + court_width * 0.80
add_brick_walk("Brick walk · west approach", [(x0, cy + 0.05), (x0 + court_width * 0.11, cy - 0.08), (west_junction, cy)], width=path_width)
add_brick_walk("Brick walk · west fork north", [
    (west_junction, cy), (x0 + court_width * 0.29, cy + 0.06),
    (x0 + court_width * 0.37, cy + court_depth * 0.39), (x0 + court_width * 0.37, upper_y),
], width=path_width)
add_brick_walk("Brick walk · west fork south", [
    (west_junction, cy), (x0 + court_width * 0.29, cy - court_depth * 0.10),
    (x0 + court_width * 0.38, cy - court_depth * 0.39), (x0 + court_width * 0.38, lower_y),
], width=path_width)
add_brick_walk("Brick walk · east approach", [(x1, cy - 0.05), (x1 - court_width * 0.11, cy + 0.08), (east_junction, cy)], width=path_width)
add_brick_walk("Brick walk · east fork north", [
    (east_junction, cy), (x0 + court_width * 0.72, cy + court_depth * 0.12),
    (x0 + court_width * 0.64, cy + court_depth * 0.40), (x0 + court_width * 0.64, upper_y),
], width=path_width)
add_brick_walk("Brick walk · east fork south", [
    (east_junction, cy), (x0 + court_width * 0.72, cy - court_depth * 0.25),
    (x0 + court_width * 0.65, cy - court_depth * 0.40), (x0 + court_width * 0.65, lower_y),
], width=path_width)

for name, x, y in (
    ("west fork", west_junction, cy),
    ("east fork", east_junction, cy),
):
    add_path_junction(f"Brick junction · {name}", x, y)

for index, x in enumerate((cx - court_width * 0.04, cx + court_width * 0.04), start=1):
    add_courtyard_box(courtyard_collection, f"Garden sculpture {index} · stone plinth", (x, cy, COURTYARD_LEVEL_Z + 0.24), (1.9, 1.9, 0.32), court_stone, 0.08)
    add_courtyard_box(courtyard_collection, f"Garden sculpture {index} · inset basin", (x, cy, COURTYARD_LEVEL_Z + 0.43), (1.35, 1.35, 0.12), court_dark, 0.035)
    add_courtyard_box(courtyard_collection, f"Garden sculpture {index} · diagonal one", (x, cy, COURTYARD_LEVEL_Z + 0.57), (0.12, 1.05, 0.09), court_metal, 0.02, math.radians(45))
    add_courtyard_box(courtyard_collection, f"Garden sculpture {index} · diagonal two", (x, cy, COURTYARD_LEVEL_Z + 0.58), (0.12, 1.05, 0.09), court_metal, 0.02, math.radians(-45))
scene["Courtyard model"] = "Flat lawn and branching brick walks between New Millennium Hall 13 and Design Hall 09; two square garden sculptures"
scene["Courtyard elevation"] = f"Aligned to Design Hall entrance plane at {COURTYARD_LEVEL_Z:.2f} scene units"
campus_objects = [obj for obj in scene.objects if obj.type == "MESH"]

# Add unobtrusive Korean labels over the numbered campus buildings.
label_collection = bpy.data.collections["Campus Labels"]
font_path = Path(r"C:\Windows\Fonts\malgun.ttf")
label_font = bpy.data.fonts.load(str(font_path)) if font_path.exists() else None
label_material = make_emission("Campus label ivory", (0.93, 0.96, 1.0), 1.2)
label_count = 0
for obj in campus_objects:
    match = re.match(r"^(\d{2})_(.+)$", obj.name)
    if not match:
        continue
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    x = sum(point.x for point in corners) / len(corners)
    y = sum(point.y for point in corners) / len(corners)
    z = max(point.z for point in corners) + 1.8
    label = bpy.data.curves.new(f"Label_{match.group(1)}", "FONT")
    label.body = f"{match.group(1)}  {match.group(2)}"
    label.align_x = "CENTER"
    label.align_y = "CENTER"
    label.size = 2.0
    label.extrude = 0.025
    if label_font:
        label.font = label_font
    text_obj = bpy.data.objects.new(f"Label_{match.group(1)}_{match.group(2)}", label)
    label_collection.objects.link(text_obj)
    text_obj.location = (x, y, z)
    text_obj.data.materials.append(label_material)
    label_count += 1

# A restrained night-blue environment keeps the terrain and roads legible.
world = bpy.data.worlds.new("Campus twilight")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.035, 0.055, 0.09, 1.0)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.65
scene.world = world
scene["Terrain data"] = "SRTM 30 m via OpenTopoData; bilinear sample with light smoothing"
scene["Terrain source attribution"] = "USGS/NASA SRTM Version 3 via OpenTopoData public API"
scene["Google Elevation API"] = "Not configured here; Google requires an API key and billing"
scene["Terrain transform"] = "WGS84 origin 35.14495 N, 129.00945 E; z = (elevation_m - 68) * 0.65"
scene["Terrain smoothing"] = "One separable 3x3 low-pass pass; XY placement preserved"
scene["Road smoothing"] = "Bezier splines rebuilt from WGS84 path graph; elevations sampled from smoothed SRTM grid"
scene["Building bases aligned to terrain"] = building_shift_count

camera_data = bpy.data.cameras.new("Campus isometric camera")
camera = bpy.data.objects.new("Campus isometric camera", camera_data)
scene.collection.objects.link(camera)
camera.location = (center.x + map_width * 0.58, center.y - map_depth * 1.00, maximum.z + map_depth * 1.20)
look_at(camera, (center.x, center.y, minimum.z + (maximum.z - minimum.z) * 0.44))
camera_data.type = "ORTHO"
camera_data.ortho_scale = max(map_width * 1.12, map_depth * 1.48)
camera_data.lens = 52
scene.camera = camera

courtyard_camera_data = bpy.data.cameras.new("Courtyard overhead detail camera")
courtyard_camera = bpy.data.objects.new("Courtyard overhead detail camera", courtyard_camera_data)
scene.collection.objects.link(courtyard_camera)
courtyard_camera.location = (COURTYARD_CENTER_X, COURTYARD_CENTER_Y, COURTYARD_LEVEL_Z + 260.0)
look_at(courtyard_camera, (COURTYARD_CENTER_X, COURTYARD_CENTER_Y, COURTYARD_LEVEL_Z))
courtyard_camera_data.type = "ORTHO"
courtyard_camera_data.ortho_scale = max(landscape_width * 1.18, court_depth * 3.2)

sun_data = bpy.data.lights.new("Campus sun", "SUN")
sun = bpy.data.objects.new("Campus sun", sun_data)
scene.collection.objects.link(sun)
sun.location = (center.x + map_width, center.y - map_depth * 1.5, maximum.z + map_depth * 1.7)
sun_data.energy = 3.2
sun_data.angle = math.radians(18)
look_at(sun, (center.x, center.y, minimum.z))

key_data = bpy.data.lights.new("Large soft key", "AREA")
key = bpy.data.objects.new("Large soft key", key_data)
scene.collection.objects.link(key)
key.location = (center.x - map_width * 0.45, center.y - map_depth * 0.55, maximum.z + map_depth * 1.0)
key_data.energy = 900000
key_data.shape = "DISK"
key_data.size = map_width * 0.9
look_at(key, (center.x, center.y, minimum.z))

fill_data = bpy.data.lights.new("Cool fill", "AREA")
fill = bpy.data.objects.new("Cool fill", fill_data)
scene.collection.objects.link(fill)
fill.location = (center.x + map_width * 0.55, center.y + map_depth * 0.55, maximum.z + map_depth * 0.8)
fill_data.energy = 400000
fill_data.shape = "DISK"
fill_data.size = map_width * 0.8
fill_data.color = (0.56, 0.72, 1.0)
look_at(fill, (center.x, center.y, minimum.z + 20))

scene.render.engine = "BLENDER_EEVEE"
scene.eevee.taa_render_samples = 96
scene.render.resolution_x = 2200
scene.render.resolution_y = 1600
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.filepath = str(PREVIEW_PATH)
scene.render.film_transparent = False
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = 0.0
scene.view_settings.gamma = 1.0
scene.camera.data.lens = 52
scene.render.image_settings.color_depth = "8"
scene.render.use_file_extension = True

# Store the active view from the presentation camera so the file opens framed.
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type == "VIEW_3D":
            area.spaces.active.region_3d.view_perspective = "CAMERA"

scene.render.filepath = str(PREVIEW_PATH)
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
bpy.ops.render.render(write_still=True)
scene.camera = courtyard_camera
scene.render.resolution_x = 3200
scene.render.resolution_y = 2133
scene.render.filepath = str(COURTYARD_PREVIEW_PATH)
scene.eevee.taa_render_samples = 160
bpy.ops.render.render(write_still=True)
scene.camera = courtyard_camera
scene.render.resolution_x = 3200
scene.render.resolution_y = 2133
scene.render.filepath = str(COURTYARD_PREVIEW_PATH)
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type == "VIEW_3D":
            area.spaces.active.region_3d.view_perspective = "CAMERA"
bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
print(f"Saved {BLEND_PATH}")
print(f"Rendered {PREVIEW_PATH}")
print(f"Rendered {COURTYARD_PREVIEW_PATH}")
print(
    f"Campus mesh objects: {len(campus_objects)}; building labels: {label_count}; "
    f"building bases aligned: {building_shift_count}; courtyard elevation: {COURTYARD_LEVEL_Z:.2f}; "
    f"terrain vertices: {len(terrain_vertices)}; "
    f"smooth path chains: {len(path_chains)}"
)
