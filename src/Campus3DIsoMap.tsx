import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Compass, Eye, LocateFixed, Maximize2, Minus, Plus, RotateCcw, Sparkles } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CAMPUS_CENTER, SEEDED_PATH_NODES } from './campusData'
import { classifySlope, type ActiveRouteData } from './FirstPerson3DNavigator'
import type { Building, Language } from './data'
import { EXT_UI_COPY, getLocalizedBuildingName } from './i18nCatalog'

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
  activeRoute,
  passedPositions,
  isFollowing,
  cameraLock,
  pickingLocation,
  onSelectBuilding,
  onPickLocation,
  onTryGpsLocation,
  onSwitchTo2D,
  language = 'ko',
}: {
  buildings: Building[]
  selected: Building | null
  userPosition: [number, number]
  userLocationLabel: string
  activeRoute: ActiveRouteData | null
  passedPositions: [number, number][]
  isFollowing: boolean
  cameraLock: boolean
  pickingLocation: boolean
  onSelectBuilding: (building: Building) => void
  onPickLocation: (lat: number, lng: number) => void
  onTryGpsLocation: () => void
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
  const [meshStats, setMeshStats] = useState({ faces: 0, verts: 0 })

  // Three.js core refs
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const routeGroupRef = useRef<THREE.Group | null>(null)
  const buildingMeshesRef = useRef<THREE.Mesh[]>([])
  const terrainMeshRef = useRef<THREE.Mesh | null>(null)
  const bldgTopCentersRef = useRef<Map<number, THREE.Vector3>>(new Map())
  const bldgMeshByNumRef = useRef<Map<number, THREE.Mesh[]>>(new Map())
  const hitBoxesRef = useRef<Array<{ building: Building; cx: number; cy: number; r: number }>>([])
  const rafIdRef = useRef<number>(0)

  // Elevation field interpolator matching the exact Blender terrain formula
  const elevationNodes = useMemo(() => {
    return SEEDED_PATH_NODES.map((n) => {
      const [bx, by] = toBlenderXY(n.location.coordinates[1], n.location.coordinates[0])
      return { bx, by, elev: (n.elevation - BASE_ELEV) * 0.65 }
    })
  }, [])

  const getGroundY = useCallback(
    (bx: number, by: number): number => {
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
      const [bx, by] = toBlenderXY(lat, lng)
      const bz = getGroundY(bx, by) + heightOffset
      return new THREE.Vector3(bx, bz, -by)
    },
    [getGroundY],
  )

  // Latest state refs for the render loop
  const stateRef = useRef({
    buildings,
    selected,
    hoveredId,
    showLabels,
    userPosition,
    userLocationLabel,
    activeRoute,
    passedPositions,
    isFollowing,
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
    activeRoute,
    passedPositions,
    isFollowing,
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

    const camera = new THREE.PerspectiveCamera(36, width / height, 2.0, 4500)
    // Match Blender's isometric overview camera position (Blender: X=25, Y=-510, Z=360 -> Three: X=25, Y=360, Z=510)
    camera.position.set(25, 340, 490)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
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
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.65)
    fillLight.position.set(-220, 200, -180)
    scene.add(fillLight)

    const routeGroup = new THREE.Group()
    scene.add(routeGroup)
    routeGroupRef.current = routeGroup

    // Load exact Blender 3D Campus Model (/campus_scene.glb)
    const loader = new GLTFLoader()
    const maxAniso = renderer.capabilities.getMaxAnisotropy()

    loader.load(
      '/campus_scene.glb?v=4',
      (gltf) => {
        const root = gltf.scene
        const bMeshes: THREE.Mesh[] = []
        const byNum = new Map<number, THREE.Mesh[]>()
        const topCenters = new Map<number, THREE.Vector3>()
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
            } else if (checkName.includes('Campus_Terrain')) {
              terrainMeshRef.current = mesh
            }
          }
        })

        // Compute world bounding box top center for each building (1..31)
        byNum.forEach((meshes, bNum) => {
          const box = new THREE.Box3()
          meshes.forEach((m) => box.expandByObject(m))
          const center = new THREE.Vector3()
          box.getCenter(center)
          center.y = box.max.y
          topCenters.set(bNum, center)
        })

        buildingMeshesRef.current = bMeshes
        bldgMeshByNumRef.current = byNum
        bldgTopCentersRef.current = topCenters
        setMeshStats({ faces: Math.round(totalFaces), verts: totalVerts })
        setModelLoaded(true)
        scene.add(root)
      },
      undefined,
      (err) => {
        console.error('Failed to load /campus_scene.glb:', err)
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

    const animate = () => {
      rafIdRef.current = requestAnimationFrame(animate)
      controls.update()
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

      const st = stateRef.current
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

      // 3. Live User Location 3D Beacon
      const uPos3D = toThreeVec3(st.userPosition[0], st.userPosition[1], 3.0)
      const uSp = projectToScreen(uPos3D)
      if (uSp.z > -1 && uSp.z < 1) {
        ctx.beginPath()
        ctx.arc(uSp.sx, uSp.sy, 18, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(37, 99, 235, 0.35)'
        ctx.fill()
        ctx.strokeStyle = '#60a5fa'
        ctx.lineWidth = 1.8
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(uSp.sx, uSp.sy, 8.5, 0, Math.PI * 2)
        ctx.fillStyle = '#2563eb'
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2.5
        ctx.stroke()

        const uTxt = `${st.tx.myLocPillPrefix} · ${st.userLocationLabel}`
        ctx.font = '800 10px "Noto Sans KR", sans-serif'
        const uw = ctx.measureText(uTxt).width + 15
        ctx.fillStyle = '#1d4ed8'
        ctx.beginPath()
        ctx.roundRect(uSp.sx - uw / 2, uSp.sy - 30, uw, 19, 9)
        ctx.fill()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(uTxt, uSp.sx, uSp.sy - 17)
      }

      // 4. Top-Left 3D Compass Rose (Top-Right is reserved cleanly for the 2D / 3D Switcher Box)
      const compX = 36
      const compY = 36
      const compR = 20
      ctx.beginPath()
      ctx.arc(compX, compY, compR, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.lineWidth = 1.2
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
      ro.disconnect()
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

  // Rebuild 3D Route Tube Meshes on the terrain whenever activeRoute changes
  useEffect(() => {
    const group = routeGroupRef.current
    if (!group) return
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh
      if (child.geometry) child.geometry.dispose()
      group.remove(child)
    }

    if (!activeRoute || activeRoute.segments.length === 0) return

    activeRoute.segments.forEach((seg) => {
      const p1 = toThreeVec3(seg.from_coord[0], seg.from_coord[1], 1.6)
      const p2 = toThreeVec3(seg.to_coord[0], seg.to_coord[1], 1.6)
      const mid = p1.clone().lerp(p2, 0.5)
      const midLat = (seg.from_coord[0] + seg.to_coord[0]) * 0.5
      const midLng = (seg.from_coord[1] + seg.to_coord[1]) * 0.5
      mid.y = toThreeVec3(midLat, midLng, 1.75).y

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2])
      const info = classifySlope(seg.slope_pct, seg.is_step_free, language)

      const tubeGeom = new THREE.TubeGeometry(curve, 12, 1.45, 8, false)
      const tubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(info.roadColor),
        emissive: new THREE.Color(info.roadColor),
        emissiveIntensity: 0.35,
        roughness: 0.3,
      })
      const mesh = new THREE.Mesh(tubeGeom, tubeMat)
      group.add(mesh)
    })
  }, [activeRoute, language, toThreeVec3])

  // Focus camera on selected building
  useEffect(() => {
    if (!selected || isFollowing) return
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
  }, [selected, isFollowing, toThreeVec3])

  // Follow user during active route guidance
  useEffect(() => {
    if (!isFollowing || !cameraLock) return
    const controls = controlsRef.current
    const camera = cameraRef.current
    if (!controls || !camera) return

    const uPos = toThreeVec3(userPosition[0], userPosition[1], 4)
    const offset = camera.position.clone().sub(controls.target)
    offset.normalize().multiplyScalar(170)
    controls.target.copy(uPos)
    camera.position.copy(uPos).add(offset)
    controls.update()
  }, [isFollowing, cameraLock, userPosition, toThreeVec3])

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
    if (Math.hypot(px - 36, py - 36) <= 22) {
      applyCameraPreset('iso')
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
    const rad = (degDelta * Math.PI) / 180
    const offset = camera.position.clone().sub(controls.target)
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rad)
    camera.position.copy(controls.target).add(offset)
    controls.update()
  }

  const zoomByFactor = (factor: number) => {
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
        <button
          type="button"
          className="iso3d-ctrl-btn touch-btn"
          onClick={onTryGpsLocation}
          title={tx.gpsMyLocBtn}
        >
          <LocateFixed size={19} />
        </button>
      </div>

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
