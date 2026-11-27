import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { Compass, Eye, LocateFixed, Maximize2, Minus, Plus, RotateCcw, Sparkles } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CAMPUS_CENTER, SEEDED_PATH_NODES } from './campusData'
import { classifySlope, type ActiveRouteData } from './FirstPerson3DNavigator'
import type { Building, Language } from './data'
import { EXT_UI_COPY, getLocalizedBuildingName } from './i18nCatalog'
import { formatCardinalDirection, requestCompassPermissionIfNeeded, stepAngleDeg } from './liveSensors'
import { ROUTE_NAV_CONFIG } from './routeNavigationConfig'

const METERS_PER_DEG_LAT = 111_320
const METERS_PER_DEG_LNG = 111_320 * Math.cos((CAMPUS_CENTER[0] * Math.PI) / 180)
const BASE_ELEV = 68

// Convert GPS (lat, lng) -> Blender XY (x: East+, y: North+)
function toBlenderXY(lat: number, lng: number): [number, number] {
  const bx = (lng - CAMPUS_CENTER[1]) * METERS_PER_DEG_LNG
  const by = (lat - CAMPUS_CENTER[0]) * METERS_PER_DEG_LAT
  return [bx, by]
}

// Convert Three.js glTF (+Y Up) world coordinates (tx, tz) back to GPS (lat, lng)
function fromThreeXZToGps(tx: number, tz: number): [number, number] {
  const bx = tx
  const by = -tz
  const lng = CAMPUS_CENTER[1] + bx / METERS_PER_DEG_LNG
  const lat = CAMPUS_CENTER[0] + by / METERS_PER_DEG_LAT
  return [lat, lng]
}

export default function Campus3DIsoMap({
  buildings,
  selected,
  userPosition,
  userLocationLabel,
  userHeadingDeg = 115,
  liveUserPosRef,
  liveHeadingRef,
  gpsActive = false,
  gpsAccuracyM = null,
  compassViewActive = false,
  compassActive = false,
  focusUserSignal = 0,
  activeRoute,
  passedPositions,
  progressDist = 0,
  isFollowing,
  cameraLock,
  pickingLocation,
  onSelectBuilding,
  onPickLocation,
  onTryGpsLocation,
  onToggleCompassView,
  onDisableCompassView,
  onUserCameraInterrupt,
  onRecenterFollowCamera,
  onSwitchTo2D,
  language = 'ko',
}: {
  buildings: Building[]
  selected: Building | null
  userPosition: [number, number]
  userLocationLabel: string
  userHeadingDeg?: number
  liveUserPosRef?: MutableRefObject<[number, number]>
  liveHeadingRef?: MutableRefObject<number>
  gpsActive?: boolean
  gpsAccuracyM?: number | null
  compassViewActive?: boolean
  compassActive?: boolean
  focusUserSignal?: number
  activeRoute: ActiveRouteData | null
  passedPositions: [number, number][]
  progressDist?: number
  isFollowing: boolean
  cameraLock: boolean
  pickingLocation: boolean
  onSelectBuilding: (building: Building) => void
  onPickLocation: (lat: number, lng: number) => void
  onTryGpsLocation: () => void
  onToggleCompassView?: () => void
  onDisableCompassView?: () => void
  onUserCameraInterrupt?: () => void
  onRecenterFollowCamera?: () => void
  onSwitchTo2D: () => void
  language?: Language
}) {
  const tx = EXT_UI_COPY[language]
  const stageRef = useRef<HTMLDivElement | null>(null)
  const webglContainerRef = useRef<HTMLDivElement | null>(null)
  const hudCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [showLabels, setShowLabels] = useState(true)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [activePreset, setActivePreset] = useState<'ortho' | 'iso' | 'flat'>('iso')
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelLoadError, setModelLoadError] = useState(false)
  const [meshStats, setMeshStats] = useState({ faces: 0, verts: 0 })

  // Three.js core refs
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const routeGroupRef = useRef<THREE.Group | null>(null)
  const userBeaconGroupRef = useRef<THREE.Group | null>(null)
  const buildingMeshesRef = useRef<THREE.Mesh[]>([])
  const roadMeshesRef = useRef<THREE.Mesh[]>([])
  const bldgMeshBoxesRef = useRef<Array<{ mesh: THREE.Mesh; minX: number; maxX: number; minZ: number; maxZ: number }>>([])
  const roadMeshBoxesRef = useRef<Array<{ mesh: THREE.Mesh; minX: number; maxX: number; minZ: number; maxZ: number }>>([])
  const roadSurfacePtsRef = useRef<THREE.Vector3[]>([])
  const terrainMeshRef = useRef<THREE.Mesh | null>(null)
  const terrainGridRef = useRef<Float32Array | null>(null)
  const bldgTopCentersRef = useRef<Map<number, THREE.Vector3>>(new Map())
  const bldgMeshByNumRef = useRef<Map<number, THREE.Mesh[]>>(new Map())
  const hitBoxesRef = useRef<Array<{ building: Building; cx: number; cy: number; r: number }>>([])
  const rafIdRef = useRef<number>(0)
  const smoothUserPos3DRef = useRef<THREE.Vector3 | null>(null)
  const smoothHeadingRef = useRef<number>(userHeadingDeg)
  const followDistRef = useRef<number>(175)
  const manualDragActiveRef = useRef<boolean>(false)
  const userSurfaceCacheRef = useRef<Map<string, { y: number; onBuilding: boolean }>>(new Map())
  const userSurfaceRcRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const userSurfaceOriginRef = useRef<THREE.Vector3>(new THREE.Vector3())
  const userSurfaceDownRef = useRef<THREE.Vector3>(new THREE.Vector3(0, -1, 0))

  // Elevation field interpolator matching the exact Blender terrain formula
  const elevationNodes = useMemo(() => {
    return SEEDED_PATH_NODES.map((n) => {
      const [bx, by] = toBlenderXY(n.location.coordinates[1], n.location.coordinates[0])
      return { bx, by, elev: (n.elevation - BASE_ELEV) * 0.65 }
    })
  }, [])

  const getGroundY = useCallback(
    (bx: number, by: number): number => {
      const grid = terrainGridRef.current
      if (grid) {
        const fx = (bx - -352) / 4
        const fy = (by - -272) / 4
        if (fx >= 0 && fx <= 177 && fy >= 0 && fy <= 123) {
          const gx0 = Math.min(176, Math.floor(fx))
          const gy0 = Math.min(122, Math.floor(fy))
          const tx = fx - gx0
          const ty = fy - gy0
          const z00 = grid[gx0 * 124 + gy0]
          const z10 = grid[(gx0 + 1) * 124 + gy0]
          const z01 = grid[gx0 * 124 + (gy0 + 1)]
          const z11 = grid[(gx0 + 1) * 124 + (gy0 + 1)]
          if (Number.isFinite(z00) && Number.isFinite(z10) && Number.isFinite(z01) && Number.isFinite(z11)) {
            const za = z00 * (1 - tx) + z10 * tx
            const zb = z01 * (1 - tx) + z11 * tx
            return za * (1 - ty) + zb * ty
          }
        }
      }
      let num = 0
      let den = 0
      for (const en of elevationNodes) {
        const d2 = (bx - en.bx) ** 2 + (by - en.by) ** 2
        if (d2 < 2) return en.elev
        if (d2 < 25000) {
          const w = 1 / (d2 * Math.sqrt(d2))
          num += en.elev * w
          den += w
        }
      }
      if (den > 0) return num / den
      return Math.max(0, (80 - by) * 0.24)
    },
    [elevationNodes],
  )

  // Convert GPS (lat, lng) -> Three.js Vector3 (tx = bx, ty = elev, tz = -by)
  const toThreeVec3 = useCallback(
    (lat: number, lng: number, heightOffset = 0): THREE.Vector3 => {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return new THREE.Vector3(0, 12, 0)
      }
      const [bx, by] = toBlenderXY(lat, lng)
      const bz = getGroundY(bx, by) + heightOffset
      return new THREE.Vector3(bx, Number.isFinite(bz) ? bz : 12, -by)
    },
    [getGroundY],
  )

  // Cached vertical-surface elevation for the live user marker: lifts the marker onto building roofs
  // when standing inside a building footprint so 3D isometric perspective parallax does not shift the dot South,
  // while keeping outdoor markers tightly anchored just above roads/terrain (eliminating floating parallax).
  const getUserSurfaceInfo = useCallback(
    (bx: number, by: number): { y: number; onBuilding: boolean } => {
      const cache = userSurfaceCacheRef.current
      const key = `${Math.round(bx * 2)},${Math.round(by * 2)}`
      const cached = cache.get(key)
      if (cached !== undefined) return cached

      const groundY = getGroundY(bx, by)
      const tx = bx
      const tz = -by
      const rc = userSurfaceRcRef.current
      userSurfaceOriginRef.current.set(tx, 240, tz)
      rc.set(userSurfaceOriginRef.current, userSurfaceDownRef.current)

      const candBldgs = bldgMeshBoxesRef.current.length
        ? bldgMeshBoxesRef.current
            .filter((b) => tx >= b.minX && tx <= b.maxX && tz >= b.minZ && tz <= b.maxZ)
            .map((b) => b.mesh)
        : buildingMeshesRef.current
      const bHits = candBldgs.length ? rc.intersectObjects(candBldgs, false) : []
      const bldgY = bHits.length > 0 ? bHits[0].point.y : null

      let info: { y: number; onBuilding: boolean }
      if (bldgY !== null && bldgY > groundY + 2.0) {
        info = { y: bldgY, onBuilding: true }
      } else {
        const candRoads = roadMeshBoxesRef.current.length
          ? roadMeshBoxesRef.current
              .filter((b) => tx >= b.minX && tx <= b.maxX && tz >= b.minZ && tz <= b.maxZ)
              .map((b) => b.mesh)
          : roadMeshesRef.current
        const rHits = candRoads.length ? rc.intersectObjects(candRoads, false) : []
        const roadY = rHits.length > 0 ? rHits[0].point.y : null
        info = { y: roadY ?? groundY, onBuilding: false }
      }

      if (cache.size >= 512) {
        cache.clear()
      }
      cache.set(key, info)
      return info
    },
    [getGroundY],
  )

  const toUserThreeVec3 = useCallback(
    (lat: number, lng: number): THREE.Vector3 => {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return new THREE.Vector3(0, 12, 0)
      }
      const [bx, by] = toBlenderXY(lat, lng)
      const { y, onBuilding } = getUserSurfaceInfo(bx, by)
      const liftedY = y + (onBuilding ? 0.7 : 0.45)
      return new THREE.Vector3(bx, Number.isFinite(liftedY) ? liftedY : 12, -by)
    },
    [getUserSurfaceInfo],
  )
  const toUserThreeVec3Ref = useRef(toUserThreeVec3)
  toUserThreeVec3Ref.current = toUserThreeVec3

  // Latest state refs for the render loop
  const stateRef = useRef({
    buildings,
    selected,
    hoveredId,
    showLabels,
    userPosition,
    userLocationLabel,
    userHeadingDeg,
    liveUserPosRef,
    liveHeadingRef,
    gpsActive,
    gpsAccuracyM,
    compassViewActive,
    compassActive,
    activeRoute,
    passedPositions,
    isFollowing,
    cameraLock,
    onDisableCompassView,
    onUserCameraInterrupt,
    language,
    tx,
    modelLoaded,
    meshStats,
  })
  stateRef.current = {
    buildings,
    selected,
    hoveredId,
    showLabels,
    userPosition,
    userLocationLabel,
    userHeadingDeg,
    liveUserPosRef,
    liveHeadingRef,
    gpsActive,
    gpsAccuracyM,
    compassViewActive,
    compassActive,
    activeRoute,
    passedPositions,
    isFollowing,
    cameraLock,
    onDisableCompassView,
    onUserCameraInterrupt,
    language,
    tx,
    modelLoaded,
    meshStats,
  }

  // Initialize Three.js WebGL Scene & Load Blender's campus_scene.glb
  useEffect(() => {
    const container = webglContainerRef.current
    if (!container) return

    const width = Math.max(320, container.clientWidth)
    const height = Math.max(260, container.clientHeight)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#1d232c')
    scene.fog = new THREE.FogExp2('#1d232c', 0.00045)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(36, width / height, 1.0, 2500)
    // Match Blender's isometric overview camera position (Blender: X=25, Y=-510, Z=360 -> Three: X=25, Y=360, Z=510)
    camera.position.set(25, 340, 490)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.innerHTML = ''
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(10, 38, 25)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.maxPolarAngle = Math.PI * 0.47
    controls.minPolarAngle = 0.05
    controls.minDistance = 45
    controls.maxDistance = 1400
    controls.screenSpacePanning = false
    controls.update()
    controlsRef.current = controls

    const activePointers = new Map<number, { x: number; y: number; downX: number; downY: number }>()
    let prevPinchDist: number | null = null

    const getPinchDist = () => {
      if (activePointers.size < 2) return null
      const pts = Array.from(activePointers.values())
      return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
    }

    const onDomPointerDown = (e: PointerEvent) => {
      void requestCompassPermissionIfNeeded().catch(() => 'unsupported')
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY, downX: e.clientX, downY: e.clientY })
      prevPinchDist = getPinchDist()
    }

    const onDomPointerMove = (e: PointerEvent) => {
      const entry = activePointers.get(e.pointerId)
      if (!entry) return
      entry.x = e.clientX
      entry.y = e.clientY

      if (activePointers.size >= 2) {
        const nextPinch = getPinchDist()
        if (nextPinch && prevPinchDist && nextPinch > 4 && prevPinchDist > 4) {
          const factor = prevPinchDist / nextPinch
          followDistRef.current = Math.max(
            ROUTE_NAV_CONFIG.CAMERA_MIN_DISTANCE,
            Math.min(520, followDistRef.current * factor),
          )
          if (stateRef.current.isFollowing && stateRef.current.cameraLock) {
            stateRef.current.onUserCameraInterrupt?.()
          }
        }
        prevPinchDist = nextPinch
        return
      }

      const moved = Math.hypot(e.clientX - entry.downX, e.clientY - entry.downY)
      if (moved > 10) {
        manualDragActiveRef.current = true
        if (stateRef.current.isFollowing && stateRef.current.cameraLock) {
          stateRef.current.onUserCameraInterrupt?.()
        }
        if (stateRef.current.compassViewActive) {
          stateRef.current.onDisableCompassView?.()
        }
      }
    }

    const onDomPointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId)
      prevPinchDist = getPinchDist()
      if (activePointers.size === 0) {
        manualDragActiveRef.current = false
      }
    }

    const onDomWheel = (e: WheelEvent) => {
      const st = stateRef.current
      if (st.isFollowing && st.cameraLock) {
        st.onUserCameraInterrupt?.()
      }
      if (st.compassViewActive || st.isFollowing) {
        const factor = e.deltaY > 0 ? 1.09 : 0.92
        followDistRef.current = Math.max(
          ROUTE_NAV_CONFIG.CAMERA_MIN_DISTANCE,
          Math.min(520, followDistRef.current * factor),
        )
      }
    }

    const domEl = renderer.domElement
    domEl.addEventListener('pointerdown', onDomPointerDown)
    domEl.addEventListener('pointermove', onDomPointerMove)
    domEl.addEventListener('pointerup', onDomPointerUp)
    domEl.addEventListener('pointercancel', onDomPointerUp)
    domEl.addEventListener('wheel', onDomWheel, { passive: true })

    // Lighting matching Blender EEVEE setup
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 1.35)
    hemiLight.position.set(0, 400, 0)
    scene.add(hemiLight)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.3)
    sunLight.position.set(180, 380, 240)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    sunLight.shadow.camera.near = 20
    sunLight.shadow.camera.far = 1400
    const d = 390
    sunLight.shadow.camera.left = -d
    sunLight.shadow.camera.right = d
    sunLight.shadow.camera.top = d
    sunLight.shadow.camera.bottom = -d
    sunLight.shadow.bias = -0.0005
    sunLight.shadow.normalBias = 0.04
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65)
    fillLight.position.set(-220, 200, -180)
    scene.add(fillLight)

    const routeGroup = new THREE.Group()
    scene.add(routeGroup)
    routeGroupRef.current = routeGroup

    // Ground-projected 3D smartphone heading cone & positional ring (0 deg = -Z North, clockwise +Y rotation negated)
    const userBeaconGroup = new THREE.Group()
    const coneGeom = new THREE.CircleGeometry(15, 24, Math.PI * 0.5 - 0.45, 0.9)
    coneGeom.rotateX(-Math.PI / 2)
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const coneMesh = new THREE.Mesh(coneGeom, coneMat)
    coneMesh.renderOrder = 3
    userBeaconGroup.add(coneMesh)

    const ringGeom = new THREE.RingGeometry(3.2, 4.4, 24)
    ringGeom.rotateX(-Math.PI / 2)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const ringMesh = new THREE.Mesh(ringGeom, ringMat)
    ringMesh.position.y = 0.08
    ringMesh.renderOrder = 4
    userBeaconGroup.add(ringMesh)

    const arrowGeom = new THREE.ConeGeometry(1.75, 4.4, 3)
    arrowGeom.rotateX(-Math.PI / 2)
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false })
    const arrowMesh = new THREE.Mesh(arrowGeom, arrowMat)
    arrowMesh.position.set(0, 0.25, -4.6)
    arrowMesh.renderOrder = 5
    userBeaconGroup.add(arrowMesh)

    scene.add(userBeaconGroup)
    userBeaconGroupRef.current = userBeaconGroup

    // Load exact Blender 3D Campus Model (/campus_scene.glb)
    const loader = new GLTFLoader()
    const maxAniso = renderer.capabilities.getMaxAnisotropy()

    loader.load(
      '/campus_scene.glb?v=62',
      (gltf) => {
        const root = gltf.scene
        root.updateMatrixWorld(true)
        const bMeshes: THREE.Mesh[] = []
        const rMeshes: THREE.Mesh[] = []
        const rPts: THREE.Vector3[] = []
        const byNum = new Map<number, THREE.Mesh[]>()
        const topCenters = new Map<number, THREE.Vector3>()
        const terrainGrid = new Float32Array(178 * 124)
        terrainGrid.fill(Number.NaN)
        const tmpVert = new THREE.Vector3()
        let filledTerrainVerts = 0
        let totalVerts = 0
        let totalFaces = 0

        root.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh
            mesh.castShadow = true
            mesh.receiveShadow = true

            if (mesh.geometry) {
              const posAttr = mesh.geometry.attributes.position
              if (posAttr) totalVerts += posAttr.count
              if (mesh.geometry.index) {
                totalFaces += mesh.geometry.index.count / 3
              } else if (posAttr) {
                totalFaces += posAttr.count / 3
              }
            }

            // Maximize texture sharpness at oblique angles
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            for (const m of mats) {
              const stdMat = m as THREE.MeshStandardMaterial
              if (stdMat.map) {
                stdMat.map.anisotropy = maxAniso
                stdMat.map.needsUpdate = true
              }
              if (stdMat.roughnessMap) {
                stdMat.roughnessMap.anisotropy = maxAniso
              }
            }

            // Identify building number from Blender object name (e.g. "01_국제협력관", "13_뉴밀레니엄관")
            const checkName = `${mesh.parent?.name ?? ''} ${mesh.name}`
            const match = checkName.match(/(?:^|\s)(\d{2})_/)
            if (match) {
              const bNum = parseInt(match[1], 10)
              mesh.userData.campusNumber = bNum
              bMeshes.push(mesh)
              const list = byNum.get(bNum) ?? []
              list.push(mesh)
              byNum.set(bNum, list)
            } else if (checkName.includes('Campus_Roads') || checkName.includes('MinseokCorridor') || checkName.includes('Landmark_')) {
              rMeshes.push(mesh)
              if (checkName.includes('Campus_Roads') || checkName.includes('MinseokCorridor')) {
                const posAttr = mesh.geometry?.attributes.position
                if (posAttr) {
                  mesh.updateWorldMatrix(true, false)
                  for (let i = 0; i < posAttr.count; i += 3) {
                    const p = new THREE.Vector3().fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrixWorld)
                    rPts.push(p)
                  }
                }
              }
            } else if (checkName.includes('Campus_Terrain')) {
              terrainMeshRef.current = mesh
              const posAttr = mesh.geometry?.attributes.position
              if (posAttr) {
                mesh.updateWorldMatrix(true, false)
                for (let i = 0; i < posAttr.count; i++) {
                  tmpVert.fromBufferAttribute(posAttr, i).applyMatrix4(mesh.matrixWorld)
                  const gx = Math.round((tmpVert.x - -352) / 4)
                  const gy = Math.round((-tmpVert.z - -272) / 4)
                  if (gx >= 0 && gx < 178 && gy >= 0 && gy < 124) {
                    terrainGrid[gx * 124 + gy] = tmpVert.y
                    filledTerrainVerts += 1
                  }
                }
              }
            }
          }
        })

        if (filledTerrainVerts > 1000) {
          terrainGridRef.current = terrainGrid
        }

        // Compute world bounding box top center for each building (1..31)
        byNum.forEach((meshes, bNum) => {
          const box = new THREE.Box3()
          meshes.forEach((m) => box.expandByObject(m))
          const center = new THREE.Vector3()
          box.getCenter(center)
          center.y = box.max.y
          topCenters.set(bNum, center)
        })

        const toMeshBox = (m: THREE.Mesh) => {
          const box = new THREE.Box3().setFromObject(m)
          return { mesh: m, minX: box.min.x - 1, maxX: box.max.x + 1, minZ: box.min.z - 1, maxZ: box.max.z + 1 }
        }
        buildingMeshesRef.current = bMeshes
        roadMeshesRef.current = rMeshes
        bldgMeshBoxesRef.current = bMeshes.map(toMeshBox)
        roadMeshBoxesRef.current = rMeshes.map(toMeshBox)
        userSurfaceCacheRef.current.clear()
        roadSurfacePtsRef.current = rPts
        bldgMeshByNumRef.current = byNum
        bldgTopCentersRef.current = topCenters
        setMeshStats({ faces: Math.round(totalFaces), verts: totalVerts })
        setModelLoadError(false)
        setModelLoaded(true)
        scene.add(root)
      },
      undefined,
      (err) => {
        console.error('Failed to load /campus_scene.glb:', err)
        setModelLoadError(true)
      },
    )

    // Resize observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return
      const w = Math.max(320, container.clientWidth)
      const h = Math.max(260, container.clientHeight)
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    // Animation & Synchronized 2D HUD Overlay Loop
    const projVec = new THREE.Vector3()
    const aheadVec = new THREE.Vector3()
    const desiredTarget = new THREE.Vector3()
    const desiredCam = new THREE.Vector3()
    let lastFrameTime = performance.now()

    const animate = () => {
      rafIdRef.current = requestAnimationFrame(animate)

      const nowPerf = performance.now()
      const dt = Math.min(0.05, Math.max(0.001, (nowPerf - lastFrameTime) / 1000))
      lastFrameTime = nowPerf
      const st = stateRef.current
      const posRate =
        st.gpsActive && !st.isFollowing ? 22.0 : ROUTE_NAV_CONFIG.POSITION_SMOOTHING
      const posAlpha = 1 - Math.exp(-posRate * dt)
      const headAlpha = 1 - Math.exp(-ROUTE_NAV_CONFIG.HEADING_SMOOTHING * dt)

      const liveLatLng = st.liveUserPosRef?.current ?? st.userPosition
      const targetUser3D = toUserThreeVec3Ref.current(liveLatLng[0], liveLatLng[1])
      const targetHeadingDeg = st.liveHeadingRef?.current ?? st.userHeadingDeg

      if (!smoothUserPos3DRef.current) {
        smoothUserPos3DRef.current = targetUser3D.clone()
      } else {
        smoothUserPos3DRef.current.lerp(targetUser3D, posAlpha)
      }
      smoothHeadingRef.current = stepAngleDeg(smoothHeadingRef.current, targetHeadingDeg, headAlpha)

      const sPos = smoothUserPos3DRef.current
      const hRad = (smoothHeadingRef.current * Math.PI) / 180
      if (userBeaconGroupRef.current) {
        userBeaconGroupRef.current.position.set(sPos.x, sPos.y - 0.18, sPos.z)
        userBeaconGroupRef.current.rotation.y = -hRad
      }

      const isWaypointFollowLock = st.isFollowing && st.cameraLock && !manualDragActiveRef.current
      const shouldHeadingLock = (st.compassViewActive || isWaypointFollowLock) && !manualDragActiveRef.current

      if (shouldHeadingLock) {
        const dist = followDistRef.current
        if (isWaypointFollowLock) {
          // 50°~60° tilted 3D navigation view with forward lookahead along the waypoint path
          const tiltRad = (ROUTE_NAV_CONFIG.CAMERA_TILT_DEG * Math.PI) / 180
          const hDist = Math.sin(tiltRad) * dist
          const vDist = Math.cos(tiltRad) * dist
          const lookAhead = ROUTE_NAV_CONFIG.CAMERA_LOOKAHEAD_OFFSET
          desiredTarget.set(
            sPos.x + Math.sin(hRad) * lookAhead,
            sPos.y + 2.5,
            sPos.z - Math.cos(hRad) * lookAhead,
          )
          desiredCam.set(
            sPos.x - Math.sin(hRad) * hDist,
            sPos.y + 2.5 + vDist,
            sPos.z + Math.cos(hRad) * hDist,
          )
        } else {
          const pitchRad = 0.66
          const hDist = Math.cos(pitchRad) * dist
          const vDist = Math.sin(pitchRad) * dist
          desiredTarget.set(sPos.x, sPos.y + 2.5, sPos.z)
          desiredCam.set(
            sPos.x - Math.sin(hRad) * hDist,
            sPos.y + 2.5 + vDist,
            sPos.z + Math.cos(hRad) * hDist,
          )
        }
        controls.target.lerp(desiredTarget, posAlpha)
        camera.position.lerp(desiredCam, posAlpha)
        controls.enableDamping = false
        controls.update()
        controls.enableDamping = true
      } else {
        controls.update()
      }

      renderer.render(scene, camera)

      // Render crisp 2D HUD Overlay (Red Number Badges 1..31, Building Names, Route Slope Chips, User Beacon & Compass)
      const hud = hudCanvasRef.current
      if (!hud) return
      const ctx = hud.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const cw = container.clientWidth
      const ch = container.clientHeight
      if (hud.width !== cw * dpr || hud.height !== ch * dpr) {
        hud.width = cw * dpr
        hud.height = ch * dpr
      }
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, cw, ch)

      const projectToScreen = (worldPos: THREE.Vector3) => {
        projVec.copy(worldPos).project(camera)
        return {
          sx: (projVec.x * 0.5 + 0.5) * cw,
          sy: (-projVec.y * 0.5 + 0.5) * ch,
          z: projVec.z,
        }
      }

      // 1. Slope Chips along active route
      if (st.activeRoute && st.activeRoute.segments.length > 0) {
        for (const seg of st.activeRoute.segments) {
          if (Math.abs(seg.slope_pct) >= 3.0 || !seg.is_step_free) {
            const midLat = (seg.from_coord[0] + seg.to_coord[0]) * 0.5
            const midLng = (seg.from_coord[1] + seg.to_coord[1]) * 0.5
            const midPos = toThreeVec3(midLat, midLng, 5.5)
            const sp = projectToScreen(midPos)
            if (sp.z > -1 && sp.z < 1) {
              const info = classifySlope(seg.slope_pct, seg.is_step_free, st.language)
              const txt = info.shortLabel
              ctx.font = '800 9.5px "Noto Sans KR", sans-serif'
              const tw = ctx.measureText(txt).width + 12
              ctx.fillStyle = info.color
              ctx.beginPath()
              ctx.roundRect(sp.sx - tw / 2, sp.sy - 10, tw, 18, 8)
              ctx.fill()
              ctx.strokeStyle = '#ffffff'
              ctx.lineWidth = 1.4
              ctx.stroke()
              ctx.fillStyle = '#ffffff'
              ctx.textAlign = 'center'
              ctx.fillText(txt, sp.sx, sp.sy + 2.5)
            }
          }
        }
      }

      // 2. Building Number Badges (1..31) & Names synced to Blender 3D Mesh rooftops
      const nextHits: Array<{ building: Building; cx: number; cy: number; r: number }> = []
      const badgeDrawItems: Array<{ depth: number; draw: () => void }> = []

      for (const b of st.buildings) {
        const num = b.campusNumber ?? b.id
        const isSelected = st.selected?.id === b.id
        const isHovered = st.hoveredId === b.id

        let topPos = bldgTopCentersRef.current.get(num)
        if (!topPos) {
          const levels = Math.max(1, b.levels ?? 4)
          topPos = toThreeVec3(b.lat, b.lng, levels * 3.35 + 2)
        }
        const pinWorld = new THREE.Vector3(topPos.x, topPos.y + 6.5, topPos.z)
        const sp = projectToScreen(pinWorld)
        if (sp.z <= -1 || sp.z >= 1) continue

        const badgeRadius = isSelected || isHovered ? 15.5 : 12.5
        nextHits.push({
          building: b,
          cx: sp.sx,
          cy: sp.sy,
          r: Math.max(28, badgeRadius + 12),
        })

        badgeDrawItems.push({
          depth: sp.z,
          draw: () => {
            if (isSelected || isHovered) {
              ctx.beginPath()
              ctx.arc(sp.sx, sp.sy, badgeRadius + 6, 0, Math.PI * 2)
              ctx.fillStyle = 'rgba(250, 204, 21, 0.5)'
              ctx.fill()
            }

            const grad = ctx.createRadialGradient(sp.sx - 3, sp.sy - 4, 2, sp.sx, sp.sy, badgeRadius)
            if (isSelected) {
              grad.addColorStop(0, '#fde047')
              grad.addColorStop(0.55, '#ea580c')
              grad.addColorStop(1, '#9a3412')
            } else {
              grad.addColorStop(0, '#fb7185')
              grad.addColorStop(0.5, '#dc2626')
              grad.addColorStop(1, '#991b1b')
            }

            ctx.beginPath()
            ctx.arc(sp.sx, sp.sy + 2, badgeRadius, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.42)'
            ctx.fill()

            ctx.beginPath()
            ctx.arc(sp.sx, sp.sy, badgeRadius, 0, Math.PI * 2)
            ctx.fillStyle = grad
            ctx.fill()
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 2.2
            ctx.stroke()

            ctx.fillStyle = '#ffffff'
            ctx.font = isSelected
              ? '900 12.5px Manrope, "Noto Sans KR", sans-serif'
              : '800 11px Manrope, "Noto Sans KR", sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(String(num), sp.sx, sp.sy + 0.5)
            ctx.textBaseline = 'alphabetic'

            if (st.showLabels || isSelected || isHovered) {
              const name = getLocalizedBuildingName(b, st.language)
              ctx.font =
                isSelected || isHovered
                  ? '800 10.5px "Noto Sans KR", sans-serif'
                  : '700 9.5px "Noto Sans KR", sans-serif'
              ctx.textAlign = 'center'
              ctx.textBaseline = 'top'
              ctx.lineJoin = 'round'
              ctx.lineWidth = 3.2
              ctx.strokeStyle = 'rgba(10, 20, 30, 0.92)'
              ctx.strokeText(name, sp.sx, sp.sy + badgeRadius + 4)
              ctx.fillStyle = isSelected || isHovered ? '#fde047' : '#ffffff'
              ctx.fillText(name, sp.sx, sp.sy + badgeRadius + 4)
              ctx.textBaseline = 'alphabetic'
            }
          },
        })
      }

      // Draw far-to-near badges
      badgeDrawItems.sort((a, b) => b.depth - a.depth)
      for (const item of badgeDrawItems) {
        item.draw()
      }
      hitBoxesRef.current = nextHits

      // 3. Live User Location 3D Beacon (animated pulse + perspective-accurate directional heading cone & ▲ arrow)
      const uPos3D = smoothUserPos3DRef.current ?? toUserThreeVec3Ref.current(st.userPosition[0], st.userPosition[1])
      const uSp = projectToScreen(uPos3D)
      if (uSp.z > -1 && uSp.z < 1) {
        const azimuth = controls.getAzimuthalAngle()
        const hRadLive = (smoothHeadingRef.current * Math.PI) / 180
        const pulsePhase = (performance.now() % 1800) / 1800
        const pulseRadius = st.gpsActive || st.compassActive ? 12 + pulsePhase * 22 : 18
        const pulseAlpha = st.gpsActive || st.compassActive ? (1 - pulsePhase) * 0.55 : 0.35

        // Project a 14m forward point along phone heading in 3D space for exact perspective screen angle
        aheadVec.set(
          uPos3D.x + Math.sin(hRadLive) * 14,
          uPos3D.y,
          uPos3D.z - Math.cos(hRadLive) * 14,
        )
        const aheadSp = projectToScreen(aheadVec)
        const screenHeadingRad =
          Math.hypot(aheadSp.sx - uSp.sx, aheadSp.sy - uSp.sy) > 1.5
            ? Math.atan2(aheadSp.sy - uSp.sy, aheadSp.sx - uSp.sx)
            : hRadLive + azimuth - Math.PI / 2

        // Directional heading cone synced with phone compass & 3D perspective
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(uSp.sx, uSp.sy)
        ctx.arc(uSp.sx, uSp.sy, 38, screenHeadingRad - 0.44, screenHeadingRad + 0.44)
        ctx.closePath()
        ctx.fillStyle = st.gpsActive || st.compassActive ? 'rgba(59, 130, 246, 0.38)' : 'rgba(59, 130, 246, 0.24)'
        ctx.fill()
        ctx.restore()

        // Expanding live radar ring
        ctx.beginPath()
        ctx.arc(uSp.sx, uSp.sy, pulseRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(37, 99, 235, ${pulseAlpha * 0.6})`
        ctx.fill()
        ctx.strokeStyle = `rgba(96, 165, 250, ${Math.max(0.25, pulseAlpha)})`
        ctx.lineWidth = 2
        ctx.stroke()

        // Core blue beacon dot
        ctx.beginPath()
        ctx.arc(uSp.sx, uSp.sy, 10, 0, Math.PI * 2)
        ctx.fillStyle = st.gpsActive || st.compassActive ? '#2563eb' : '#1d4ed8'
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2.6
        ctx.stroke()

        // Crisp rotating white directional ▲ arrow (matching 2D marker's .user-nav-arrow)
        ctx.save()
        ctx.translate(uSp.sx, uSp.sy)
        ctx.rotate(screenHeadingRad + Math.PI / 2)
        ctx.beginPath()
        ctx.moveTo(0, -5.8)
        ctx.lineTo(4.4, 4.4)
        ctx.lineTo(0, 2.3)
        ctx.lineTo(-4.4, 4.4)
        ctx.closePath()
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        ctx.restore()

        const dirLabel = formatCardinalDirection(smoothHeadingRef.current, st.language)
        const dirDeg = Math.round(smoothHeadingRef.current)
        const accSuffix =
          st.gpsActive && st.gpsAccuracyM !== null && st.gpsAccuracyM > 12 ? ` · ±${st.gpsAccuracyM}m` : ''
        const uTxt = `${st.tx.myLocPillPrefix} · ${st.userLocationLabel}${accSuffix} · ${dirLabel} ${dirDeg}°`
        ctx.font = '800 10px "Noto Sans KR", sans-serif'
        const liveDotPad = st.gpsActive || st.compassActive ? 11 : 0
        const uw = ctx.measureText(uTxt).width + 15 + liveDotPad
        const pillX = uSp.sx - uw / 2
        const pillY = uSp.sy - 36
        ctx.fillStyle = st.gpsActive || st.compassActive ? '#1d4ed8' : '#1e3a8a'
        ctx.beginPath()
        ctx.roundRect(pillX, pillY, uw, 19, 9)
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1.5
        ctx.stroke()

        if (st.gpsActive || st.compassActive) {
          ctx.beginPath()
          ctx.arc(pillX + 10, pillY + 9.5, 3.2, 0, Math.PI * 2)
          ctx.fillStyle = st.compassActive ? '#5eead4' : '#4ade80'
          ctx.fill()
        }

        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(uTxt, uSp.sx + liveDotPad / 2, pillY + 13)
      }

      // 4. Top-Left 3D Compass Rose (tap to toggle phone heading view)
      const compX = 36
      const compY = 36
      const compR = 20
      ctx.beginPath()
      ctx.arc(compX, compY, compR, 0, Math.PI * 2)
      ctx.fillStyle = st.compassViewActive ? 'rgba(13, 148, 136, 0.92)' : 'rgba(15, 23, 42, 0.85)'
      ctx.fill()
      ctx.strokeStyle = st.compassViewActive ? '#5eead4' : 'rgba(255, 255, 255, 0.25)'
      ctx.lineWidth = st.compassViewActive ? 2.2 : 1.2
      ctx.stroke()

      const azimuth = controls.getAzimuthalAngle()
      ctx.save()
      ctx.translate(compX, compY)
      ctx.rotate(azimuth)
      ctx.beginPath()
      ctx.moveTo(0, -compR + 3)
      ctx.lineTo(4.5, 2)
      ctx.lineTo(0, 0)
      ctx.lineTo(-4.5, 2)
      ctx.closePath()
      ctx.fillStyle = '#ef4444'
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(0, compR - 3)
      ctx.lineTo(4.5, 0)
      ctx.lineTo(0, 2)
      ctx.lineTo(-4.5, 0)
      ctx.closePath()
      ctx.fillStyle = '#94a3b8'
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = '900 8.5px Manrope, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('N', 0, -compR + 1)
      ctx.restore()

      ctx.restore()
    }

    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafIdRef.current)
      domEl.removeEventListener('pointerdown', onDomPointerDown)
      domEl.removeEventListener('pointermove', onDomPointerMove)
      domEl.removeEventListener('pointerup', onDomPointerUp)
      domEl.removeEventListener('pointercancel', onDomPointerUp)
      domEl.removeEventListener('wheel', onDomWheel)
      ro.disconnect()
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh
          mesh.geometry?.dispose()
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          for (const m of mats) {
            if (!m) continue
            const std = m as THREE.MeshStandardMaterial
            std.map?.dispose()
            std.roughnessMap?.dispose()
            std.normalMap?.dispose()
            m.dispose()
          }
        }
      })
      controls.dispose()
      renderer.dispose()
    }
  }, [toThreeVec3])

  // Highlight selected / hovered building meshes in real-time 3D
  useEffect(() => {
    const selNum = selected ? (selected.campusNumber ?? selected.id) : null
    const hovNum = hoveredId
      ? (buildings.find((b) => b.id === hoveredId)?.campusNumber ?? hoveredId)
      : null

    bldgMeshByNumRef.current.forEach((meshes, bNum) => {
      const isSel = bNum === selNum
      const isHov = bNum === hovNum
      for (const mesh of meshes) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        for (const m of mats) {
          const std = m as THREE.MeshStandardMaterial
          if (std.emissive) {
            if (isSel) {
              std.emissive.setHex(0xca8a04)
              std.emissiveIntensity = 0.28
            } else if (isHov) {
              std.emissive.setHex(0x0284c7)
              std.emissiveIntensity = 0.22
            } else {
              std.emissive.setHex(0x000000)
              std.emissiveIntensity = 0
            }
          }
        }
      }
    })
  }, [selected, hoveredId, buildings, modelLoaded])

  // Snap 3D route points onto actual GLB road/sidewalk meshes & exact road elevations (never through buildings)
  const snapToRoad3D = useMemo(() => {
    const downDir = new THREE.Vector3(0, -1, 0)
    const originVec = new THREE.Vector3()
    const rc = new THREE.Raycaster()

    const sampleSurfaceY = (x: number, z: number): { roadY: number | null; terrainY: number | null; bldgY: number | null } => {
      originVec.set(x, 180, z)
      rc.set(originVec, downDir)

      const candRoads = roadMeshBoxesRef.current.length
        ? roadMeshBoxesRef.current.filter((b) => x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ).map((b) => b.mesh)
        : roadMeshesRef.current
      const candBldgs = bldgMeshBoxesRef.current.length
        ? bldgMeshBoxesRef.current.filter((b) => x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ).map((b) => b.mesh)
        : buildingMeshesRef.current

      const rHits = candRoads.length ? rc.intersectObjects(candRoads, false) : []
      const tHits = terrainMeshRef.current ? rc.intersectObject(terrainMeshRef.current, false) : []
      const bHits = candBldgs.length ? rc.intersectObjects(candBldgs, false) : []
      return {
        roadY: rHits.length ? rHits[0].point.y : null,
        terrainY: tHits.length ? tHits[0].point.y : null,
        bldgY: bHits.length ? bHits[0].point.y : null,
      }
    }

    return (lat: number, lng: number): THREE.Vector3 => {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return new THREE.Vector3(0, 12, 0)
      }
      const [bx, by] = toBlenderXY(lat, lng)
      let tx = bx
      let tz = -by

      const initial = sampleSurfaceY(tx, tz)
      const baseGroundY = initial.roadY ?? initial.terrainY ?? getGroundY(bx, by)
      const insideBuilding = initial.bldgY !== null && initial.bldgY > baseGroundY + 1.8

      if ((insideBuilding || initial.roadY === null) && roadSurfacePtsRef.current.length > 0) {
        const searchRadius = insideBuilding ? 18 : 3.5
        let bestDist = searchRadius
        let bestPt: THREE.Vector3 | null = null
        for (const rp of roadSurfacePtsRef.current) {
          const d = Math.hypot(rp.x - tx, rp.z - tz)
          if (d < bestDist) {
            bestDist = d
            bestPt = rp
          }
        }
        if (bestPt) {
          tx = bestPt.x
          tz = bestPt.z
          const snapped = sampleSurfaceY(tx, tz)
          const snappedY = snapped.roadY ?? bestPt.y ?? snapped.terrainY ?? getGroundY(tx, -tz)
          return new THREE.Vector3(tx, snappedY + 0.55, tz)
        }
      }

      const finalY = initial.roadY ?? initial.terrainY ?? getGroundY(tx, -tz)
      return new THREE.Vector3(tx, finalY + 0.55, tz)
    }
  }, [getGroundY])

  // Precompute dense 3D samples along the active route hugging 3D roads and sidewalks
  const denseRouteSamples = useMemo(() => {
    if (!activeRoute || activeRoute.segments.length === 0) return []
    const pts: Array<{ dist: number; pt: THREE.Vector3 }> = []
    let accDist = 0
    activeRoute.segments.forEach((seg, segIdx) => {
      const segLen = Math.max(1, seg.distance_m)
      const steps = Math.max(2, Math.ceil(segLen / 3.0))
      for (let i = 0; i < steps; i++) {
        if (segIdx > 0 && i === 0) continue
        const t = i / steps
        const lat = seg.from_coord[0] + (seg.to_coord[0] - seg.from_coord[0]) * t
        const lng = seg.from_coord[1] + (seg.to_coord[1] - seg.from_coord[1]) * t
        pts.push({ dist: accDist + segLen * t, pt: snapToRoad3D(lat, lng) })
      }
      accDist += segLen
    })
    const lastSeg = activeRoute.segments[activeRoute.segments.length - 1]
    pts.push({ dist: accDist, pt: snapToRoad3D(lastSeg.to_coord[0], lastSeg.to_coord[1]) })
    return pts
  }, [activeRoute, snapToRoad3D, modelLoaded])

  const quantizedSplitDist = Math.floor(Math.max(0, progressDist) * 2) / 2

  // Rebuild remaining 3D Route Polylines only (walked portion erases cleanly as GPS moves along the route)
  useEffect(() => {
    const group = routeGroupRef.current
    if (!group) return
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((m) => m.dispose())
      }
      group.remove(child)
    }

    if (denseRouteSamples.length < 2) return

    const splitAt = quantizedSplitDist
    const remainingPts: THREE.Vector3[] = []

    if (splitAt <= 0.25) {
      denseRouteSamples.forEach((s) => remainingPts.push(s.pt))
    } else {
      let splitInserted = false
      for (let i = 0; i < denseRouteSamples.length; i++) {
        const cur = denseRouteSamples[i]
        if (cur.dist < splitAt) continue
        if (!splitInserted && i > 0) {
          const prev = denseRouteSamples[i - 1]
          const span = Math.max(0.001, cur.dist - prev.dist)
          const t = Math.max(0, Math.min(1, (splitAt - prev.dist) / span))
          remainingPts.push(prev.pt.clone().lerp(cur.pt, t))
          splitInserted = true
        }
        remainingPts.push(cur.pt)
      }
    }

    const addPiecewiseDualTube = (
      points: THREE.Vector3[],
      mainColor: string,
      casingColor: string,
      mainRadius: number,
      casingRadius: number,
      emissiveIntensity: number,
    ) => {
      // Filter consecutive duplicate points so LineCurve3 never produces zero-length tangents
      const clean: THREE.Vector3[] = []
      for (const p of points) {
        if (clean.length === 0 || clean[clean.length - 1].distanceToSquared(p) > 0.04) {
          clean.push(p)
        }
      }
      if (clean.length < 2) return

      const pathMain = new THREE.CurvePath<THREE.Vector3>()
      const pathCasing = new THREE.CurvePath<THREE.Vector3>()
      for (let i = 0; i < clean.length - 1; i++) {
        const a = clean[i]
        const b = clean[i + 1]
        pathMain.add(new THREE.LineCurve3(a, b))
        pathCasing.add(
          new THREE.LineCurve3(
            new THREE.Vector3(a.x, a.y - 0.16, a.z),
            new THREE.Vector3(b.x, b.y - 0.16, b.z),
          ),
        )
      }

      const tubularSegments = Math.min(480, Math.max(clean.length * 2, 16))
      const casingGeom = new THREE.TubeGeometry(pathCasing, tubularSegments, casingRadius, 8, false)
      const casingMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(casingColor) })
      group.add(new THREE.Mesh(casingGeom, casingMat))

      const mainGeom = new THREE.TubeGeometry(pathMain, tubularSegments, mainRadius, 8, false)
      const mainMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(mainColor),
        emissive: new THREE.Color(mainColor),
        emissiveIntensity,
        roughness: 0.28,
      })
      group.add(new THREE.Mesh(mainGeom, mainMat))
    }

    if (remainingPts.length >= 2) {
      addPiecewiseDualTube(
        remainingPts,
        ROUTE_NAV_CONFIG.MAIN_LINE_COLOR,
        ROUTE_NAV_CONFIG.CASING_COLOR,
        ROUTE_NAV_CONFIG.TUBE_MAIN_RADIUS_3D,
        ROUTE_NAV_CONFIG.TUBE_CASING_RADIUS_3D,
        0.38,
      )
    }
  }, [denseRouteSamples, quantizedSplitDist])

  // Focus camera on selected building
  useEffect(() => {
    if (!selected || isFollowing || compassViewActive) return
    const controls = controlsRef.current
    const camera = cameraRef.current
    if (!controls || !camera) return

    const num = selected.campusNumber ?? selected.id
    const targetPos = bldgTopCentersRef.current.get(num) ?? toThreeVec3(selected.lat, selected.lng, 12)
    const offset = camera.position.clone().sub(controls.target)
    const desiredDist = Math.min(offset.length(), 240)
    offset.normalize().multiplyScalar(Math.max(120, desiredDist))

    controls.target.copy(targetPos)
    camera.position.copy(targetPos).add(offset)
    controls.update()
  }, [selected, isFollowing, compassViewActive, toThreeVec3])

  // Snap heading follow distance when enabling compass view or route guidance
  useEffect(() => {
    if (!compassViewActive && !(isFollowing && cameraLock)) return
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return
    if (isFollowing && cameraLock) {
      followDistRef.current = ROUTE_NAV_CONFIG.CAMERA_FOLLOW_DISTANCE
    } else {
      const curDist = camera.position.distanceTo(controls.target)
      followDistRef.current = curDist > 260 ? 175 : Math.max(90, Math.min(240, curDist))
    }
  }, [compassViewActive, isFollowing, cameraLock])

  // Focus 3D camera onto user position immediately on GPS fix, Locate tap, or 시점 복귀
  useEffect(() => {
    if (focusUserSignal <= 0) return
    const controls = controlsRef.current
    const camera = cameraRef.current
    if (!controls || !camera) return

    const st = stateRef.current
    const [lat, lng] = st.liveUserPosRef?.current ?? st.userPosition
    const headingDeg = st.liveHeadingRef?.current ?? st.userHeadingDeg
    const uPos = toUserThreeVec3(lat, lng)
    smoothUserPos3DRef.current = uPos.clone()
    smoothHeadingRef.current = headingDeg

    if (st.isFollowing && st.cameraLock) {
      const hRad = (headingDeg * Math.PI) / 180
      const tiltRad = (ROUTE_NAV_CONFIG.CAMERA_TILT_DEG * Math.PI) / 180
      const dist = ROUTE_NAV_CONFIG.CAMERA_FOLLOW_DISTANCE
      followDistRef.current = dist
      const lookAhead = ROUTE_NAV_CONFIG.CAMERA_LOOKAHEAD_OFFSET
      controls.target.set(uPos.x + Math.sin(hRad) * lookAhead, uPos.y + 2.5, uPos.z - Math.cos(hRad) * lookAhead)
      camera.position.set(
        uPos.x - Math.sin(hRad) * Math.sin(tiltRad) * dist,
        uPos.y + 2.5 + Math.cos(tiltRad) * dist,
        uPos.z + Math.cos(hRad) * Math.sin(tiltRad) * dist,
      )
      controls.update()
      return
    }

    if (st.compassViewActive) {
      const hRad = (headingDeg * Math.PI) / 180
      const pitchRad = 0.66
      const dist = Math.min(Math.max(followDistRef.current, 130), 210)
      followDistRef.current = dist
      controls.target.set(uPos.x, uPos.y + 2.5, uPos.z)
      camera.position.set(
        uPos.x - Math.sin(hRad) * Math.cos(pitchRad) * dist,
        uPos.y + 2.5 + Math.sin(pitchRad) * dist,
        uPos.z + Math.cos(hRad) * Math.cos(pitchRad) * dist,
      )
      controls.update()
      return
    }

    const offset = camera.position.clone().sub(controls.target)
    const desiredDist = Math.min(Math.max(offset.length(), 145), 210)
    offset.normalize().multiplyScalar(desiredDist)
    controls.target.copy(uPos)
    camera.position.copy(uPos).add(offset)
    controls.update()
  }, [focusUserSignal, toUserThreeVec3])

  // Raycasting for 3D Building Click / Hover & Badge Click
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const raycasterRef = useRef(new THREE.Raycaster())

  const findHitBuildingAt = (clientX: number, clientY: number): { building?: Building; pickedGps?: [number, number] } => {
    const container = webglContainerRef.current
    const camera = cameraRef.current
    if (!container || !camera) return {}

    const rect = container.getBoundingClientRect()
    const cx = clientX - rect.left
    const cy = clientY - rect.top

    // 1. Check 2D Number Badge hitbox first
    const badgeHit = hitBoxesRef.current.find((hb) => Math.hypot(hb.cx - cx, hb.cy - cy) <= hb.r)
    if (badgeHit) {
      return { building: badgeHit.building }
    }

    // 2. Raycast into Blender 3D Meshes
    const ndc = new THREE.Vector2((cx / rect.width) * 2 - 1, -(cy / rect.height) * 2 + 1)
    raycasterRef.current.setFromCamera(ndc, camera)

    if (pickingLocation && terrainMeshRef.current) {
      const terrHits = raycasterRef.current.intersectObject(terrainMeshRef.current, false)
      if (terrHits.length > 0) {
        const pt = terrHits[0].point
        return { pickedGps: fromThreeXZToGps(pt.x, pt.z) }
      }
    }

    const hits = raycasterRef.current.intersectObjects(buildingMeshesRef.current, false)
    if (hits.length > 0) {
      const bNum = hits[0].object.userData.campusNumber
      const b = buildings.find((item) => (item.campusNumber ?? item.id) === bNum)
      if (b) return { building: b }
    }

    return {}
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY }

    // Check Compass click (top-left)
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    if (Math.hypot(px - 36, py - 36) <= 24) {
      if (onToggleCompassView) {
        onToggleCompassView()
      } else {
        applyCameraPreset('iso')
      }
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 0) return
    const res = findHitBuildingAt(e.clientX, e.clientY)
    setHoveredId(res.building ? res.building.id : null)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const dist = Math.hypot(e.clientX - pointerDownPosRef.current.x, e.clientY - pointerDownPosRef.current.y)
    if (dist > 6) return // Drag/orbit gesture, not a tap

    const res = findHitBuildingAt(e.clientX, e.clientY)
    if (pickingLocation) {
      if (res.pickedGps) {
        onPickLocation(res.pickedGps[0], res.pickedGps[1])
      } else if (res.building) {
        onPickLocation(res.building.lat, res.building.lng)
      }
      return
    }
    if (res.building) {
      onSelectBuilding(res.building)
    }
  }

  const applyCameraPreset = (preset: 'ortho' | 'iso' | 'flat') => {
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return
    onDisableCompassView?.()
    setActivePreset(preset)
    controls.target.set(10, 38, 25)
    if (preset === 'ortho') {
      camera.position.set(10, 460, 260)
    } else if (preset === 'iso') {
      camera.position.set(25, 340, 490)
    } else {
      camera.position.set(10, 620, 40)
    }
    controls.update()
  }

  const rotateAzimuthBy = (degDelta: number) => {
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return
    onDisableCompassView?.()
    const rad = (degDelta * Math.PI) / 180
    const offset = camera.position.clone().sub(controls.target)
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rad)
    camera.position.copy(controls.target).add(offset)
    controls.update()
  }

  const zoomByFactor = (factor: number) => {
    if (stateRef.current.isFollowing && stateRef.current.cameraLock) {
      stateRef.current.onUserCameraInterrupt?.()
    }
    followDistRef.current = Math.max(ROUTE_NAV_CONFIG.CAMERA_MIN_DISTANCE, Math.min(520, followDistRef.current * factor))
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return
    const offset = camera.position.clone().sub(controls.target)
    const nextLen = Math.max(55, Math.min(1300, offset.length() * factor))
    offset.normalize().multiplyScalar(nextLen)
    camera.position.copy(controls.target).add(offset)
    controls.update()
  }

  return (
    <div
      ref={stageRef}
      className={pickingLocation ? 'iso3d-stage picking' : 'iso3d-stage'}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Hardware WebGL 3D Canvas rendering Blender's campus_scene.glb */}
      <div
        ref={webglContainerRef}
        className="iso3d-procedural-canvas"
        style={{ width: '100%', height: '100%', position: 'relative' }}
      />

      {/* Synchronized High-DPI 2D HUD Overlay Canvas for Badges, Labels & Route Chips */}
      <canvas
        ref={hudCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* 3D Camera Angle & Rotation Quick Toolbar */}
      <div className="iso3d-angle-bar touch-friendly-bar">
        <span className="angle-title">
          <Compass size={13} />
          {tx.angleTitle}
        </span>
        <button
          type="button"
          className={activePreset === 'ortho' ? 'active-preset' : ''}
          onClick={() => applyCameraPreset('ortho')}
          title={tx.presetOrtho}
        >
          {tx.presetOrtho}
        </button>
        <button
          type="button"
          className={activePreset === 'iso' ? 'active-preset' : ''}
          onClick={() => applyCameraPreset('iso')}
          title={tx.presetIso}
        >
          {tx.presetIso}
        </button>
        <button
          type="button"
          className={activePreset === 'flat' ? 'active-preset' : ''}
          onClick={() => applyCameraPreset('flat')}
          title={tx.presetFlat}
        >
          {tx.presetFlat}
        </button>
        <button type="button" onClick={() => rotateAzimuthBy(-45)} title="↺ 45°">
          ↺ 45°
        </button>
        <button type="button" onClick={() => rotateAzimuthBy(45)} title="↻ 45°">
          ↻ 45°
        </button>
        <button type="button" onClick={() => applyCameraPreset('iso')} title={tx.resetTitle}>
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Floating 3D View Controls */}
      <div className="iso3d-controls-dock touch-friendly-dock">
        <button
          type="button"
          className="iso3d-ctrl-btn mode-switch touch-btn"
          onClick={onSwitchTo2D}
          title={tx.switchTo2DTitle}
        >
          <span>2D</span>
        </button>
        <button
          type="button"
          className={showLabels ? 'iso3d-ctrl-btn active touch-btn' : 'iso3d-ctrl-btn touch-btn'}
          onClick={() => setShowLabels(!showLabels)}
          title={tx.toggleLabelsTitle}
        >
          <Eye size={19} />
        </button>
        <button
          type="button"
          className="iso3d-ctrl-btn touch-btn"
          onClick={() => zoomByFactor(0.8)}
          title={tx.zoomInTitle}
        >
          <Plus size={20} />
        </button>
        <button
          type="button"
          className="iso3d-ctrl-btn touch-btn"
          onClick={() => zoomByFactor(1.25)}
          title={tx.zoomOutTitle}
        >
          <Minus size={20} />
        </button>
        <button
          type="button"
          className="iso3d-ctrl-btn touch-btn"
          onClick={() => applyCameraPreset('iso')}
          title={tx.fullCampusTitle}
        >
          <Maximize2 size={18} />
        </button>
        {onToggleCompassView && (
          <button
            type="button"
            className={compassViewActive ? 'iso3d-ctrl-btn touch-btn compass-live' : 'iso3d-ctrl-btn touch-btn'}
            onClick={onToggleCompassView}
            title={compassViewActive ? tx.compassViewOnTitle : tx.compassViewOffTitle}
            aria-pressed={compassViewActive}
          >
            <Compass size={19} />
          </button>
        )}
        <button
          type="button"
          className={gpsActive ? 'iso3d-ctrl-btn touch-btn gps-live' : 'iso3d-ctrl-btn touch-btn'}
          onClick={onTryGpsLocation}
          title={tx.gpsMyLocBtn}
        >
          <LocateFixed size={19} />
        </button>
      </div>

      {(!modelLoaded || modelLoadError) && (
        <div className={modelLoadError ? 'iso3d-status-badge error' : 'iso3d-status-badge'} role="status">
          {modelLoadError ? '3D 모델 로드 실패 — 새로고침 해주세요' : '3D 캠퍼스 모델 불러오는 중…'}
        </div>
      )}

      {isFollowing && !cameraLock && onRecenterFollowCamera && (
        <button type="button" className="recenter-follow-btn" onClick={onRecenterFollowCamera}>
          <RotateCcw size={15} />
          <span>시점 복귀</span>
        </button>
      )}

      {!isFollowing && !compassViewActive && compassActive && onToggleCompassView && (
        <button type="button" className="recenter-follow-btn compass-recenter" onClick={onToggleCompassView}>
          <Compass size={15} />
          <span>
            스마트폰 방향 시점 ({formatCardinalDirection(userHeadingDeg, language)} {Math.round(userHeadingDeg)}°)
          </span>
        </button>
      )}

      {!isFollowing && (
        <div className="iso3d-guide-badge touch-guide">
          <Sparkles size={13} />
          <span>
            <strong>{tx.touchGuideTitle}</strong>: {tx.touchGuideBody}
          </span>
        </div>
      )}
    </div>
  )
}
