import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { Capacitor } from '@capacitor/core'
import { Geolocation } from '@capacitor/geolocation'
import L from 'leaflet'
import { MapContainer, Marker, Polygon, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { ArrowDownUp, ArrowRight, Building2, Check, ChevronDown, Compass, Crosshair, DoorOpen, Download, Info, Languages, Layers, LocateFixed, LockKeyhole, MapPin, Maximize2, Minus, Mountain, Navigation, Plus, Search, TrendingUp, X } from 'lucide-react'
import { getBuildingAppearanceSvgDataUri } from './buildingAppearance'
import { CAMPUS_BOUNDARY, CAMPUS_BOUNDS, CAMPUS_CENTER, CAMPUS_MASK_POLYGON, SEEDED_PATH_EDGES, SEEDED_PATH_NODES } from './campusData'
import Campus3DIsoMap from './Campus3DIsoMap'
import { buildings, copy, languageLabels, officialCampusMapUrl, type Building, type FloorRoomItem, type Language, type RouteSegment, type RouteWaypoint, type UiCopy } from './data'
import { apiUrl, hasApiBackend } from './api'
import Naver2DRouteFollower, { buildRouteSamples, classifySlope, interpolateSampleAtDistance, type ActiveRouteData } from './FirstPerson3DNavigator'
import {
  EXT_UI_COPY,
  getLocalizedBuildingDept,
  getLocalizedBuildingName,
  getLocalizedCategory,
  getLocalizedFloorLabel,
  getLocalizedRoomTitleAndNote,
} from './i18nCatalog'
import {
  extractCompassHeading,
  formatCardinalDirection,
  loadCachedGpsFix,
  normalizeHeadingDeg,
  requestCompassPermissionIfNeeded,
  saveCachedGpsFix,
  shortestAngleDeltaDeg,
  stepAngleDeg,
} from './liveSensors'
import { buildRouteFromWaypoints, MOCK_WAYPOINT_COURSES, ROUTE_NAV_CONFIG } from './routeNavigationConfig'

// Minimal 2D Map Building Marker: keep campus numbers readable without rectangular photo or name cards.
function createBuilding2DVisualIcon(building: Building, isSelected: boolean, language: Language) {
  const num = building.campusNumber ?? building.id
  const localName = getLocalizedBuildingName(building, language)
  return L.divIcon({
    className: isSelected ? 'dsu2d-number-pin-wrap selected' : 'dsu2d-number-pin-wrap',
    html: `<span class="dsu2d-number-pin" aria-label="${localName} ${num}">${num}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

function createUserLocationIcon(headingDeg: number, nearestLabel: string, isFollowing: boolean, language: Language) {
  const tx = EXT_UI_COPY[language]
  return L.divIcon({
    className: 'user-marker-wrap',
    html: `<div class="user-beacon-container">
      <div class="user-heading-cone ${isFollowing ? 'following' : ''}" style="transform: translate(-50%, -50%) rotate(${headingDeg}deg)"></div>
      <span class="user-marker-pulse"></span>
      <span class="user-nav-arrow" style="transform: rotate(${headingDeg}deg)">▲</span>
      <span class="user-location-pill">${tx.myLocPillPrefix} · ${nearestLabel}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function createSlopeMarkerIcon(shortLabel: string, bgColor: string) {
  return L.divIcon({
    className: 'slope-map-chip-wrap',
    html: `<div class="slope-map-chip" style="background:${bgColor}">${shortLabel}</div>`,
    iconSize: [84, 22],
    iconAnchor: [42, 11],
  })
}

function createEndpointBadgeIcon(label: string, color: string) {
  return L.divIcon({
    className: 'route-endpoint-wrap',
    html: `<div class="route-endpoint-badge" style="background:${color}">${label}</div>`,
    iconSize: [48, 24],
    iconAnchor: [24, 28],
  })
}

type FacilityMatch = {
  code?: string
  name: string
  name_en?: string
  name_zh?: string
  name_vi?: string
  name_lt?: string
  name_hi?: string
  category?: string
  floor?: number
  floorLabel?: string
  note?: string
}

type SearchRoomHit = {
  building: Building
  floor: number
  floorLabel: string
  room: FloorRoomItem
}

type GoogleRouteElevationProfile = {
  samples: Array<{ distance_m: number; elevation_m: number; resolution_m: number | null }>
  total_uphill_m: number
  total_downhill_m: number
  request_budget: { used: number; limit: number }
}

const GOOGLE_ELEVATION_UI = {
  ko: { title: '경로 고도 프로필', load: 'Google Maps 고도 조회', loading: '경로 고도를 조회하고 있어요…', ascent: '누적 오르막', descent: '누적 내리막', range: '고도 범위', attribution: '고도 데이터 제공: Google Maps', disclosure: '경로 좌표가 Google Maps에 전송됩니다. 조회 결과는 저장하지 않습니다.', done: '현재 경로 조회 완료', failed: 'Google Maps 경로 고도를 불러오지 못했습니다.' },
  en: { title: 'Route elevation profile', load: 'Load Google Maps elevation', loading: 'Loading route elevation…', ascent: 'Total ascent', descent: 'Total descent', range: 'Elevation range', attribution: 'Elevation data by Google Maps', disclosure: 'Route coordinates are sent to Google Maps. Results are not saved.', done: 'Loaded for this route', failed: 'Could not load Google Maps route elevation.' },
  zh: { title: '路线海拔曲线', load: '查询 Google Maps 海拔', loading: '正在查询路线海拔…', ascent: '累计上坡', descent: '累计下坡', range: '海拔范围', attribution: '海拔数据：Google Maps', disclosure: '路线坐标会发送至 Google Maps。查询结果不会保存。', done: '此路线已查询', failed: '无法加载 Google Maps 路线海拔。' },
  vi: { title: 'Biểu đồ độ cao tuyến đường', load: 'Tải độ cao Google Maps', loading: 'Đang tải độ cao tuyến đường…', ascent: 'Tổng leo dốc', descent: 'Tổng xuống dốc', range: 'Khoảng độ cao', attribution: 'Dữ liệu độ cao: Google Maps', disclosure: 'Tọa độ tuyến đường sẽ được gửi đến Google Maps. Kết quả không được lưu.', done: 'Đã tải cho tuyến này', failed: 'Không thể tải độ cao tuyến đường Google Maps.' },
  lt: { title: 'Maršruto aukščio profilis', load: 'Gauti Google Maps aukštį', loading: 'Gaunami maršruto aukščio duomenys…', ascent: 'Bendras pakilimas', descent: 'Bendras nusileidimas', range: 'Aukščio diapazonas', attribution: 'Aukščio duomenys: Google Maps', disclosure: 'Maršruto koordinatės siunčiamos į Google Maps. Rezultatai neišsaugomi.', done: 'Šis maršrutas įkeltas', failed: 'Nepavyko gauti Google Maps maršruto aukščio.' },
  hi: { title: 'मार्ग ऊँचाई प्रोफ़ाइल', load: 'Google Maps ऊँचाई लोड करें', loading: 'मार्ग की ऊँचाई लोड हो रही है…', ascent: 'कुल चढ़ाई', descent: 'कुल उतराई', range: 'ऊँचाई सीमा', attribution: 'ऊँचाई डेटा: Google Maps', disclosure: 'मार्ग निर्देशांक Google Maps को भेजे जाते हैं। परिणाम सहेजे नहीं जाते।', done: 'इस मार्ग के लिए लोड किया गया', failed: 'Google Maps मार्ग की ऊँचाई लोड नहीं हो सकी।' },
} as const

const APK_INSTALL_URL = '/dongseo-campus-map.apk'

const APK_INSTALL_UI = {
  ko: {
    button: 'APK',
    aria: 'Android APK 설치 안내',
    title: 'APK 설치 안내',
    downloadBtn: 'APK 다운로드 (.apk)',
    hint: 'APK 다운로드 후 파일 앱에서 dongseo-campus-map.apk를 열어 설치하세요. (최초 1회 "출처를 알 수 없는 앱" 허용)',
    iosDesc: 'iPhone/iPad는 Safari 공유 버튼 → "홈 화면에 추가"로 앱처럼 사용할 수 있습니다.',
    close: '닫기',
  },
  en: {
    button: 'APK',
    aria: 'Android APK install guide',
    title: 'APK Install Guide',
    downloadBtn: 'Download APK (.apk)',
    hint: 'Download and open dongseo-campus-map.apk in Files to install (allow "Unknown apps" once if prompted).',
    iosDesc: 'On iPhone/iPad, tap Share in Safari → "Add to Home Screen".',
    close: 'Close',
  },
  zh: {
    button: 'APK',
    aria: 'Android APK 安装说明',
    title: 'APK 安装说明',
    downloadBtn: '下载 APK (.apk)',
    hint: '下载后在文件管理中打开 dongseo-campus-map.apk 安装（如提示请允许未知来源应用）。',
    iosDesc: 'iPhone/iPad 请在 Safari 点击分享 → “添加到主屏幕”。',
    close: '关闭',
  },
  vi: {
    button: 'APK',
    aria: 'Hướng dẫn cài đặt APK',
    title: 'Hướng dẫn cài APK',
    downloadBtn: 'Tải APK (.apk)',
    hint: 'Tải xong hãy mở dongseo-campus-map.apk để cài đặt (bật cho phép nguồn không xác định nếu được hỏi).',
    iosDesc: 'Trên iPhone/iPad, nhấn Chia sẻ trong Safari → "Thêm vào Màn hình chính".',
    close: 'Đóng',
  },
  lt: {
    button: 'APK',
    aria: 'Android APK diegimo instrukcija',
    title: 'APK diegimo instrukcija',
    downloadBtn: 'Atsisiųsti APK (.apk)',
    hint: 'Atsisiuntę atidarykite dongseo-campus-map.apk (jei prašoma, leiskite diegti iš nežinomų šaltinių).',
    iosDesc: 'iPhone/iPad: Safari naršyklėje spauskite Bendrinti → „Pridėti prie pradžios ekrano“.',
    close: 'Uždaryti',
  },
  hi: {
    button: 'APK',
    aria: 'Android APK इंस्टॉल गाइड',
    title: 'APK इंस्टॉल गाइड',
    downloadBtn: 'APK डाउनलोड (.apk)',
    hint: 'डाउनलोड के बाद dongseo-campus-map.apk खोलकर इंस्टॉल करें।',
    iosDesc: 'iPhone/iPad पर Safari में Share → "Add to Home Screen" चुनें।',
    close: 'बंद करें',
  },
} as const

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function bearingDegrees(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const phi1 = toRad(lat1)
  const phi2 = toRad(lat2)
  const dLng = toRad(lng2 - lng1)
  const y = Math.sin(dLng) * Math.cos(phi2)
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLng)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

function isInsideCampusBounds(lat: number, lng: number) {
  return (
    lat >= CAMPUS_BOUNDS[0][0] &&
    lat <= CAMPUS_BOUNDS[1][0] &&
    lng >= CAMPUS_BOUNDS[0][1] &&
    lng <= CAMPUS_BOUNDS[1][1]
  )
}

function computeClientRoute(
  fromId: number | 'current',
  toId: number,
  userPosition: [number, number],
  stepFree: boolean,
  allBuildings: Building[],
): ActiveRouteData | null {
  const destBuilding = allBuildings.find((b) => b.id === toId)
  if (!destBuilding) return null
  const nodes = SEEDED_PATH_NODES
  const edges = SEEDED_PATH_EDGES
  const byId = new Map(nodes.map((n) => [n.id, n]))

  let startNodeIds: string[] = []
  let startName = '내 현재 위치'
  let prependOrigin: { lat: number; lng: number; elevation: number; distToFirst: number } | null = null

  if (fromId === 'current') {
    let bestNode = nodes[0]
    let bestDist = Infinity
    for (const n of nodes) {
      const d = haversineMeters(userPosition[0], userPosition[1], n.location.coordinates[1], n.location.coordinates[0])
      if (d < bestDist) {
        bestDist = d
        bestNode = n
      }
    }
    startNodeIds = [bestNode.id]
    if (bestDist > 2) {
      prependOrigin = { lat: userPosition[0], lng: userPosition[1], elevation: bestNode.elevation, distToFirst: Math.round(bestDist) }
    }
  } else {
    const startBldg = allBuildings.find((b) => b.id === fromId)
    if (!startBldg) return null
    startName = startBldg.name
    startNodeIds = nodes.filter((n) => n.building_id === fromId).map((n) => n.id)
  }

  const goalIds = new Set(nodes.filter((n) => n.building_id === toId).map((n) => n.id))
  if (!startNodeIds.length || !goalIds.size) return null

  const adj = new Map<string, Array<{ to: string; cost: number; edge: (typeof edges)[number] }>>()
  for (const n of nodes) adj.set(n.id, [])
  for (const e of edges) {
    if (!byId.has(e.from_node) || !byId.has(e.to_node) || !e.accessible) continue
    if (stepFree && !e.is_step_free) continue
    const w = e.distance_m * (1 + (Math.abs(e.slope_pct) / 100) * (stepFree ? 1.2 : 0.35))
    adj.get(e.from_node)?.push({ to: e.to_node, cost: w, edge: e })
    if (e.bidirectional) {
      const revEdge = { ...e, from_node: e.to_node, to_node: e.from_node, slope_pct: -e.slope_pct }
      adj.get(e.to_node)?.push({ to: e.from_node, cost: w, edge: revEdge })
    }
  }

  const dist = new Map<string, number>()
  const prev = new Map<string, { parent: string; edge: (typeof edges)[number] }>()
  const visited = new Set<string>()
  for (const s of startNodeIds) dist.set(s, 0)

  let reachedGoal: string | null = null
  while (visited.size < nodes.length) {
    let u: string | null = null
    let best = Infinity
    for (const [k, v] of dist.entries()) {
      if (!visited.has(k) && v < best) {
        best = v
        u = k
      }
    }
    if (!u) break
    visited.add(u)
    if (goalIds.has(u)) {
      reachedGoal = u
      break
    }
    for (const item of adj.get(u) ?? []) {
      const nc = best + item.cost
      if (nc < (dist.get(item.to) ?? Infinity)) {
        dist.set(item.to, nc)
        prev.set(item.to, { parent: u, edge: item.edge })
      }
    }
  }

  if (!reachedGoal) return null
  const routeNodeIds = [reachedGoal]
  const routeEdges: (typeof edges)[number][] = []
  let curr = reachedGoal
  while (prev.has(curr)) {
    const p = prev.get(curr)!
    routeEdges.push(p.edge)
    routeNodeIds.push(p.parent)
    curr = p.parent
  }
  routeNodeIds.reverse()
  routeEdges.reverse()

  const waypoints: RouteWaypoint[] = []
  const segments: RouteSegment[] = []
  let totalDist = 0
  let walkMin = 0
  let maxSlope = 0
  let uphill = 0
  let downhill = 0

  if (prependOrigin) {
    const firstNode = byId.get(routeNodeIds[0])!
    waypoints.push({ node_id: 'user-origin', lat: prependOrigin.lat, lng: prependOrigin.lng, elevation: prependOrigin.elevation, label: '현재 위치' })
    segments.push({
      id: 'edge-origin',
      from_node: 'user-origin',
      to_node: firstNode.id,
      from_coord: [prependOrigin.lat, prependOrigin.lng],
      to_coord: [firstNode.location.coordinates[1], firstNode.location.coordinates[0]],
      from_elevation: prependOrigin.elevation,
      to_elevation: firstNode.elevation,
      distance_m: prependOrigin.distToFirst,
      slope_pct: 0,
      is_step_free: true,
    })
    totalDist += prependOrigin.distToFirst
    walkMin += prependOrigin.distToFirst / 72
  }

  for (const nid of routeNodeIds) {
    const n = byId.get(nid)!
    const bName = allBuildings.find((b) => b.id === n.building_id)?.name ?? null
    waypoints.push({
      node_id: nid,
      lat: n.location.coordinates[1],
      lng: n.location.coordinates[0],
      elevation: n.elevation,
      building_id: n.building_id,
      label: bName,
    })
  }

  for (const e of routeEdges) {
    const un = byId.get(e.from_node)!
    const vn = byId.get(e.to_node)!
    segments.push({
      id: e.id,
      from_node: e.from_node,
      to_node: e.to_node,
      from_coord: [un.location.coordinates[1], un.location.coordinates[0]],
      to_coord: [vn.location.coordinates[1], vn.location.coordinates[0]],
      from_elevation: un.elevation,
      to_elevation: vn.elevation,
      distance_m: e.distance_m,
      slope_pct: e.slope_pct,
      is_step_free: e.is_step_free,
    })
    totalDist += e.distance_m
    maxSlope = Math.max(maxSlope, Math.abs(e.slope_pct))
    if (e.slope_pct >= 3) uphill += e.distance_m
    if (e.slope_pct <= -3) downhill += e.distance_m
    const speed = Math.max(35, 78 / (1 + (Math.max(e.slope_pct, 0) / 100) * 1.4))
    walkMin += e.distance_m / speed
  }

  return {
    startName,
    destinationName: destBuilding.name,
    distance_m: Math.round(totalDist),
    estimated_minutes: Math.max(1, Math.round(walkMin)),
    max_slope_pct: Math.round(maxSlope * 10) / 10,
    uphill_distance_m: Math.round(uphill),
    downhill_distance_m: Math.round(downhill),
    step_free: stepFree,
    waypoints,
    segments,
  }
}

const WIDE_SVG_RENDERER = L.svg({ padding: 1.5 })

function MapFocus({
  selected,
  focusPos,
  userPosition,
  focusUserSignal,
  isFollowingRoute,
}: {
  selected: Building | null
  focusPos: [number, number] | null
  userPosition: [number, number]
  focusUserSignal: number
  isFollowingRoute: boolean
}) {
  const map = useMap()
  const userPosRef = useRef(userPosition)
  userPosRef.current = userPosition

  useEffect(() => {
    if (isFollowingRoute) return
    if (selected) map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 17), { duration: 0.35 })
    else if (focusPos) map.flyTo(focusPos, Math.max(map.getZoom(), 17), { duration: 0.35 })
  }, [map, selected, focusPos, isFollowingRoute])

  useEffect(() => {
    if (focusUserSignal <= 0) return
    map.flyTo(userPosRef.current, Math.max(map.getZoom(), 18), { duration: 0.35 })
  }, [map, focusUserSignal])

  return null
}

function MapFollowUser({
  active,
  cameraLock,
  userPosition,
  onUserInteract,
}: {
  active: boolean
  cameraLock: boolean
  userPosition: [number, number]
  onUserInteract?: () => void
}) {
  const map = useMap()
  const isInteractingRef = useRef(false)
  const initializedFollowRef = useRef(false)

  useMapEvents({
    zoomstart() {
      isInteractingRef.current = true
      if (active && cameraLock) onUserInteract?.()
    },
    zoomend() {
      isInteractingRef.current = false
    },
    dragstart() {
      isInteractingRef.current = true
      if (active && cameraLock) onUserInteract?.()
    },
    dragend() {
      isInteractingRef.current = false
    },
  })

  useEffect(() => {
    if (!active) {
      initializedFollowRef.current = false
      return
    }
    if (!initializedFollowRef.current) {
      initializedFollowRef.current = true
      map.setView(userPosition, Math.max(map.getZoom(), 18), { animate: false })
      return
    }
    if (!cameraLock || isInteractingRef.current) return
    const internalMap = map as unknown as { _animatingZoom?: boolean }
    if (internalMap._animatingZoom) return
    map.panTo(userPosition, { animate: false })
  }, [map, active, cameraLock, userPosition])

  return null
}

function FitRoute({ routeId, positions, isFollowingRoute }: { routeId: string; positions: [number, number][]; isFollowingRoute: boolean }) {
  const map = useMap()
  const lastFittedRouteRef = useRef('')
  useEffect(() => {
    if (isFollowingRoute || !routeId || lastFittedRouteRef.current === routeId) return
    if (positions.length > 1) {
      lastFittedRouteRef.current = routeId
      map.fitBounds(positions, { padding: [60, 60], maxZoom: 18, animate: true })
    }
  }, [map, routeId, positions, isFollowingRoute])
  return null
}

function MapResize() {
  const map = useMap()
  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize())
    return () => cancelAnimationFrame(frame)
  }, [map])
  return null
}

function MapZoomButtons({
  onResetCampus,
  onSwitchTo3D,
}: {
  onResetCampus: () => void
  onSwitchTo3D: () => void
}) {
  const map = useMap()
  return (
    <div className="map-zoom-controls" aria-label="지도 확대 및 축소">
      <button
        type="button"
        className="floating-3d-toggle"
        onClick={onSwitchTo3D}
        title="3D 입체 캠퍼스맵으로 변환"
        aria-label="3D 캠퍼스맵으로 변환"
      >
        3D
      </button>
      <button type="button" onClick={() => map.zoomIn()} title="지도 확대 (Zoom In)" aria-label="지도 확대">
        <Plus size={18} />
      </button>
      <button type="button" onClick={() => map.zoomOut()} title="지도 축소 (Zoom Out)" aria-label="지도 축소">
        <Minus size={18} />
      </button>
      <button
        type="button"
        onClick={() => {
          onResetCampus()
          map.setView(CAMPUS_CENTER, 17, { animate: true })
        }}
        title="동서대학교 캠퍼스 전체 보기"
        aria-label="캠퍼스 전체 보기"
      >
        <Maximize2 size={16} />
      </button>
    </div>
  )
}

function MapClickPickLocation({
  pickingMode,
  onPickLocation,
}: {
  pickingMode: boolean
  onPickLocation: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      if (pickingMode && isInsideCampusBounds(e.latlng.lat, e.latlng.lng)) {
        onPickLocation(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/[\s\-_.\[\]#번]/g, '')
}

export default function App() {
  const [language, setLanguage] = useState<Language>('ko')
  const [showInstallDialog, setShowInstallDialog] = useState(false)
  const [mobileSheetSnap, setMobileSheetSnap] = useState<'closed' | 'peek' | 'half' | 'full'>('peek')
  const sheetDragRef = useRef<{ pointerId: number; startY: number; dragged: boolean } | null>(null)
  const suppressSheetClickRef = useRef(false)
  const [campusBuildings, setCampusBuildings] = useState<Building[]>(buildings)
  const [showAdmin, setShowAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'explore' | 'route'>('explore')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Building | null>(null)
  const [matchedFacility, setMatchedFacility] = useState<FacilityMatch | null>(null)
  const cachedGpsRef = useRef(loadCachedGpsFix())
  const initialUserPos: [number, number] =
    cachedGpsRef.current && isInsideCampusBounds(cachedGpsRef.current.lat, cachedGpsRef.current.lng)
      ? [cachedGpsRef.current.lat, cachedGpsRef.current.lng]
      : [35.14548, 129.00782]
  const initialHeadingDeg = cachedGpsRef.current?.headingDeg ?? 115

  const [userPosition, setUserPosition] = useState<[number, number]>(initialUserPos)
  const [rawGpsCoord, setRawGpsCoord] = useState<[number, number] | null>(null)
  const [userElevation, setUserElevation] = useState<number>(96.0)
  const [userHeadingDeg, setUserHeadingDeg] = useState<number>(initialHeadingDeg)
  const [locationSource, setLocationSource] = useState<'campus-pin' | 'gps' | '2d-follow'>('campus-pin')
  const [gpsActive, setGpsActive] = useState(false)
  const [compassActive, setCompassActive] = useState(false)
  const [compassViewActive, setCompassViewActive] = useState(false)
  const [focusUserSignal, setFocusUserSignal] = useState(0)
  const [pickingLocation, setPickingLocation] = useState(false)
  const [focusPos, setFocusPos] = useState<[number, number] | null>(null)

  const liveUserPosRef = useRef<[number, number]>(initialUserPos)
  const liveHeadingRef = useRef<number>(initialHeadingDeg)
  const compassActiveRef = useRef(false)
  const compassInitializedRef = useRef(false)
  const lastAbsoluteCompassAtRef = useRef(0)
  const lastHeadingStateAtRef = useRef(0)
  const lastCommittedHeadingRef = useRef(initialHeadingDeg)
  const autoCompassAppliedRef = useRef(false)
  const manualCompassDisabledRef = useRef(false)

  const gpsWatchIdRef = useRef<number | string | null>(null)
  const gpsStartingRef = useRef(false)
  const lastGpsCoordRef = useRef<{ lat: number; lng: number } | null>(null)
  const lastRawGpsCoordRef = useRef<{ lat: number; lng: number } | null>(null)
  const pendingFocusOnGpsRef = useRef(false)
  const manualPinOverrideRef = useRef(false)
  const shownOutsideNoticeRef = useRef(false)

  const [fromId, setFromId] = useState<number | 'current' | ''>('current')
  const [toId, setToId] = useState<number | ''>(9)
  const [stepFree, setStepFree] = useState(false)
  const [routeMessage, setRouteMessage] = useState('')
  const [searchMessage, setSearchMessage] = useState('')
  const [selectedMockCourseId, setSelectedMockCourseId] = useState<string>(MOCK_WAYPOINT_COURSES[0].id)
  const [activeRoute, setActiveRoute] = useState<ActiveRouteData | null>(() =>
    buildRouteFromWaypoints(
      MOCK_WAYPOINT_COURSES[0].waypoints,
      MOCK_WAYPOINT_COURSES[0].startName,
      MOCK_WAYPOINT_COURSES[0].destinationName,
    ),
  )
  const [googleElevationProfile, setGoogleElevationProfile] = useState<GoogleRouteElevationProfile | null>(null)
  const [googleElevationLoading, setGoogleElevationLoading] = useState(false)
  const [googleElevationMessage, setGoogleElevationMessage] = useState('')

  const [isFollowing2D, setIsFollowing2D] = useState(false)
  const [isPlaying2D, setIsPlaying2D] = useState(false)
  const [cameraLock2D, setCameraLock2D] = useState(true)
  const [progressDist2D, setProgressDist2D] = useState(0)
  const [speedMultiplier2D, setSpeedMultiplier2D] = useState<1 | 2 | 4>(1)
  const [navHudEnabled, setNavHudEnabled] = useState(true)
  const [mapViewMode, setMapViewMode] = useState<'2d' | '3d'>('3d')

  const [pathNodeCount, setPathNodeCount] = useState(SEEDED_PATH_NODES.length)
  const [pathEdgeCount, setPathEdgeCount] = useState(SEEDED_PATH_EDGES.length)
  const t = copy[language]
  const tx = EXT_UI_COPY[language]

  const isFollowing2DRef = useRef(isFollowing2D)
  isFollowing2DRef.current = isFollowing2D
  const isPlaying2DRef = useRef(isPlaying2D)
  isPlaying2DRef.current = isPlaying2D
  const activeTabRef = useRef(activeTab)
  activeTabRef.current = activeTab
  const userPositionRef = useRef(userPosition)
  userPositionRef.current = userPosition
  const txRef = useRef(tx)
  txRef.current = tx
  const tRef = useRef(t)
  tRef.current = t

  const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
  const isNativeApp = Capacitor.isNativePlatform()

  function openInstallModal() {
    setShowInstallDialog(true)
  }

  async function loadGoogleElevationProfile() {
    if (!hasApiBackend || !activeRoute || googleElevationLoading || googleElevationProfile) return
    setGoogleElevationLoading(true)
    setGoogleElevationMessage('')
    const coordinates: [number, number][] = []
    activeRoute.segments.forEach((segment, index) => {
      if (index === 0) coordinates.push(segment.from_coord)
      coordinates.push(segment.to_coord)
    })
    try {
      const response = await fetch(apiUrl('/api/elevation/route-profile'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: coordinates.map(([lat, lng]) => ({ type: 'Point', coordinates: [lng, lat] })),
          samples: 96,
        }),
      })
      const payload = (await response.json().catch(() => ({}))) as GoogleRouteElevationProfile & { detail?: string }
      if (!response.ok) {
        setGoogleElevationMessage(payload.detail || GOOGLE_ELEVATION_UI[language].failed)
        return
      }
      if (!Array.isArray(payload.samples) || payload.samples.length < 2) {
        setGoogleElevationMessage(GOOGLE_ELEVATION_UI[language].failed)
        return
      }
      setGoogleElevationProfile(payload)
    } catch {
      setGoogleElevationMessage(GOOGLE_ELEVATION_UI[language].failed)
    } finally {
      setGoogleElevationLoading(false)
    }
  }

  const googleProfileRouteKey = activeRoute
    ? `${activeRoute.startName}|${activeRoute.destinationName}|${activeRoute.segments.map((segment) => segment.id).join(',')}`
    : ''
  useEffect(() => {
    setGoogleElevationProfile(null)
    setGoogleElevationMessage('')
  }, [googleProfileRouteKey])

  function handleSheetPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    suppressSheetClickRef.current = false
    sheetDragRef.current = { pointerId: event.pointerId, startY: event.clientY, dragged: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleSheetPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = sheetDragRef.current
    if (drag?.pointerId === event.pointerId && Math.abs(event.clientY - drag.startY) > 8) {
      drag.dragged = true
    }
  }

  function handleSheetPointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = sheetDragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const deltaY = event.clientY - drag.startY
    suppressSheetClickRef.current = drag.dragged
    if (drag.dragged) {
      if (deltaY < -110) setMobileSheetSnap('full')
      else if (deltaY < 0) setMobileSheetSnap('half')
      else if (deltaY > 60) setMobileSheetSnap('closed')
      else setMobileSheetSnap('half')
    }
    sheetDragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function toggleMobileSheet() {
    if (suppressSheetClickRef.current) {
      suppressSheetClickRef.current = false
      return
    }
    setMobileSheetSnap((snap) => (snap === 'closed' || snap === 'peek' ? 'full' : 'peek'))
  }

  // Keep active route endpoint names and summary message synchronized when language switches
  useEffect(() => {
    setActiveRoute((prev) => {
      if (!prev) return null
      const startBldg = fromId !== 'current' && fromId !== '' ? campusBuildings.find((b) => b.id === fromId) : null
      const destBldg = toId !== '' ? campusBuildings.find((b) => b.id === toId) : null
      const nextStart =
        fromId === 'current'
          ? t.current
          : startBldg
            ? getLocalizedBuildingName(startBldg, language)
            : prev.startName
      const nextDest = destBldg ? getLocalizedBuildingName(destBldg, language) : prev.destinationName
      setRouteMessage(tx.routeSummaryMsg(prev.distance_m, prev.estimated_minutes, prev.uphill_distance_m, prev.max_slope_pct))
      return { ...prev, startName: nextStart, destinationName: nextDest }
    })
  }, [language, campusBuildings, fromId, toId, t, tx])

  const { samples: routeSamples, totalDistance: routeTotalDist } = useMemo(() => {
    if (!activeRoute) return { samples: [], totalDistance: 1 }
    return buildRouteSamples(activeRoute, campusBuildings, language)
  }, [activeRoute, campusBuildings, language])

  const routeSamplesRef = useRef(routeSamples)
  routeSamplesRef.current = routeSamples

  const currentFollowSample = useMemo(() => {
    if (!routeSamples.length) return null
    return interpolateSampleAtDistance(routeSamples, routeTotalDist, progressDist2D)
  }, [routeSamples, routeTotalDist, progressDist2D])

  useEffect(() => {
    if (!isFollowing2D || !currentFollowSample) return
    liveUserPosRef.current = [currentFollowSample.lat, currentFollowSample.lng]
    liveHeadingRef.current = currentFollowSample.headingDeg
    setUserPosition([currentFollowSample.lat, currentFollowSample.lng])
    setUserElevation(currentFollowSample.elevation)
    setUserHeadingDeg(currentFollowSample.headingDeg)
    setLocationSource('2d-follow')
  }, [isFollowing2D, currentFollowSample])

  useEffect(() => {
    if (!isFollowing2D || !isPlaying2D) return
    let lastTime = performance.now()
    let frameId = 0
    const tick = (now: number) => {
      const dt = Math.min(0.08, (now - lastTime) / 1000)
      lastTime = now
      const speedMetersPerSec = ROUTE_NAV_CONFIG.BASE_MOVE_SPEED_MPS * speedMultiplier2D
      setProgressDist2D((prev) => {
        const next = prev + speedMetersPerSec * dt
        if (next >= routeTotalDist) {
          setIsPlaying2D(false)
          return routeTotalDist
        }
        return next
      })
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [isFollowing2D, isPlaying2D, speedMultiplier2D, routeTotalDist])

  const userLocationSummary = useMemo(() => {
    let nearestBldg = campusBuildings[0]
    let minD = Infinity
    for (const b of campusBuildings) {
      const d = haversineMeters(userPosition[0], userPosition[1], b.lat, b.lng)
      if (d < minD) {
        minD = d
        nearestBldg = b
      }
    }
    const distMeters = Math.round(minD)
    const inside = isInsideCampusBounds(userPosition[0], userPosition[1])
    const localNearestName = nearestBldg ? getLocalizedBuildingName(nearestBldg, language) : ''
    return {
      nearestBuilding: nearestBldg,
      nearestDisplayName: localNearestName,
      distanceMeters: distMeters,
      insideCampus: inside,
      shortText: nearestBldg ? tx.nearShort(localNearestName, distMeters) : tx.campusWalkway,
    }
  }, [userPosition, campusBuildings, language, tx])

  useEffect(() => {
    if (!hasApiBackend) return
    const loadBuildings = () =>
      fetch(apiUrl('/api/buildings'))
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then(
          (
            data: Array<{
              id: number
              name: string
              location?: { coordinates?: [number, number] }
              name_en?: string
              elevation?: number
              video_url?: string
              floor_details?: Array<{
                floor: number
                label: string
                floor_plan_url?: string
                floor_summary?: string
                facilities?: FloorRoomItem[]
              }>
            }>,
          ) => {
            const byIdSeed = new Map(buildings.map((b) => [b.id, b]))
            const saved = data.flatMap((item) => {
              const coordinates = item.location?.coordinates
              if (!coordinates || coordinates.length !== 2 || !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) return []
              const seeded = byIdSeed.get(item.id)
              const normalizedFloorDetails = (item.floor_details ?? []).map((fl) => ({
                floor: fl.floor,
                label: fl.label,
                floorPlanUrl: fl.floor_plan_url,
                floorSummary: fl.floor_summary,
                facilities: fl.facilities ?? [],
              }))
              return [
                {
                  id: item.id,
                  campusNumber: seeded?.campusNumber,
                  codePrefix: seeded?.codePrefix,
                  codeRange: seeded?.codeRange,
                  departmentSummary: seeded?.departmentSummary,
                  name: item.name,
                  englishName: item.name_en ?? seeded?.englishName,
                  elevation: item.elevation ?? seeded?.elevation,
                  levels: seeded?.levels,
                  footprint: seeded?.footprint,
                  secondaryFootprint: seeded?.secondaryFootprint,
                  roofColor: seeded?.roofColor,
                  wallColor: seeded?.wallColor,
                  wallSideColor: seeded?.wallSideColor,
                  accentColor: seeded?.accentColor,
                  shapeType: seeded?.shapeType,
                  aliases: seeded?.aliases,
                  photoUrl: seeded?.photoUrl,
                  photoSourceUrl: seeded?.photoSourceUrl,
                  videoUrl: item.video_url,
                  floorDetails: seeded?.floorDetails?.length ? seeded.floorDetails : normalizedFloorDetails,
                  lng: coordinates[0],
                  lat: coordinates[1],
                },
              ]
            })
            if (saved.length) {
              saved.sort((a, b) => (a.campusNumber ?? a.id) - (b.campusNumber ?? b.id))
              setCampusBuildings(saved)
            }
          },
        )
        .catch(() => undefined)
    const loadHealth = () =>
      fetch(apiUrl('/api/health'))
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((health: { path_node_count?: number; path_edge_count?: number }) => {
          if (health.path_node_count) setPathNodeCount(health.path_node_count)
          if (health.path_edge_count) setPathEdgeCount(health.path_edge_count)
        })
        .catch(() => undefined)
    const refresh = () => {
      void loadBuildings()
      void loadHealth()
    }
    void loadBuildings()
    void loadHealth()
    window.addEventListener('dsu:building-data-updated', refresh)
    return () => window.removeEventListener('dsu:building-data-updated', refresh)
  }, [])

  const { buildingResults, roomResults } = useMemo(() => {
    const term = normalize(query.trim())
    if (!term) return { buildingResults: [], roomResults: [] }
    const bHits = campusBuildings.filter(
      (building) =>
        String(building.campusNumber ?? '') === term ||
        normalize(building.name).includes(term) ||
        normalize(building.englishName ?? '').includes(term) ||
        normalize(getLocalizedBuildingName(building, language)).includes(term) ||
        normalize(building.codePrefix ?? '').includes(term) ||
        normalize(building.departmentSummary ?? '').includes(term) ||
        normalize(getLocalizedBuildingDept(building, language)).includes(term),
    )
    const rHits: SearchRoomHit[] = []
    for (const b of campusBuildings) {
      for (const fl of b.floorDetails ?? []) {
        for (const [idx, rm] of fl.facilities.entries()) {
          const locRm = getLocalizedRoomTitleAndNote(rm, language, b, fl.floor, idx)
          if (
            normalize(rm.name).includes(term) ||
            normalize(locRm.titleStr).includes(term) ||
            normalize(rm.code ?? '').includes(term) ||
            normalize(rm.category ?? '').includes(term) ||
            normalize(locRm.categoryStr).includes(term) ||
            normalize(rm.note ?? '').includes(term) ||
            normalize(locRm.noteStr).includes(term)
          ) {
            rHits.push({ building: b, floor: fl.floor, floorLabel: fl.label, room: rm })
            if (rHits.length >= 8) break
          }
        }
        if (rHits.length >= 8) break
      }
      if (rHits.length >= 8) break
    }
    return { buildingResults: bHits, roomResults: rHits }
  }, [query, campusBuildings, language])

  function chooseBuilding(building: Building, facility: FacilityMatch | null = null) {
    setIsFollowing2D(false)
    setIsPlaying2D(false)
    manualCompassDisabledRef.current = true
    setCompassViewActive(false)
    setMobileSheetSnap('peek')
    setSelected(building)
    setMatchedFacility(facility)
    setSearchMessage('')
    setRouteMessage('')
    setQuery('')
  }

  function setCampusUserLocation(lat: number, lng: number, source: 'campus-pin' | 'gps' = 'campus-pin') {
    let nearestElev = 98
    let minD = Infinity
    for (const n of SEEDED_PATH_NODES) {
      const d = haversineMeters(lat, lng, n.location.coordinates[1], n.location.coordinates[0])
      if (d < minD) {
        minD = d
        nearestElev = n.elevation
      }
    }
    if (source === 'campus-pin') {
      manualPinOverrideRef.current = true
    } else {
      manualPinOverrideRef.current = false
    }
    setIsFollowing2D(false)
    setIsPlaying2D(false)
    liveUserPosRef.current = [lat, lng]
    setUserPosition([lat, lng])
    setUserElevation(nearestElev)
    setLocationSource(source)
    setPickingLocation(false)
    setFocusPos([lat, lng])
  }

  async function search() {
    if (!query.trim()) return
    setActiveTab('explore')
    setSearchMessage('')
    if (roomResults.length === 1 && buildingResults.length === 0) {
      const hit = roomResults[0]
      chooseBuilding(hit.building, {
        code: hit.room.code,
        name: hit.room.name,
        category: hit.room.category ?? undefined,
        floor: hit.floor,
        floorLabel: hit.floorLabel,
        note: hit.room.note ?? undefined,
      })
      return
    }
    if (hasApiBackend) {
      try {
        const response = await fetch(apiUrl('/api/search'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, context_building_id: selected?.id ?? null }),
        })
        if (response.ok) {
          const result = (await response.json()) as {
            status: string
            reply?: string
            intent?: string
            building?: { id: number } | null
            facility?: FacilityMatch
          }
          if (result.status === 'matched' && result.building) {
            const building = campusBuildings.find((item) => item.id === result.building?.id)
            if (building && result.intent === 'directions') {
              setMatchedFacility(null)
              setToId(building.id)
              setSelected(null)
              setActiveTab('route')
              void executeRoute(fromId || 'current', building.id, stepFree, true)
              setQuery('')
              return
            }
            if (building) {
              chooseBuilding(building, result.facility ?? null)
              return
            }
          }
          if (result.status === 'campus_only') {
            setSelected(null)
            setSearchMessage(t.campusOnly)
            return
          }
        }
      } catch {
        // Local matcher fallback
      }
    }
    if (roomResults.length > 0) {
      const hit = roomResults[0]
      chooseBuilding(hit.building, {
        code: hit.room.code,
        name: hit.room.name,
        category: hit.room.category ?? undefined,
        floor: hit.floor,
        floorLabel: hit.floorLabel,
        note: hit.room.note ?? undefined,
      })
    } else if (buildingResults.length >= 1) {
      chooseBuilding(buildingResults[0])
    } else {
      setSelected(null)
      setSearchMessage(t.noMatch)
    }
  }

  function applyLiveGpsPosition(coords: {
    latitude: number
    longitude: number
    heading?: number | null
    trueHeading?: number | null
    magneticHeading?: number | null
    speed?: number | null
  }) {
    const { latitude, longitude, heading, trueHeading, magneticHeading, speed } = coords
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return

    setGpsActive(true)
    setRawGpsCoord([latitude, longitude])
    lastRawGpsCoordRef.current = { lat: latitude, lng: longitude }

    const insideCampus = isInsideCampusBounds(latitude, longitude)
    let nearestElev = 98
    let nearestNodeLat = CAMPUS_CENTER[0]
    let nearestNodeLng = CAMPUS_CENTER[1]
    let minD = Infinity
    for (const n of SEEDED_PATH_NODES) {
      const nLat = n.location.coordinates[1]
      const nLng = n.location.coordinates[0]
      const d = haversineMeters(latitude, longitude, nLat, nLng)
      if (d < minD) {
        minD = d
        nearestElev = n.elevation
        nearestNodeLat = nLat
        nearestNodeLng = nLng
      }
    }

    const effectiveLat = insideCampus ? latitude : nearestNodeLat
    const effectiveLng = insideCampus ? longitude : nearestNodeLng

    const prevCoord = lastGpsCoordRef.current
    const nativeGpsHeading =
      typeof trueHeading === 'number' && Number.isFinite(trueHeading) && trueHeading >= 0
        ? trueHeading
        : typeof magneticHeading === 'number' && Number.isFinite(magneticHeading) && magneticHeading >= 0
          ? magneticHeading
          : typeof heading === 'number' && Number.isFinite(heading) && heading >= 0
            ? heading
            : null

    let nextHeadingDeg = liveHeadingRef.current
    if (!compassActiveRef.current) {
      if (nativeGpsHeading !== null && (speed ?? 0) >= 0.35) {
        nextHeadingDeg = normalizeHeadingDeg(nativeGpsHeading)
        liveHeadingRef.current = nextHeadingDeg
        setUserHeadingDeg(nextHeadingDeg)
      } else if (prevCoord) {
        const movedM = haversineMeters(prevCoord.lat, prevCoord.lng, latitude, longitude)
        if (movedM >= 1.2) {
          nextHeadingDeg = normalizeHeadingDeg(bearingDegrees(prevCoord.lat, prevCoord.lng, latitude, longitude))
          liveHeadingRef.current = nextHeadingDeg
          setUserHeadingDeg(nextHeadingDeg)
        }
      }
    }
    lastGpsCoordRef.current = { lat: latitude, lng: longitude }
    saveCachedGpsFix(latitude, longitude, nextHeadingDeg)

    if (insideCampus) {
      shownOutsideNoticeRef.current = false
    }

    const isSimulating = isFollowing2DRef.current && isPlaying2DRef.current
    const shouldFocus = pendingFocusOnGpsRef.current

    if (shouldFocus) {
      pendingFocusOnGpsRef.current = false
      manualPinOverrideRef.current = false
      setSelected(null)
      setIsFollowing2D(false)
      setIsPlaying2D(false)
      liveUserPosRef.current = [effectiveLat, effectiveLng]
      setUserPosition([effectiveLat, effectiveLng])
      setUserElevation(nearestElev)
      setLocationSource('gps')
      setPickingLocation(false)
      setFocusPos([effectiveLat, effectiveLng])
      setFocusUserSignal((n) => n + 1)
      if (insideCampus) {
        setRouteMessage('')
        setSearchMessage('')
      } else if (!shownOutsideNoticeRef.current) {
        shownOutsideNoticeRef.current = true
        const msg = txRef.current.gpsOutsideMsg
        if (activeTabRef.current === 'route') setRouteMessage(msg)
        else setSearchMessage(msg)
      }
      if (activeTabRef.current === 'route') setFromId('current')
      return
    }

    if (!manualPinOverrideRef.current && !isSimulating) {
      liveUserPosRef.current = [effectiveLat, effectiveLng]
      setUserPosition([effectiveLat, effectiveLng])
      setUserElevation(nearestElev)
      setLocationSource('gps')
      setPickingLocation(false)

      // Update paused turn-by-turn route progress when walking live along an active route
      if (insideCampus && isFollowing2DRef.current && routeSamplesRef.current.length > 0) {
        let bestDist = Infinity
        let bestProgress: number | null = null
        for (const s of routeSamplesRef.current) {
          const d = haversineMeters(effectiveLat, effectiveLng, s.lat, s.lng)
          if (d < bestDist) {
            bestDist = d
            bestProgress = s.distFromStart
          }
        }
        if (bestProgress !== null && bestDist <= 45) {
          setProgressDist2D(bestProgress)
        }
      }
    }
  }

  async function stopLiveGpsWatch() {
    gpsStartingRef.current = false
    const watchId = gpsWatchIdRef.current
    gpsWatchIdRef.current = null
    if (watchId === null) return
    if (typeof watchId === 'string') {
      await Geolocation.clearWatch({ id: watchId }).catch(() => undefined)
    } else if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  }

  async function startLiveGpsWatch({
    focusOnFix,
    requestNativePerm,
    showErrors,
  }: {
    focusOnFix: boolean
    requestNativePerm: boolean
    showErrors: boolean
  }) {
    if (focusOnFix) {
      manualPinOverrideRef.current = false
      pendingFocusOnGpsRef.current = true
      shownOutsideNoticeRef.current = false
    }

    if (gpsWatchIdRef.current !== null || gpsStartingRef.current) {
      if (focusOnFix && lastRawGpsCoordRef.current) {
        applyLiveGpsPosition({
          latitude: lastRawGpsCoordRef.current.lat,
          longitude: lastRawGpsCoordRef.current.lng,
        })
      }
      return
    }

    const handleGpsError = (err?: { code?: number; message?: string }) => {
      const denied = err?.code === 1 || /denied|permission/i.test(err?.message ?? '')
      if (denied) {
        setGpsActive(false)
        void stopLiveGpsWatch()
        if (showErrors && pendingFocusOnGpsRef.current) {
          pendingFocusOnGpsRef.current = false
          setFocusPos(userPositionRef.current)
          setPickingLocation(true)
          if (activeTabRef.current === 'route') setRouteMessage(tRef.current.noLocation)
          else setSearchMessage(tRef.current.noLocation)
        }
        return
      }
      // On high-accuracy timeout/unavailable, try a fast coarse location fix before showing any error
      if (!Capacitor.isNativePlatform() && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => applyLiveGpsPosition(coords),
          () => {
            if (showErrors && pendingFocusOnGpsRef.current) {
              pendingFocusOnGpsRef.current = false
              setFocusPos(userPositionRef.current)
              if (activeTabRef.current === 'route') setRouteMessage(tRef.current.noLocation)
              else setSearchMessage(tRef.current.noLocation)
            }
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
        )
      }
    }

    const watchOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      interval: 500,
      minimumUpdateInterval: 200,
      enableLocationFallback: true,
    }

    if (Capacitor.isNativePlatform()) {
      gpsStartingRef.current = true
      try {
        let perm = await Geolocation.checkPermissions()
        let granted = perm.location === 'granted' || perm.coarseLocation === 'granted'
        if (!granted && requestNativePerm) {
          perm = await Geolocation.requestPermissions()
          granted = perm.location === 'granted' || perm.coarseLocation === 'granted'
        }
        if (!granted) {
          handleGpsError({ code: 1, message: 'Location permission not granted' })
          return
        }
        // Fire fast coarse + fast fine fix in parallel so first location renders immediately
        void Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 2500, maximumAge: 60000 })
          .then(({ coords }) => applyLiveGpsPosition(coords))
          .catch(() => undefined)
        void Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 2000,
          enableLocationFallback: true,
        })
          .then(({ coords }) => applyLiveGpsPosition(coords))
          .catch(() => undefined)
        const id = await Geolocation.watchPosition(watchOptions, (pos, err) => {
          if (err) {
            handleGpsError(err as { code?: number; message?: string })
            return
          }
          if (pos?.coords) {
            applyLiveGpsPosition(pos.coords)
          }
        })
        gpsWatchIdRef.current = id
      } catch (err) {
        handleGpsError(err as { code?: number; message?: string })
      } finally {
        gpsStartingRef.current = false
      }
      return
    }

    if (!navigator.geolocation) {
      handleGpsError({ code: 2, message: 'Geolocation unavailable' })
      return
    }

    // Immediate parallel coarse + fine fix for fastest first render while watchPosition streams updates
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => applyLiveGpsPosition(coords),
      () => undefined,
      { enableHighAccuracy: false, timeout: 2500, maximumAge: 60000 },
    )
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => applyLiveGpsPosition(coords),
      () => undefined,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 2000 },
    )

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => applyLiveGpsPosition(coords),
      (err) => handleGpsError(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
    gpsWatchIdRef.current = watchId
  }

  useEffect(() => {
    let cancelled = false
    let permStatus: PermissionStatus | null = null
    let onPermChange: (() => void) | null = null

    if (Capacitor.isNativePlatform()) {
      void Geolocation.checkPermissions()
        .then((perm) => {
          if (cancelled) return
          if (perm.location === 'granted' || perm.coarseLocation === 'granted') {
            void startLiveGpsWatch({ focusOnFix: true, requestNativePerm: false, showErrors: false })
          }
        })
        .catch(() => undefined)
    } else if (navigator.permissions?.query) {
      void navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((status) => {
          if (cancelled) return
          permStatus = status
          if (status.state === 'granted') {
            void startLiveGpsWatch({ focusOnFix: true, requestNativePerm: false, showErrors: false })
          }
          onPermChange = () => {
            if (!cancelled && status.state === 'granted') {
              void startLiveGpsWatch({ focusOnFix: true, requestNativePerm: false, showErrors: false })
            } else if (!cancelled && status.state === 'denied') {
              setGpsActive(false)
              void stopLiveGpsWatch()
            }
          }
          status.addEventListener('change', onPermChange)
        })
        .catch(() => undefined)
    }

    return () => {
      cancelled = true
      if (permStatus && onPermChange) {
        permStatus.removeEventListener('change', onPermChange)
      }
      void stopLiveGpsWatch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // High-frequency phone compass / orientation streaming (60fps ref + throttled React sync)
  useEffect(() => {
    const handleOrientation = (ev: DeviceOrientationEvent) => {
      if (isFollowing2DRef.current) return
      const now = performance.now()
      const reading = extractCompassHeading(ev as DeviceOrientationEvent & { webkitCompassHeading?: number | null })
      if (!reading) return

      if (reading.isAbsolute) {
        lastAbsoluteCompassAtRef.current = now
      } else if (now - lastAbsoluteCompassAtRef.current < 2500) {
        return
      }

      const nextHeading = compassInitializedRef.current
        ? stepAngleDeg(liveHeadingRef.current, reading.headingDeg, 0.45)
        : reading.headingDeg
      compassInitializedRef.current = true
      liveHeadingRef.current = nextHeading

      if (!compassActiveRef.current) {
        compassActiveRef.current = true
        setCompassActive(true)
      }
      if (!autoCompassAppliedRef.current && !manualCompassDisabledRef.current) {
        autoCompassAppliedRef.current = true
        setCompassViewActive(true)
      }

      if (
        now - lastHeadingStateAtRef.current >= 80 &&
        Math.abs(shortestAngleDeltaDeg(lastCommittedHeadingRef.current, nextHeading)) >= 2
      ) {
        lastHeadingStateAtRef.current = now
        lastCommittedHeadingRef.current = nextHeading
        setUserHeadingDeg(Math.round(nextHeading))
      }
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true)
    window.addEventListener('deviceorientation', handleOrientation as EventListener, true)
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true)
      window.removeEventListener('deviceorientation', handleOrientation as EventListener, true)
    }
  }, [])

  function tryLocation() {
    void requestCompassPermissionIfNeeded().catch(() => 'unsupported')
    void startLiveGpsWatch({ focusOnFix: true, requestNativePerm: true, showErrors: true })
  }

  function toggleCompassView() {
    void requestCompassPermissionIfNeeded().catch(() => 'unsupported')
    setCompassViewActive((prev) => {
      const next = !prev
      manualCompassDisabledRef.current = !next
      if (next) {
        setPickingLocation(false)
        setFocusPos([...liveUserPosRef.current])
        setFocusUserSignal((n) => n + 1)
        if (gpsWatchIdRef.current === null && !gpsStartingRef.current) {
          void startLiveGpsWatch({ focusOnFix: false, requestNativePerm: true, showErrors: false })
        }
      }
      return next
    })
  }

  function disableCompassView() {
    manualCompassDisabledRef.current = true
    setCompassViewActive(false)
  }

  async function executeRoute(
    origin: number | 'current' | '',
    destination: number | '',
    preferStepFree: boolean,
    startFollowAfter = false,
  ) {
    if (origin !== '' && destination !== '' && origin === destination) {
      setRouteMessage(t.routeSame)
      return
    }
    if (origin === '' || destination === '') {
      setRouteMessage(origin === '' ? t.chooseFrom : t.chooseTo)
      return
    }
    setRouteMessage('')

    const startBldgObj = origin !== 'current' ? campusBuildings.find((b) => b.id === origin) : null
    const destBldgObj = campusBuildings.find((b) => b.id === destination)
    const startName =
      origin === 'current'
        ? `${t.current} (${userLocationSummary.shortText})`
        : startBldgObj
          ? getLocalizedBuildingName(startBldgObj, language)
          : t.from
    const destName = destBldgObj ? getLocalizedBuildingName(destBldgObj, language) : t.to

    const routeRequest =
      origin === 'current'
        ? {
            start_coordinates: { type: 'Point', coordinates: [userPosition[1], userPosition[0]] },
            end_building_id: destination,
            step_free: preferStepFree,
          }
        : { start_building_id: origin, end_building_id: destination, step_free: preferStepFree }

    if (hasApiBackend) {
      try {
        const response = await fetch(apiUrl('/api/routes'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routeRequest),
        })
        if (response.ok) {
          const route = (await response.json()) as {
            distance_m: number
            estimated_minutes: number
            max_slope_pct?: number
            uphill_distance_m?: number
            downhill_distance_m?: number
            step_free: boolean
            waypoints?: RouteWaypoint[]
            segments?: RouteSegment[]
          }
          if (route.segments && route.segments.length > 0) {
            const built: ActiveRouteData = {
              startName,
              destinationName: destName,
              distance_m: route.distance_m,
              estimated_minutes: route.estimated_minutes,
              max_slope_pct: route.max_slope_pct ?? 0,
              uphill_distance_m: route.uphill_distance_m ?? 0,
              downhill_distance_m: route.downhill_distance_m ?? 0,
              step_free: route.step_free,
              waypoints: route.waypoints ?? [],
              segments: route.segments,
            }
            setActiveRoute(built)
            setProgressDist2D(0)
            setRouteMessage(
              tx.routeSummaryMsg(built.distance_m, built.estimated_minutes, built.uphill_distance_m, built.max_slope_pct),
            )
            if (startFollowAfter) {
              setSelected(null)
              setCameraLock2D(true)
              setNavHudEnabled(true)
              setIsFollowing2D(true)
              setIsPlaying2D(true)
            } else {
              setIsFollowing2D(false)
              setIsPlaying2D(false)
            }
            return
          }
        }
      } catch {
        // Fallback to client graph
      }
    }

    const fallback = computeClientRoute(origin, destination, userPosition, preferStepFree, campusBuildings)
    if (fallback) {
      fallback.startName = startName
      fallback.destinationName = destName
      setActiveRoute(fallback)
      setProgressDist2D(0)
      setRouteMessage(
        tx.routeSummaryMsg(fallback.distance_m, fallback.estimated_minutes, fallback.uphill_distance_m, fallback.max_slope_pct),
      )
      if (startFollowAfter) {
        setSelected(null)
        setCameraLock2D(true)
        setNavHudEnabled(true)
        setIsFollowing2D(true)
        setIsPlaying2D(true)
      } else {
        setIsFollowing2D(false)
        setIsPlaying2D(false)
      }
    } else {
      setActiveRoute(null)
      setIsFollowing2D(false)
      setIsPlaying2D(false)
      setRouteMessage(t.routeUnavailable)
    }
  }

  function startDirections(building: Building, autoFollow = true) {
    const nextFrom = fromId === '' || fromId === building.id ? 'current' : fromId
    setFromId(nextFrom)
    setToId(building.id)
    setActiveTab('route')
    setSelected(null)
    void executeRoute(nextFrom, building.id, stepFree, autoFollow)
  }

  function stop2DFollowMode() {
    isFollowing2DRef.current = false
    isPlaying2DRef.current = false
    setIsFollowing2D(false)
    setIsPlaying2D(false)
    if (gpsActive && !manualPinOverrideRef.current && lastRawGpsCoordRef.current) {
      applyLiveGpsPosition({
        latitude: lastRawGpsCoordRef.current.lat,
        longitude: lastRawGpsCoordRef.current.lng,
      })
    }
  }

  function launch2DFollowMode() {
    if (activeRoute) {
      setSelected(null)
      setCameraLock2D(true)
      setNavHudEnabled(true)
      setIsFollowing2D(true)
      setIsPlaying2D(true)
      return
    }
    const targetDest = selected?.id ?? (toId !== '' ? toId : 9)
    const targetOrigin = fromId !== '' && fromId !== targetDest ? fromId : 'current'
    setFromId(targetOrigin)
    setToId(targetDest)
    void executeRoute(targetOrigin, targetDest, stepFree, true)
  }

  function handleUserCameraInterrupt() {
    setCameraLock2D(false)
    setIsPlaying2D(false)
  }

  function handleRecenterFollowCamera() {
    setCameraLock2D(true)
    setIsPlaying2D(true)
    setFocusUserSignal((n) => n + 1)
  }

  function selectMockCourse(courseId: string) {
    const course = MOCK_WAYPOINT_COURSES.find((c) => c.id === courseId)
    if (!course) return
    const built = buildRouteFromWaypoints(course.waypoints, course.startName, course.destinationName)
    setSelectedMockCourseId(courseId)
    setActiveRoute(built)
    setProgressDist2D(0)
    setSelected(null)
    setCameraLock2D(true)
    setNavHudEnabled(true)
    setIsFollowing2D(true)
    setIsPlaying2D(true)
    setFocusUserSignal((n) => n + 1)
  }

  function toggle2DFollowMode() {
    if (isFollowing2D) {
      stop2DFollowMode()
      return
    }
    launch2DFollowMode()
  }

  function toggleNavHud() {
    setNavHudEnabled((prev) => {
      const next = !prev
      if (!next) setIsPlaying2D(false)
      return next
    })
  }

  const routePositions = useMemo<[number, number][]>(() => {
    if (!activeRoute) return []
    const pts: [number, number][] = []
    activeRoute.segments.forEach((seg, idx) => {
      if (idx === 0) pts.push(seg.from_coord)
      pts.push(seg.to_coord)
    })
    return pts
  }, [activeRoute])

  const routeKey = useMemo(
    () => (activeRoute ? `${activeRoute.startName}-${activeRoute.destinationName}-${activeRoute.distance_m}` : ''),
    [activeRoute],
  )

  const passedPositions = useMemo<[number, number][]>(() => {
    if (!isFollowing2D || !routeSamples.length) return []
    const pts = routeSamples
      .filter((s) => s.distFromStart <= progressDist2D)
      .map((s): [number, number] => [s.lat, s.lng])
    if (currentFollowSample) pts.push([currentFollowSample.lat, currentFollowSample.lng])
    return pts
  }, [isFollowing2D, routeSamples, progressDist2D, currentFollowSample])

  const remainingPositions = useMemo<[number, number][]>(() => {
    if (!activeRoute) return []
    if (!isFollowing2D || !routeSamples.length) return routePositions
    const pts: [number, number][] = []
    if (currentFollowSample) pts.push([currentFollowSample.lat, currentFollowSample.lng])
    for (const s of routeSamples) {
      if (s.distFromStart > progressDist2D) pts.push([s.lat, s.lng])
    }
    return pts
  }, [activeRoute, routePositions, isFollowing2D, routeSamples, progressDist2D, currentFollowSample])

  return (
    <main className="app-shell">
      <aside className={`sidebar mobile-sheet-${mobileSheetSnap}`}>
        <button
          type="button"
          className="mobile-sheet-grip"
          onClick={toggleMobileSheet}
          onPointerDown={handleSheetPointerDown}
          onPointerMove={handleSheetPointerMove}
          onPointerUp={handleSheetPointerUp}
          onPointerCancel={handleSheetPointerUp}
          aria-label={mobileSheetSnap === 'peek' ? '정보 패널 열기' : '정보 패널 접기'}
          aria-expanded={mobileSheetSnap !== 'peek'}
        >
          <span className="mobile-sheet-grip-bar" aria-hidden="true" />
          <span className="sr-only">정보 패널을 위아래로 끌거나 눌러 열고 닫기</span>
        </button>
        <header className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            <Compass size={20} strokeWidth={1.8} />
          </div>
          <div className="brand-copy">
            <strong>
              DSU <span>3D MAP</span>
            </strong>
            <small>{t.guide}</small>
          </div>
          <button
            className={showAdmin ? 'admin-toggle active' : 'admin-toggle'}
            onClick={() => setShowAdmin(!showAdmin)}
            aria-label={tx.adminBtn}
          >
            <LockKeyhole size={14} />
            <span>{tx.adminBtn}</span>
          </button>
          {!isNativeApp && (
            <button
              type="button"
              className="app-install-button"
              onClick={openInstallModal}
              aria-label={APK_INSTALL_UI[language].aria}
              title={APK_INSTALL_UI[language].aria}
            >
              <Download size={14} />
              <span>{APK_INSTALL_UI[language].button}</span>
            </button>
          )}
          <div className="language-picker" aria-label={t.language}>
            <Languages size={15} />
            <select aria-label={t.language} value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
              {(Object.keys(languageLabels) as Language[]).map((code) => (
                <option key={code} value={code}>
                  {languageLabels[code]}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="lang-chevron" />
          </div>
        </header>

        {showInstallDialog &&
          createPortal(
            <div className="install-help-backdrop" role="presentation" onClick={() => setShowInstallDialog(false)}>
              <section
                className="install-help-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="install-help-title"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="install-help-head">
                  <h2 id="install-help-title">{APK_INSTALL_UI[language].title}</h2>
                  <button
                    type="button"
                    className="install-help-close"
                    onClick={() => setShowInstallDialog(false)}
                    aria-label={APK_INSTALL_UI[language].close}
                  >
                    <X size={15} />
                  </button>
                </div>
                <p className="install-help-msg">
                  {isIosDevice ? APK_INSTALL_UI[language].iosDesc : APK_INSTALL_UI[language].hint}
                </p>
                {!isIosDevice && (
                  <a className="install-apk-download" href={APK_INSTALL_URL} download="dongseo-campus-map.apk">
                    <Download size={14} />
                    <span>{APK_INSTALL_UI[language].downloadBtn}</span>
                  </a>
                )}
              </section>
            </div>,
            document.body,
          )}

        <div className="sidebar-scroll">
          {showAdmin ? (
            <AdminPanel buildings={campusBuildings} onClose={() => setShowAdmin(false)} />
          ) : (
            <>
              <section className="intro-block">
                <div className="eyebrow">
                  <span className="eyebrow-line" />
                  {t.eyebrow}
                </div>
                <h1>
                  {t.title.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index === 0 && <br />}
                    </span>
                  ))}
                </h1>
                <p>{t.subtitle}</p>
              </section>

              {/* My Current Campus Location Banner */}
              <section className="my-location-card" aria-label={tx.myLocTitle}>
                <div className="my-loc-top">
                  <span className="my-loc-dot" />
                  <div className="my-loc-copy">
                    <span className="my-loc-kicker">
                      {tx.myLocTitle} ({locationSource === 'gps' ? tx.myLocGps : locationSource === '2d-follow' ? tx.myLocFollow : tx.myLocPin})
                    </span>
                    <strong>
                      {tx.nearText(userLocationSummary.nearestDisplayName, userLocationSummary.distanceMeters)}
                    </strong>
                    <small>
                      {tx.coordElevText(
                        (locationSource === 'gps' && rawGpsCoord ? rawGpsCoord[0] : userPosition[0]).toFixed(5),
                        (locationSource === 'gps' && rawGpsCoord ? rawGpsCoord[1] : userPosition[1]).toFixed(5),
                        userElevation.toFixed(1),
                      )}
                    </small>
                  </div>
                </div>
                <div className="my-loc-actions">
                  <button
                    className={gpsActive && locationSource === 'gps' ? 'my-loc-btn gps-live' : 'my-loc-btn'}
                    onClick={tryLocation}
                  >
                    <LocateFixed size={13} />{tx.gpsMyLocBtn}
                  </button>
                  <button
                    className={compassViewActive ? 'my-loc-btn compass-live' : 'my-loc-btn'}
                    onClick={toggleCompassView}
                    aria-pressed={compassViewActive}
                    title={compassViewActive ? tx.compassViewOnTitle : tx.compassViewOffTitle}
                  >
                    <Compass size={13} />
                    {tx.compassViewBtn} · {formatCardinalDirection(userHeadingDeg, language)}
                  </button>
                  <button
                    className={pickingLocation ? 'my-loc-btn active' : 'my-loc-btn'}
                    onClick={() => setPickingLocation(!pickingLocation)}
                  >
                    <Crosshair size={13} />
                    {pickingLocation ? tx.clickMapPrompt : tx.changeLocOnMapBtn}
                  </button>
                  <button
                    className={isFollowing2D ? 'my-loc-btn highlight active' : 'my-loc-btn highlight'}
                    onClick={toggle2DFollowMode}
                    aria-pressed={isFollowing2D}
                  >
                    <Navigation size={13} />{isFollowing2D ? tx.followStopBtn : tx.followMyViewBtn}
                  </button>
                </div>
                <div className="my-loc-presets">
                  <span>{tx.quickJumpLabel}</span>
                  {[
                    { num: 13, lat: 35.14548, lng: 129.00782 },
                    { num: 14, lat: 35.14568, lng: 129.00738 },
                    { num: 24, lat: 35.14552, lng: 129.00938 },
                    { num: 21, lat: 35.14424, lng: 129.01215 },
                  ].map((preset) => {
                    const bObj = campusBuildings.find((b) => b.campusNumber === preset.num)
                    const labelText = bObj ? `${preset.num} ${getLocalizedBuildingName(bObj, language)}` : `#${preset.num}`
                    return (
                      <button
                        key={preset.num}
                        onClick={() => setCampusUserLocation(preset.lat, preset.lng, 'campus-pin')}
                        className="preset-loc-chip"
                      >
                        {labelText}
                      </button>
                    )
                  })}
                </div>
              </section>

              <div className="mode-tabs" role="tablist" aria-label={t.guide}>
                <button
                  className={activeTab === 'explore' ? 'mode-tab active' : 'mode-tab'}
                  onClick={() => {
                    setActiveTab('explore')
                    setRouteMessage('')
                  }}
                  role="tab"
                  aria-selected={activeTab === 'explore'}
                >
                  <Search size={16} />
                  {t.searchResults}
                </button>
                <button
                  className={activeTab === 'route' ? 'mode-tab active' : 'mode-tab'}
                  onClick={() => {
                    setActiveTab('route')
                    setRouteMessage('')
                  }}
                  role="tab"
                  aria-selected={activeTab === 'route'}
                >
                  <Navigation size={16} />
                  {t.directions}
                </button>
              </div>

              {activeTab === 'explore' ? (
                <>
                  <section className="search-section">
                    <label className="sr-only" htmlFor="place-search">
                      {t.search}
                    </label>
                    <div className="search-box">
                      <Search size={18} className="search-icon" />
                      <input
                        id="place-search"
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value)
                          setSearchMessage('')
                        }}
                        onKeyDown={(event) => event.key === 'Enter' && search()}
                        placeholder={t.search}
                        autoComplete="off"
                      />
                      {query && (
                        <button
                          className="clear-query"
                          onClick={() => {
                            setQuery('')
                            setSearchMessage('')
                          }}
                          aria-label={t.clear}
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button className="submit-search" onClick={search} aria-label={t.ask}>
                        <ArrowRight size={17} />
                      </button>
                    </div>
                    {!query && (
                      <div className="search-hint">
                        <span className="sparkle">✳</span>
                        {t.askExample}
                      </div>
                    )}
                    {query && (buildingResults.length > 0 || roomResults.length > 0) && (
                      <div className="result-list" aria-label={t.searchResults}>
                        {roomResults.map((hit, idx) => {
                          const locRm = getLocalizedRoomTitleAndNote(hit.room, language, hit.building, hit.floor, idx)
                          const localBldgName = getLocalizedBuildingName(hit.building, language)
                          return (
                            <button
                              key={`rm-${hit.building.id}-${idx}`}
                              onClick={() =>
                                chooseBuilding(hit.building, {
                                  code: hit.room.code,
                                  name: hit.room.name,
                                  category: hit.room.category ?? undefined,
                                  floor: hit.floor,
                                  floorLabel: hit.floorLabel,
                                  note: hit.room.note ?? undefined,
                                })
                              }
                              className="result-row room-hit-row"
                            >
                              <span className="result-pin room-hit-pin">
                                <DoorOpen size={15} />
                              </span>
                              <span>
                                <strong>[{locRm.codeStr}] {locRm.titleStr}</strong>
                                <small>
                                  (#{hit.building.campusNumber}) [{hit.building.codePrefix}] {localBldgName} · {getLocalizedFloorLabel(hit.floorLabel, language)}
                                </small>
                              </span>
                              <ArrowRight size={15} />
                            </button>
                          )
                        })}
                        {buildingResults.map((building) => {
                          const localName = getLocalizedBuildingName(building, language)
                          return (
                            <button key={building.id} onClick={() => chooseBuilding(building)} className="result-row">
                              <span className="sidebar-red-num">{building.campusNumber ?? building.id}</span>
                              <img
                                className="building-mini-thumb"
                                src={getBuildingAppearanceSvgDataUri(building)}
                                alt={localName}
                              />
                              <span>
                                <strong>
                                  [{building.codePrefix}] {localName}
                                </strong>
                                <small>
                                  {tx.floorsScale(building.levels ?? 4)} · {tx.roomCodePrefixLabel} {building.codeRange}
                                </small>
                              </span>
                              <ArrowRight size={15} />
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {searchMessage && (
                      <div className="inline-alert">
                        <Info size={15} />
                        <span>{searchMessage}</span>
                      </div>
                    )}
                  </section>

                  <section className="suggestion-section">
                    <div className="section-kicker">{t.suggested}</div>
                    <div className="suggestion-list">
                      {[1, 2, 3, 6, 9, 10].map((id) => {
                        const building = campusBuildings.find((item) => item.id === id)
                        return (
                          building && (
                            <button key={id} onClick={() => chooseBuilding(building)} className="suggestion-chip">
                              <span className="chip-red-num">{building.campusNumber}</span>
                              {getLocalizedBuildingName(building, language)}
                              <ArrowRight size={13} />
                            </button>
                          )
                        )
                      })}
                    </div>
                  </section>

                  <section className="building-list-section">
                    <div className="list-heading">
                      <div>
                        <div className="section-kicker">{t.map}</div>
                        <h2>{t.all}</h2>
                      </div>
                      <span className="count-pill">
                        {campusBuildings.length} <span>{t.buildings}</span>
                      </span>
                    </div>
                    <div className="building-list">
                      {campusBuildings.map((building) => {
                        const distFromUser = Math.round(haversineMeters(userPosition[0], userPosition[1], building.lat, building.lng))
                        const localName = getLocalizedBuildingName(building, language)
                        const localDept = getLocalizedBuildingDept(building, language)
                        return (
                          <button
                            className={selected?.id === building.id ? 'building-row selected' : 'building-row'}
                            key={building.id}
                            onClick={() => chooseBuilding(building)}
                          >
                            <span className="sidebar-red-num">{building.campusNumber ?? building.id}</span>
                            <img
                              className="building-mini-thumb"
                              src={getBuildingAppearanceSvgDataUri(building)}
                              alt={localName}
                              title={localName}
                            />
                            <div className="building-row-copy">
                              <span className="building-name">
                                {localName} <b className="inline-code-tag">[{building.codePrefix}]</b>
                              </span>
                              <small className="building-code-sub">
                                {tx.floorsScale(building.levels ?? 4)} · {building.codeRange} · {localDept}
                              </small>
                            </div>
                            <span className="building-meta-tag">{distFromUser}m</span>
                          </button>
                        )
                      })}
                    </div>
                  </section>
                </>
              ) : (
                <RoutePanel
                  buildings={campusBuildings}
                  pathNodeCount={pathNodeCount}
                  pathEdgeCount={pathEdgeCount}
                  userLocationLabel={userLocationSummary.shortText}
                  fromId={fromId}
                  toId={toId}
                  setFromId={setFromId}
                  setToId={setToId}
                  stepFree={stepFree}
                  setStepFree={setStepFree}
                  onCheck={() => void executeRoute(fromId, toId, stepFree, false)}
                  onStartFollow={() => {
                    if (isFollowing2D) stop2DFollowMode()
                    else void executeRoute(fromId || 'current', toId || 9, stepFree, true)
                  }}
                  isFollowing2D={isFollowing2D}
                  activeRoute={activeRoute}
                  googleElevationProfile={googleElevationProfile}
                  googleElevationLoading={googleElevationLoading}
                  googleElevationMessage={googleElevationMessage}
                  onLoadGoogleElevation={() => void loadGoogleElevationProfile()}
                  message={routeMessage}
                  language={language}
                  t={t}
                />
              )}
            </>
          )}
        </div>

        <footer className="sidebar-footer">
          <span className="footer-dot" />
          {t.dataNote}
          <span className="footer-spacer" />
          <span>v0.6 3D-MAP</span>
        </footer>
      </aside>

      {mobileSheetSnap === 'closed' && (
        <button
          type="button"
          className="mobile-sheet-reopen"
          onClick={() => setMobileSheetSnap('peek')}
          aria-label="정보 패널 다시 열기"
        >
          <span className="mobile-sheet-grip-bar" aria-hidden="true" />
        </button>
      )}

      <section className="map-stage" aria-label={t.map}>
        {mapViewMode === '3d' ? (
          <Campus3DIsoMap
            buildings={campusBuildings}
            selected={selected}
            userPosition={userPosition}
            userLocationLabel={userLocationSummary.shortText}
            userHeadingDeg={userHeadingDeg}
            liveUserPosRef={liveUserPosRef}
            liveHeadingRef={liveHeadingRef}
            gpsActive={gpsActive && locationSource === 'gps'}
            compassViewActive={compassViewActive}
            compassActive={compassActive}
            focusUserSignal={focusUserSignal}
            activeRoute={activeRoute}
            passedPositions={passedPositions}
            progressDist={progressDist2D}
            isFollowing={isFollowing2D}
            cameraLock={cameraLock2D}
            pickingLocation={pickingLocation}
            onSelectBuilding={(b) => chooseBuilding(b)}
            onPickLocation={(lat, lng) => setCampusUserLocation(lat, lng, 'campus-pin')}
            onTryGpsLocation={tryLocation}
            onToggleCompassView={toggleCompassView}
            onDisableCompassView={disableCompassView}
            onUserCameraInterrupt={handleUserCameraInterrupt}
            onRecenterFollowCamera={handleRecenterFollowCamera}
            onSwitchTo2D={() => setMapViewMode('2d')}
            language={language}
          />
        ) : (
          <MapContainer
            center={CAMPUS_CENTER}
            zoom={17}
            minZoom={15}
            maxZoom={19}
            maxBounds={CAMPUS_BOUNDS}
            maxBoundsViscosity={0.85}
            renderer={WIDE_SVG_RENDERER}
            zoomControl={false}
            scrollWheelZoom
            className={pickingLocation ? 'campus-map picking-cursor' : 'campus-map'}
          >
            <MapResize />
            <MapFocus
              selected={selected}
              focusPos={focusPos}
              userPosition={userPosition}
              focusUserSignal={focusUserSignal}
              isFollowingRoute={isFollowing2D}
            />
            <MapFollowUser
              active={isFollowing2D}
              cameraLock={cameraLock2D}
              userPosition={userPosition}
              onUserInteract={handleUserCameraInterrupt}
            />
            <FitRoute routeId={routeKey} positions={routePositions} isFollowingRoute={isFollowing2D} />
            <MapZoomButtons
              onResetCampus={() => {
                setSelected(null)
                setIsFollowing2D(false)
                setIsPlaying2D(false)
              }}
              onSwitchTo3D={() => setMapViewMode('3d')}
            />
            <MapClickPickLocation
              pickingMode={pickingLocation}
              onPickLocation={(lat, lng) => setCampusUserLocation(lat, lng, 'campus-pin')}
            />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              minZoom={15}
              maxZoom={19}
              maxNativeZoom={19}
              keepBuffer={8}
            />

            {/* Exterior Mask Polygon */}
            <Polygon
              positions={CAMPUS_MASK_POLYGON}
              pathOptions={{
                fillColor: '#d9e3db',
                fillOpacity: 0.92,
                fillRule: 'evenodd',
                stroke: false,
                interactive: false,
              }}
            />

            {/* Dongseo University Campus Frame Border */}
            <Polygon
              positions={CAMPUS_BOUNDARY}
              pathOptions={{
                color: '#1d573f',
                weight: 3,
                opacity: 0.88,
                dashArray: '8 6',
                fill: false,
                interactive: false,
              }}
            />

            {/* Flat 2D Footprint Outline only for the currently selected building (No 3D extruded building UI on 2D map) */}
            {selected && selected.footprint && selected.footprint.length >= 3 && (
              <Polygon
                positions={selected.footprint}
                pathOptions={{
                  color: '#1d573f',
                  weight: 2.5,
                  fillColor: '#22c55e',
                  fillOpacity: 0.18,
                  dashArray: '4 3',
                  interactive: false,
                }}
              />
            )}

            {/* Passed path polyline (muted gray) */}
            {isFollowing2D && passedPositions.length > 1 && (
              <>
                <Polyline
                  positions={passedPositions}
                  pathOptions={{
                    color: ROUTE_NAV_CONFIG.PASSED_CASING_COLOR,
                    weight: ROUTE_NAV_CONFIG.LINE_PASSED_CASING_WEIGHT_2D,
                    opacity: 0.55,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
                <Polyline
                  positions={passedPositions}
                  pathOptions={{
                    color: ROUTE_NAV_CONFIG.PASSED_LINE_COLOR,
                    weight: ROUTE_NAV_CONFIG.LINE_PASSED_WEIGHT_2D,
                    opacity: 0.72,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
              </>
            )}

            {/* Remaining destination polyline with high-contrast white outer border & vivid green main stroke */}
            {activeRoute && remainingPositions.length > 1 && (
              <>
                <Polyline
                  positions={remainingPositions}
                  pathOptions={{
                    color: ROUTE_NAV_CONFIG.CASING_COLOR,
                    weight: ROUTE_NAV_CONFIG.LINE_CASING_WEIGHT_2D,
                    opacity: 0.96,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
                <Polyline
                  positions={remainingPositions}
                  pathOptions={{
                    color: ROUTE_NAV_CONFIG.MAIN_LINE_COLOR,
                    weight: ROUTE_NAV_CONFIG.LINE_MAIN_WEIGHT_2D,
                    opacity: 0.98,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
              </>
            )}

            {activeRoute &&
              activeRoute.segments.map((seg, idx) => {
                if (Math.abs(seg.slope_pct) < 3.0 && seg.is_step_free) return null
                const info = classifySlope(seg.slope_pct, seg.is_step_free, language)
                const midLat = (seg.from_coord[0] + seg.to_coord[0]) / 2
                const midLng = (seg.from_coord[1] + seg.to_coord[1]) / 2
                return (
                  <Marker
                    key={`slope-pin-${seg.id}-${idx}`}
                    position={[midLat, midLng]}
                    icon={createSlopeMarkerIcon(info.shortLabel, info.color)}
                  />
                )
              })}

            {activeRoute && routePositions.length > 1 && (
              <>
                <Marker position={routePositions[0]} icon={createEndpointBadgeIcon(tx.startBadge, '#16a34a')} />
                <Marker position={routePositions[routePositions.length - 1]} icon={createEndpointBadgeIcon(tx.endBadge, '#ea580c')} />
              </>
            )}

            {/* 2D Map Building Number Pins */}
            {campusBuildings.map((building) => {
              const localName = getLocalizedBuildingName(building, language)
              return (
                <Marker
                  key={`num-pin-${building.id}`}
                  position={[building.lat, building.lng]}
                  icon={createBuilding2DVisualIcon(building, selected?.id === building.id, language)}
                  eventHandlers={{ click: () => chooseBuilding(building) }}
                  title={`#${building.campusNumber} ${localName}`}
                  alt={t.markerAlt}
                />
              )
            })}

            <Marker
              position={userPosition}
              icon={createUserLocationIcon(userHeadingDeg, userLocationSummary.shortText, isFollowing2D, language)}
              title={t.current}
            />
          </MapContainer>
        )}

        {/* Top Floating Bar with 2D / 3D Mode Switcher */}
        {!isFollowing2D && (
          <div className="map-topline">
            <div className="map-location">
              <span className="location-icon">
                <MapPin size={16} />
              </span>
              <span>
                <strong>
                  {mapViewMode === '3d' ? tx.topBarTitle3D : tx.topBarTitle2D} · {tx.topBarMyLocLabel}: {userLocationSummary.shortText}
                </strong>
                <small>
                  {tx.topBarSub(userElevation.toFixed(1))}
                </small>
              </span>
            </div>

            <div className="map-top-actions">
              <button className="map-3d-launch" onClick={launch2DFollowMode}>
                <Navigation size={16} />
                <span>{tx.followMyViewBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* Naver Map Style User-Perspective Route Follower HUD */}
        {isFollowing2D && activeRoute && currentFollowSample && (
          <Naver2DRouteFollower
            route={activeRoute}
            samples={routeSamples}
            totalDistance={routeTotalDist}
            currentSample={currentFollowSample}
            progressDist={progressDist2D}
            setProgressDist={setProgressDist2D}
            isPlaying={isPlaying2D}
            setIsPlaying={setIsPlaying2D}
            speedMultiplier={speedMultiplier2D}
            setSpeedMultiplier={setSpeedMultiplier2D}
            headingUpMode={cameraLock2D}
            setHeadingUpMode={setCameraLock2D}
            onRecenterCamera={handleRecenterFollowCamera}
            selectedMockCourseId={selectedMockCourseId}
            onSelectMockCourse={selectMockCourse}
            mapViewMode={mapViewMode}
            onToggleMapViewMode={() => setMapViewMode((m) => (m === '2d' ? '3d' : '2d'))}
            navHudEnabled={navHudEnabled}
            onToggleNavHud={toggleNavHud}
            onCloseFollow={stop2DFollowMode}
            language={language}
          />
        )}

        {mapViewMode === '2d' && isFollowing2D && !cameraLock2D && (
          <button type="button" className="recenter-follow-btn" onClick={handleRecenterFollowCamera}>
            <Navigation size={15} />
            <span>시점 복귀</span>
          </button>
        )}

        {pickingLocation && (
          <div className="picking-banner">
            <Crosshair size={16} />
            <span>{tx.pickingBannerText}</span>
            <button onClick={() => setPickingLocation(false)}>{tx.cancelBtn}</button>
          </div>
        )}

        {mapViewMode === '2d' && (
          <>
            <button
              type="button"
              className={compassViewActive ? 'compass-2d-button compass-live' : 'compass-2d-button'}
              onClick={toggleCompassView}
              aria-pressed={compassViewActive}
              aria-label={compassViewActive ? tx.compassViewOnTitle : tx.compassViewOffTitle}
              title={compassViewActive ? tx.compassViewOnTitle : tx.compassViewOffTitle}
            >
              <Compass size={18} />
            </button>
            <button
              className={gpsActive && locationSource === 'gps' ? 'locate-button gps-live' : 'locate-button'}
              onClick={tryLocation}
              aria-label={t.locate}
              title={t.locate}
            >
              <LocateFixed size={18} />
            </button>
          </>
        )}

        {!isFollowing2D && mapViewMode === '2d' && (
          <div className="map-caption">
            <span className="caption-pulse" />
            {activeRoute
              ? tx.activeRouteCaption(activeRoute.startName, activeRoute.destinationName, activeRoute.distance_m, activeRoute.max_slope_pct)
              : t.mapHint}
          </div>
        )}

        {selected && !isFollowing2D && (
          <BuildingSheet
            building={selected}
            facility={matchedFacility}
            distanceFromUser={Math.round(haversineMeters(userPosition[0], userPosition[1], selected.lat, selected.lng))}
            language={language}
            t={t}
            onClose={() => {
              setSelected(null)
              setMatchedFacility(null)
            }}
            onDirections={() => startDirections(selected, false)}
            onStartFollow={() => startDirections(selected, true)}
          />
        )}
      </section>
    </main>
  )
}

type AdminResource = 'buildings' | 'facilities' | 'path-nodes' | 'path-edges'

function AdminPanel({ buildings, onClose }: { buildings: Building[]; onClose: () => void }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('dsu_admin_token') ?? '')
  const [authenticated, setAuthenticated] = useState(false)
  const [resource, setResource] = useState<AdminResource>('buildings')
  const [records, setRecords] = useState<Array<Record<string, unknown>>>([])
  const [selectedId, setSelectedId] = useState('')
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')

  async function api(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers)
    headers.set('Content-Type', 'application/json')
    headers.set('Authorization', `Bearer ${token}`)
    const response = await fetch(apiUrl(path), { ...init, headers })
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { detail?: string }
      throw new Error(body.detail ?? `요청 실패 (${response.status})`)
    }
    return response.status === 204 ? null : response.json()
  }

  async function loadRecords(which: AdminResource = resource) {
    const result = (await api(`/api/admin/${which}`)) as Array<Record<string, unknown>>
    setRecords(result)
    setSelectedId('')
    setDraft('')
  }

  async function authenticate() {
    try {
      const response = await fetch(apiUrl('/api/admin/status'), { headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) throw new Error('인증에 실패했습니다. 토큰을 확인해 주세요.')
      sessionStorage.setItem('dsu_admin_token', token)
      setAuthenticated(true)
      setMessage('관리자 인증이 완료되었습니다.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'API 서버에 연결할 수 없습니다.')
    }
  }

  useEffect(() => {
    if (!authenticated) return
    loadRecords().catch((error) => setMessage(error instanceof Error ? error.message : '목록을 불러오지 못했습니다.'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, resource])

  function startNew() {
    const nextId = Math.max(0, ...buildings.map((building) => building.id)) + 1
    const templates: Record<AdminResource, Record<string, unknown>> = {
      buildings: { id: nextId, name: '', aliases: [], location: { type: 'Point', coordinates: [129.009, 35.145] }, elevation: null, video_url: null, floor_details: [] },
      facilities: { id: 'facility-new', building_id: buildings[0]?.id ?? 1, name: '', category: '편의시설', floor: 1, operating_info: null },
      'path-nodes': { id: 'node-new', building_id: buildings[0]?.id ?? 1, location: { type: 'Point', coordinates: [129.009, 35.145] }, elevation: null },
      'path-edges': { id: 'edge-new', from_node: '', to_node: '', distance_m: 1, slope_pct: null, is_step_free: false, bidirectional: true, accessible: true },
    }
    setSelectedId('')
    setDraft(JSON.stringify(templates[resource], null, 2))
    setMessage('새 자료를 입력하고 저장하세요.')
  }

  function selectRecord(id: string) {
    const record = records.find((item) => String(item.id) === id)
    setSelectedId(id)
    setDraft(record ? JSON.stringify(record, null, 2) : '')
    setMessage('')
  }

  async function save() {
    try {
      const document = JSON.parse(draft) as Record<string, unknown>
      const id = document.id
      if (typeof id !== 'string' && typeof id !== 'number') throw new Error('자료에 문자열 또는 숫자 id가 필요합니다.')
      await api(`/api/admin/${resource}/${encodeURIComponent(String(id))}`, { method: 'PUT', body: JSON.stringify(document) })
      await loadRecords()
      window.dispatchEvent(new Event('dsu:building-data-updated'))
      setMessage('저장했습니다.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '저장하지 못했습니다.')
    }
  }

  async function remove() {
    if (!selectedId || !window.confirm('선택한 자료를 삭제할까요?')) return
    try {
      await api(`/api/admin/${resource}/${encodeURIComponent(selectedId)}`, { method: 'DELETE' })
      await loadRecords()
      window.dispatchEvent(new Event('dsu:building-data-updated'))
      setMessage('삭제했습니다.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '삭제하지 못했습니다.')
    }
  }

  function logout() {
    sessionStorage.removeItem('dsu_admin_token')
    setToken('')
    setAuthenticated(false)
    setRecords([])
    setDraft('')
    setMessage('')
  }

  return (
    <section className="admin-panel">
      <div className="admin-heading">
        <div>
          <span className="section-kicker">DATA MANAGEMENT</span>
          <h2>관리자 데이터 관리</h2>
          <p>건물 · 시설 · 검증된 보행로 자료</p>
        </div>
        <button className="sheet-close" onClick={onClose} aria-label="닫기">
          <X size={17} />
        </button>
      </div>
      {!authenticated ? (
        <div className="admin-login">
          <label htmlFor="admin-token">관리자 API 토큰</label>
          <input
            id="admin-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="ADMIN_API_TOKEN"
            autoComplete="current-password"
          />
          <button className="route-submit" onClick={authenticate}>
            <LockKeyhole size={15} />
            인증
          </button>
          <small>토큰은 이 브라우저 탭의 세션 저장소에만 보관됩니다.</small>
        </div>
      ) : (
        <>
          <div className="admin-toolbar">
            <select value={resource} onChange={(event) => setResource(event.target.value as AdminResource)}>
              <option value="buildings">건물</option>
              <option value="facilities">시설</option>
              <option value="path-nodes">보행로 노드</option>
              <option value="path-edges">보행로 구간</option>
            </select>
            <button onClick={startNew}>새 자료</button>
            <button
              onClick={() =>
                loadRecords()
                  .then(() => setMessage('목록을 새로 불러왔습니다.'))
                  .catch((error) => setMessage(String(error)))
              }
            >
              새로고침
            </button>
          </div>
          <label className="admin-label" htmlFor="admin-record">
            등록 자료
          </label>
          <select id="admin-record" value={selectedId} onChange={(event) => selectRecord(event.target.value)}>
            <option value="">자료 선택</option>
            {records.map((record) => (
              <option key={String(record.id)} value={String(record.id)}>
                {String(record.name ?? record.id)}
                {record.building_id ? ` · 건물 ${record.building_id}` : ''}
              </option>
            ))}
          </select>
          <label className="admin-label" htmlFor="admin-json">
            자료 JSON
          </label>
          <textarea
            id="admin-json"
            spellCheck={false}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="새 자료 버튼을 누르거나 기존 자료를 선택하세요."
          />
          <div className="admin-actions">
            <button className="admin-save" onClick={save}>
              저장
            </button>
            <button className="admin-delete" onClick={remove} disabled={!selectedId}>
              삭제
            </button>
            <button className="admin-logout" onClick={logout}>
              로그아웃
            </button>
          </div>
          <p className="admin-tip">GeoJSON 좌표는 [경도, 위도] 순서입니다. 경로 구간은 실제 연결이 확인된 보행로만 등록하세요.</p>
        </>
      )}
      {message && (
        <div className="admin-message" role="status">
          {message}
        </div>
      )}
    </section>
  )
}

function RoutePanel({
  buildings,
  pathNodeCount,
  pathEdgeCount,
  userLocationLabel,
  fromId,
  toId,
  setFromId,
  setToId,
  stepFree,
  setStepFree,
  onCheck,
  onStartFollow,
  isFollowing2D,
  activeRoute,
  googleElevationProfile,
  googleElevationLoading,
  googleElevationMessage,
  onLoadGoogleElevation,
  message,
  language,
  t,
}: {
  buildings: Building[]
  pathNodeCount: number
  pathEdgeCount: number
  userLocationLabel: string
  fromId: number | 'current' | ''
  toId: number | ''
  setFromId: (id: number | 'current' | '') => void
  setToId: (id: number | '') => void
  stepFree: boolean
  setStepFree: (value: boolean) => void
  onCheck: () => void
  onStartFollow: () => void
  isFollowing2D: boolean
  activeRoute: ActiveRouteData | null
  googleElevationProfile: GoogleRouteElevationProfile | null
  googleElevationLoading: boolean
  googleElevationMessage: string
  onLoadGoogleElevation: () => void
  message: string
  language: Language
  t: UiCopy
}) {
  const tx = EXT_UI_COPY[language]
  return (
    <section className="route-panel">
      <div className="route-panel-heading">
        <span className="route-icon">
          <Navigation size={17} />
        </span>
        <div>
          <h2>{t.directions}</h2>
          <p>{t.routeMode}</p>
        </div>
      </div>
      <div className="route-form">
        <div className="route-field-row">
          <span className="route-marker start-marker" />
          <label className="sr-only" htmlFor="from-select">
            {t.from}
          </label>
          <select
            id="from-select"
            value={fromId}
            onChange={(event) =>
              setFromId(event.target.value === 'current' ? 'current' : event.target.value ? Number(event.target.value) : '')
            }
          >
            <option value="">{t.chooseFrom}</option>
            <option value="current">
              📍 {t.current} ({userLocationLabel})
            </option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                (#{building.campusNumber}) [{building.codePrefix}] {getLocalizedBuildingName(building, language)} ({tx.elevValue(Math.round(building.elevation ?? 100))})
              </option>
            ))}
          </select>
        </div>
        <div className="route-connector">
          <span />
        </div>
        <div className="route-field-row">
          <span className="route-marker end-marker" />
          <label className="sr-only" htmlFor="to-select">
            {t.to}
          </label>
          <select id="to-select" value={toId} onChange={(event) => setToId(event.target.value ? Number(event.target.value) : '')}>
            <option value="">{t.chooseTo}</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                (#{building.campusNumber}) [{building.codePrefix}] {getLocalizedBuildingName(building, language)} ({tx.elevValue(Math.round(building.elevation ?? 100))})
              </option>
            ))}
          </select>
          <span className="field-icon muted">
            <MapPin size={15} />
          </span>
        </div>
        <button
          className="swap-button"
          aria-label={`${t.from} / ${t.to} ${t.clear}`}
          disabled={fromId === 'current'}
          onClick={() => {
            if (fromId !== 'current') {
              setFromId(toId)
              setToId(fromId)
            }
          }}
        >
          <ArrowDownUp size={15} />
        </button>
      </div>
      <button className={stepFree ? 'stepfree-option checked' : 'stepfree-option'} onClick={() => setStepFree(!stepFree)}>
        <span className="check-box">{stepFree && <Check size={12} />}</span>
        <span>{t.stepFree}</span>
        <span className="option-tag">{t.noData}</span>
      </button>

      <div className="route-cta-stack">
        <button className="route-submit" onClick={onCheck}>
          <MapPin size={16} />
          {tx.showFullRouteBtn}
          <ArrowRight size={16} />
        </button>
        <button
          className={isFollowing2D ? 'route-submit fp3d-cta active' : 'route-submit fp3d-cta'}
          onClick={onStartFollow}
          aria-pressed={isFollowing2D}
        >
          <Navigation size={16} />
          {isFollowing2D ? tx.followStopBtn : tx.followStartBtn}
          <ArrowRight size={16} />
        </button>
      </div>

      {message && (
        <div className="route-alert">
          <Info size={17} />
          <span>{message}</span>
        </div>
      )}

      {activeRoute && (
        <div className="slope-segment-card">
          <div className="slope-card-head">
            <strong>
              <TrendingUp size={14} />{tx.slopeCardTitle}
            </strong>
            <span>{tx.slopeSegmentsCount(activeRoute.segments.length)}</span>
          </div>
          <div className="slope-segment-list">
            {activeRoute.segments.map((seg, idx) => {
              const info = classifySlope(seg.slope_pct, seg.is_step_free, language)
              return (
                <div className="slope-segment-item" key={`${seg.id}-${idx}`}>
                  <span className="slope-badge" style={{ background: info.roadColor }}>
                    {info.shortLabel}
                  </span>
                  <span className="slope-desc">
                    {tx.segmentMoveDesc(Math.round(seg.distance_m), Math.round(seg.from_elevation), Math.round(seg.to_elevation))}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {hasApiBackend && activeRoute && (
        <section className="google-elevation-card" aria-label={GOOGLE_ELEVATION_UI[language].title}>
          <div className="google-elevation-heading">
            <div>
              <strong><Mountain size={14} />{GOOGLE_ELEVATION_UI[language].title}</strong>
              <small>{GOOGLE_ELEVATION_UI[language].attribution}</small>
            </div>
            <button type="button" onClick={onLoadGoogleElevation} disabled={googleElevationLoading || !!googleElevationProfile}>
              {googleElevationLoading ? GOOGLE_ELEVATION_UI[language].loading : googleElevationProfile ? GOOGLE_ELEVATION_UI[language].done : GOOGLE_ELEVATION_UI[language].load}
            </button>
          </div>
          <p className="google-elevation-disclosure">{GOOGLE_ELEVATION_UI[language].disclosure}</p>
          {googleElevationProfile && (
            <>
              <div className="google-elevation-metrics">
                <span><small>{GOOGLE_ELEVATION_UI[language].ascent}</small><b>+{googleElevationProfile.total_uphill_m.toFixed(1)} m</b></span>
                <span><small>{GOOGLE_ELEVATION_UI[language].descent}</small><b>−{googleElevationProfile.total_downhill_m.toFixed(1)} m</b></span>
                <span>
                  <small>{GOOGLE_ELEVATION_UI[language].range}</small>
                  <b>
                    {Math.min(...googleElevationProfile.samples.map((sample) => sample.elevation_m)).toFixed(0)}–
                    {Math.max(...googleElevationProfile.samples.map((sample) => sample.elevation_m)).toFixed(0)} m
                  </b>
                </span>
              </div>
              <svg className="google-elevation-chart" viewBox="0 0 320 76" role="img" aria-label={`${GOOGLE_ELEVATION_UI[language].title}, ${googleElevationProfile.samples.length} samples`}>
                {(() => {
                  const values = googleElevationProfile.samples.map((sample) => sample.elevation_m)
                  const min = Math.min(...values)
                  const max = Math.max(...values)
                  const span = Math.max(4, max - min)
                  const points = values.map((value, index) => `${8 + (index / (values.length - 1)) * 304},${66 - ((value - min) / span) * 54}`).join(' ')
                  return <><polygon points={`8,68 ${points} 312,68`} /><polyline points={points} /></>
                })()}
              </svg>
            </>
          )}
          {googleElevationMessage && <p className="google-elevation-message" role="status">{googleElevationMessage}</p>}
        </section>
      )}

      <div className="route-note">
        <span className="note-symbol">i</span>
        <p>{t.minutes}</p>
      </div>
      <div className="route-availability">
        <div className="availability-heading">
          <span className="availability-icon">
            <MapPin size={15} />
          </span>
          <div>
            <strong>{t.registered}</strong>
            <small>
              {pathNodeCount} nodes · {pathEdgeCount} slope edges
            </small>
          </div>
        </div>
        <div className="availability-bar">
          <span style={{ width: pathEdgeCount > 0 ? '100%' : '0%', background: '#23784e' }} />
        </div>
        <div className="availability-foot">
          <span>
            {buildings.length} / {buildings.length} {t.buildings}
          </span>
          <span>{tx.slopeEdgesConnected(pathEdgeCount)}</span>
        </div>
      </div>
    </section>
  )
}

function safeYoutubeEmbed(url?: string) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (
      parsed.protocol !== 'https:' ||
      !['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'].includes(parsed.hostname) ||
      !parsed.pathname.startsWith('/embed/')
    )
      return null
    return parsed.toString()
  } catch {
    return null
  }
}

function BuildingSheet({
  building,
  facility,
  distanceFromUser,
  language,
  t,
  onClose,
  onDirections,
  onStartFollow,
}: {
  building: Building
  facility: FacilityMatch | null
  distanceFromUser: number
  language: Language
  t: UiCopy
  onClose: () => void
  onDirections: () => void
  onStartFollow: () => void
}) {
  const videoUrl = safeYoutubeEmbed(building.videoUrl)
  const floorDetails = useMemo(() => [...(building.floorDetails ?? [])].sort((a, b) => a.floor - b.floor), [building.floorDetails])
  const floorsWithPlans = useMemo(() => floorDetails.filter((fl) => Boolean(fl.floorPlanUrl)), [floorDetails])
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all')
  const [planFloor, setPlanFloor] = useState<number | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxZoom, setLightboxZoom] = useState<1 | 1.75 | 2.5>(1)
  const [roomFilter, setRoomFilter] = useState('')
  const [photoLoadError, setPhotoLoadError] = useState(false)

  useEffect(() => {
    if (facility?.floor !== undefined) {
      setSelectedFloor(facility.floor)
    } else {
      setSelectedFloor('all')
    }
    if (facility?.floor !== undefined && floorsWithPlans.some((fl) => fl.floor === facility.floor)) {
      setPlanFloor(facility.floor)
    } else if (floorsWithPlans.some((fl) => fl.floor === 1)) {
      setPlanFloor(1)
    } else {
      setPlanFloor(floorsWithPlans[0]?.floor ?? null)
    }
    setLightboxOpen(false)
    setLightboxZoom(1)
    setRoomFilter('')
  }, [building.id, facility, floorsWithPlans])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen])

  const activeFloorPlan = useMemo(
    () => floorsWithPlans.find((fl) => fl.floor === planFloor) ?? floorsWithPlans[0] ?? null,
    [floorsWithPlans, planFloor],
  )

  useEffect(() => setPhotoLoadError(false), [building.id, building.photoUrl])

  const tx = EXT_UI_COPY[language]
  const localBuildingName = getLocalizedBuildingName(building, language)
  const localBuildingDept = getLocalizedBuildingDept(building, language)
  const totalRoomsCount = useMemo(
    () => floorDetails.reduce((acc, fl) => acc + fl.facilities.length, 0),
    [floorDetails],
  )

  const filteredFloors = useMemo(() => {
    const term = normalize(roomFilter.trim())
    return floorDetails
      .filter((fl) => selectedFloor === 'all' || fl.floor === selectedFloor)
      .map((fl) => ({
        ...fl,
        facilities: term
          ? fl.facilities.filter((rm, idx) => {
              const loc = getLocalizedRoomTitleAndNote(rm, language, building, fl.floor, idx)
              return (
                normalize(rm.name).includes(term) ||
                normalize(loc.titleStr).includes(term) ||
                normalize(rm.code ?? '').includes(term) ||
                normalize(rm.category ?? '').includes(term) ||
                normalize(loc.categoryStr).includes(term) ||
                normalize(rm.note ?? '').includes(term) ||
                normalize(loc.noteStr).includes(term)
              )
            })
          : fl.facilities,
      }))
      .filter((fl) => fl.facilities.length > 0)
  }, [floorDetails, selectedFloor, roomFilter, language, building])

  const facilityDisplay = useMemo(() => {
    if (!facility) return null
    const fakeRoom: FloorRoomItem = {
      code: facility.code,
      name: facility.name,
      name_en: facility.name_en,
      name_zh: facility.name_zh,
      name_vi: facility.name_vi,
      name_lt: facility.name_lt,
      name_hi: facility.name_hi,
      category: facility.category,
      note: facility.note,
    }
    return getLocalizedRoomTitleAndNote(fakeRoom, language, building, facility.floor ?? 1, 0)
  }, [facility, language, building])

  const photoCredit = {
    ko: '사진 출처 · 동서대학교 캠퍼스맵',
    en: 'Photo source · Dongseo University campus map',
    zh: '照片來源 · 東西大學校園地圖',
    vi: 'Nguồn ảnh · Bản đồ Đại học Dongseo',
    lt: 'Nuotraukos šaltinis · Dongseo universiteto žemėlapis',
    hi: 'फ़ोटो स्रोत · डोंगसियो विश्वविद्यालय कैंपस मानचित्र',
  }[language]

  return (
    <aside className="building-sheet" aria-label={`${localBuildingName} ${t.details}`}>
      <div className="sheet-grabber" />
      <div className="sheet-top">
        <div className="sheet-breadcrumb">
          <span>{tx.campusNumBreadcrumb(building.campusNumber ?? building.id)}</span>
          <ArrowRight size={12} />
          <span>{tx.roomCodeBreadcrumb(building.codePrefix ?? '')}</span>
        </div>
        <button className="sheet-close" onClick={onClose} aria-label={t.close}>
          <X size={18} />
        </button>
      </div>
      <div className="sheet-title-row">
        <div
          className="sheet-building-icon red-num-icon"
          style={{ background: '#dc2626', border: `3px solid ${building.roofColor ?? '#24579e'}` }}
        >
          <strong>{building.campusNumber ?? building.id}</strong>
        </div>
        <div className="sheet-title">
          <span className="sheet-eyebrow">
            [{building.codePrefix}] {building.codeRange} · {tx.floorsScale(building.levels ?? 1)} · {tx.fromMyLocDist(distanceFromUser)}
          </span>
          <h2>{localBuildingName}</h2>
          {localBuildingDept && <p className="sheet-dept-summary">{localBuildingDept}</p>}
        </div>
      </div>
      <div className="sheet-coordinates">
        <span className="coord-label">
          <Mountain size={14} />
          {t.coordinates}
        </span>
        <span>
          {building.lat.toFixed(5)}° N <i>·</i> {building.lng.toFixed(5)}° E <i>·</i> {tx.elevValue(Math.round(building.elevation ?? 100))}
        </span>
      </div>

      {building.photoUrl && (
        <figure className={`building-photo-card${photoLoadError ? ' image-error' : ''}`}>
          {!photoLoadError ? (
            <img
              src={building.photoUrl}
              alt={localBuildingName}
              loading="lazy"
              decoding="async"
              onError={() => setPhotoLoadError(true)}
            />
          ) : (
            <div className="building-photo-fallback">
              <Building2 size={27} aria-hidden="true" />
              <span>{localBuildingName}</span>
            </div>
          )}
          <figcaption>
            <span>#{building.campusNumber ?? building.id} · {localBuildingName}</span>
            <a href={building.photoSourceUrl ?? officialCampusMapUrl} target="_blank" rel="noopener noreferrer">
              {photoCredit}
            </a>
          </figcaption>
        </figure>
      )}
      {facility && facilityDisplay && (
        <div className="facility-found">
          <span className="facility-found-icon">
            <DoorOpen size={15} />
          </span>
          <span>
            <strong>[{facilityDisplay.codeStr}] {facilityDisplay.titleStr}</strong>
            <small>
              {getLocalizedFloorLabel(facility.floorLabel ?? (facility.floor !== undefined ? `${facility.floor}F` : ''), language)} · {facilityDisplay.categoryStr || getLocalizedCategory(facility.category, language) || t.details}
              {facilityDisplay.noteStr ? ` · ${facilityDisplay.noteStr}` : ''}
            </small>
          </span>
        </div>
      )}
      <div className="sheet-video" onClick={onStartFollow} style={{ cursor: 'pointer' }} title={tx.startFollowCardTitle}>
        {videoUrl ? (
          <iframe
            className="video-embed"
            src={videoUrl}
            title={`${localBuildingName} ${t.video}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            <div className="video-scenery">
              <div className="video-sun" />
              <div className="video-block b1" />
              <div className="video-block b2" />
              <div className="video-path" />
              <span className="video-play">
                <span />
              </span>
            </div>
            <div className="video-copy">
              <span>{tx.startFollowCardTitle}</span>
              <small>{t.noVideo}</small>
            </div>
            <span className="video-chip">FOLLOW</span>
          </>
        )}
      </div>

      <div className="sheet-section-heading">
        <div>
          <span className="section-kicker">ROOM CODE DIRECTORY ({building.codeRange})</span>
          <h3>{t.floors}</h3>
        </div>
        <span className="no-data-pill">
          <span style={{ background: '#22c55e' }} />
          {tx.floorsAndRoomsCount(floorDetails.length, totalRoomsCount)}
        </span>
      </div>

      <div className="sheet-room-filter-bar">
        <div className="sheet-floor-tabs">
          <button
            className={selectedFloor === 'all' ? 'floor-tab active' : 'floor-tab'}
            onClick={() => setSelectedFloor('all')}
          >
            {tx.allFloorsTab(totalRoomsCount)}
          </button>
          {floorDetails.map((fl) => (
            <button
              key={fl.floor}
              className={selectedFloor === fl.floor ? 'floor-tab active' : 'floor-tab'}
              onClick={() => {
                setSelectedFloor(fl.floor)
                if (fl.floorPlanUrl) setPlanFloor(fl.floor)
              }}
            >
              {getLocalizedFloorLabel(fl.label, language)}
            </button>
          ))}
        </div>
        <div className="sheet-room-search">
          <Search size={13} />
          <input
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            placeholder={tx.roomSearchPlaceholder(building.codePrefix ?? 'RM')}
          />
          {roomFilter && (
            <button onClick={() => setRoomFilter('')} aria-label={t.clear}>
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {activeFloorPlan?.floorPlanUrl && (
        <section className="sheet-floorplan-card" aria-label={tx.floorPlanSectionTitle}>
          <div className="sheet-floorplan-head">
            <span className="sheet-floorplan-title">
              <Layers size={14} />
              <strong>{tx.floorPlanSectionTitle}</strong>
              <span className="floor-badge-pill">{getLocalizedFloorLabel(activeFloorPlan.label, language)}</span>
            </span>
            <button
              type="button"
              className="sheet-floorplan-expand-btn"
              onClick={() => {
                setLightboxZoom(1)
                setLightboxOpen(true)
              }}
            >
              <Maximize2 size={12} />
              <span>{tx.floorPlanTapToZoom}</span>
            </button>
          </div>
          <div className="sheet-floorplan-pills" role="tablist" aria-label={tx.floorPlanCountBadge(floorsWithPlans.length)}>
            {floorsWithPlans.map((fl) => {
              const active = fl.floor === activeFloorPlan.floor
              return (
                <button
                  key={`fp-pill-${fl.floor}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={active ? 'sheet-floorplan-pill active' : 'sheet-floorplan-pill'}
                  onClick={() => {
                    setPlanFloor(fl.floor)
                    setSelectedFloor(fl.floor)
                  }}
                >
                  {getLocalizedFloorLabel(fl.label, language)}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="sheet-floorplan-preview"
            onClick={() => {
              setLightboxZoom(1)
              setLightboxOpen(true)
            }}
            aria-label={`${localBuildingName} ${activeFloorPlan.label} ${tx.floorPlanTapToZoom}`}
          >
            <img
              src={activeFloorPlan.floorPlanUrl}
              alt={`${localBuildingName} ${getLocalizedFloorLabel(activeFloorPlan.label, language)}`}
              loading="lazy"
              decoding="async"
            />
            <span className="sheet-floorplan-zoom-pill">
              <Maximize2 size={11} />
              {tx.floorPlanTapToZoom}
            </span>
          </button>
          {activeFloorPlan.floorSummary && <p className="sheet-floorplan-summary">{activeFloorPlan.floorSummary}</p>}
        </section>
      )}

      {filteredFloors.length ? (
        <div className="floor-list">
          {filteredFloors.map((floor) => (
            <details className="floor-accordion" key={`${building.id}-${floor.floor}`} open>
              <summary>
                <span className="floor-badge-pill">{getLocalizedFloorLabel(floor.label, language)}</span>
                <span className="floor-number">
                  {tx.floorZoneLabel(building.codePrefix ?? '', floor.floor < 0 ? '001~' : `${floor.floor}01~`)}
                </span>
                {floor.floorPlanUrl && (
                  <button
                    type="button"
                    className="floor-plan-mini-btn"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setPlanFloor(floor.floor)
                      setSelectedFloor(floor.floor)
                      setLightboxZoom(1)
                      setLightboxOpen(true)
                    }}
                  >
                    {tx.floorPlanBadge}
                  </button>
                )}
                <span className="floor-count">{tx.roomsCountUnit(floor.facilities.length)}</span>
                <ChevronDown size={15} />
              </summary>
              <div className="floor-rooms">
                {floor.facilities.map((room, index) => {
                  const loc = getLocalizedRoomTitleAndNote(room, language, building, floor.floor, index)
                  const isHighlighted = facility?.name === room.name
                  return (
                    <div className={isHighlighted ? 'floor-room highlighted' : 'floor-room'} key={`${room.name}-${index}`}>
                      <div className="floor-room-top">
                        <span className="room-code-badge">{loc.codeStr}</span>
                        <span className="room-name">{loc.titleStr}</span>
                        {loc.categoryStr && <span className="room-category">{loc.categoryStr}</span>}
                      </div>
                      {loc.noteStr && <div className="room-note">{loc.noteStr}</div>}
                    </div>
                  )
                })}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="floor-placeholder">
          <span className="floor-icon">
            <Building2 size={17} />
          </span>
          <span>{tx.noRoomInFloor}</span>
        </div>
      )}
      <div className="detail-notice">
        <Info size={15} />
        <span>{t.infoBody}</span>
      </div>
      <div className="sheet-action-grid">
        <button className="sheet-directions" onClick={onDirections}>
          <MapPin size={16} />
          {tx.showFullRouteShort}
        </button>
        <button className="sheet-directions fp3d-btn" onClick={onStartFollow}>
          <Navigation size={16} />
          {tx.startFollowShort}
          <ArrowRight size={15} />
        </button>
      </div>
      {lightboxOpen &&
        activeFloorPlan?.floorPlanUrl &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="floorplan-lightbox-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={`${localBuildingName} ${getLocalizedFloorLabel(activeFloorPlan.label, language)} ${tx.floorPlanSectionTitle}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) setLightboxOpen(false)
            }}
          >
            <div className="floorplan-lightbox-dialog">
              <div className="floorplan-lightbox-header">
                <div className="floorplan-lightbox-title">
                  <span className="floor-badge-pill">{getLocalizedFloorLabel(activeFloorPlan.label, language)}</span>
                  <div>
                    <strong>{localBuildingName}</strong>
                    <small>{tx.floorPlanSectionTitle}</small>
                  </div>
                </div>
                <div className="floorplan-lightbox-actions">
                  {([1, 1.75, 2.5] as const).map((zoomVal) => (
                    <button
                      key={`fp-zoom-${zoomVal}`}
                      type="button"
                      className={lightboxZoom === zoomVal ? 'floorplan-zoom-btn active' : 'floorplan-zoom-btn'}
                      onClick={() => setLightboxZoom(zoomVal)}
                    >
                      {zoomVal}x
                    </button>
                  ))}
                  <button
                    type="button"
                    className="floorplan-close-btn"
                    onClick={() => setLightboxOpen(false)}
                    aria-label={tx.floorPlanClose}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="floorplan-lightbox-tabs">
                {floorsWithPlans.map((fl) => (
                  <button
                    key={`lb-fl-${fl.floor}`}
                    type="button"
                    className={fl.floor === activeFloorPlan.floor ? 'sheet-floorplan-pill active' : 'sheet-floorplan-pill'}
                    onClick={() => {
                      setPlanFloor(fl.floor)
                      setSelectedFloor(fl.floor)
                      setLightboxZoom(1)
                    }}
                  >
                    {getLocalizedFloorLabel(fl.label, language)}
                  </button>
                ))}
              </div>
              <div className="floorplan-lightbox-viewport">
                <img
                  src={activeFloorPlan.floorPlanUrl}
                  alt={`${localBuildingName} ${getLocalizedFloorLabel(activeFloorPlan.label, language)}`}
                  style={lightboxZoom === 1 ? undefined : { width: `${lightboxZoom * 100}%`, maxWidth: 'none' }}
                />
              </div>
              <div className="floorplan-lightbox-footer">
                {activeFloorPlan.floorSummary && <p className="sheet-floorplan-summary">{activeFloorPlan.floorSummary}</p>}
                <div className="floorplan-lightbox-chips">
                  {activeFloorPlan.facilities.map((rm, idx) => {
                    const loc = getLocalizedRoomTitleAndNote(rm, language, building, activeFloorPlan.floor, idx)
                    return (
                      <span className="floorplan-lightbox-chip" key={`lb-rm-${rm.code ?? idx}`}>
                        <b>{loc.codeStr}</b>
                        <span>{loc.titleStr}</span>
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </aside>
  )
}
