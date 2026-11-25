import { CAMPUS_CENTER } from './campusData'
import type { RouteSegment, RouteWaypoint } from './data'

export interface ActiveRoutePayload {
  startName: string
  destinationName: string
  distance_m: number
  estimated_minutes: number
  max_slope_pct: number
  uphill_distance_m: number
  downhill_distance_m: number
  step_free: boolean
  waypoints: RouteWaypoint[]
  segments: RouteSegment[]
}

export interface MockWaypoint {
  lat: number
  lng: number
  elevation: number
  label: string
}

export interface MockCoursePreset {
  id: string
  shortLabel: string
  startName: string
  destinationName: string
  waypoints: MockWaypoint[]
}

/**
 * Separated constants for GPS-free waypoint 3D navigation camera & dual-layer polyline styling.
 */
export const ROUTE_NAV_CONFIG = {
  /** 3D camera tilt angle from top-down zenith (56 deg creates a crisp 50°~60° street navigation view) */
  CAMERA_TILT_DEG: 56,
  /** Default camera follow distance in Three.js world meters behind the path target */
  CAMERA_FOLLOW_DISTANCE: 105,
  CAMERA_MIN_DISTANCE: 45,
  CAMERA_MAX_DISTANCE: 320,
  /** Look-ahead offset in meters in front of the user marker along path heading */
  CAMERA_LOOKAHEAD_OFFSET: 14,
  /** Exponential smoothing rates (higher = tighter response) */
  POSITION_SMOOTHING: 12.0,
  HEADING_SMOOTHING: 9.5,
  /** Look-ahead distance along the path to compute smooth corner-turning bearings */
  BEARING_LOOKAHEAD_M: 10.0,
  /** Playback & keyboard stepping speeds (meters/sec and meters/keypress) */
  BASE_MOVE_SPEED_MPS: 11.0,
  SPEED_MULTIPLIERS: [1, 2, 4] as const,
  KEYBOARD_STEP_M: 6.0,
  /** Naver-Map inspired high-contrast polyline & outer casing palette */
  MAIN_LINE_COLOR: '#03C75A',
  CASING_COLOR: '#FFFFFF',
  PASSED_LINE_COLOR: '#94A3B8',
  PASSED_CASING_COLOR: '#CBD5E1',
  /** 3D WebGL tube radii (meters) */
  TUBE_MAIN_RADIUS_3D: 1.35,
  TUBE_CASING_RADIUS_3D: 2.15,
  TUBE_PASSED_RADIUS_3D: 1.1,
  TUBE_PASSED_CASING_RADIUS_3D: 1.65,
  /** 2D Leaflet stroke weights (pixels) */
  LINE_MAIN_WEIGHT_2D: 8,
  LINE_CASING_WEIGHT_2D: 13,
  LINE_PASSED_WEIGHT_2D: 7,
  LINE_PASSED_CASING_WEIGHT_2D: 11,
} as const

/**
 * Multi-corner campus test courses (3~4 distinct turns each) using pure coordinate arrays.
 */
export const MOCK_WAYPOINT_COURSES: MockCoursePreset[] = [
  {
    id: 'course-1',
    shortLabel: '코스 1 (U-IT·산학)',
    startName: '스튜던트플라자',
    destinationName: '산학협력관',
    waypoints: [
      { lat: 35.14548, lng: 129.00782, elevation: 88, label: '스튜던트플라자 앞' },
      { lat: 35.14568, lng: 129.00738, elevation: 89, label: 'U-IT관 남측 코너' },
      { lat: 35.14605, lng: 129.00755, elevation: 94, label: 'U-IT관 북측 코너' },
      { lat: 35.14592, lng: 129.00852, elevation: 98, label: '뉴밀레니엄관 정면' },
      { lat: 35.14552, lng: 129.00938, elevation: 102, label: '민석도서관 삼거리' },
      { lat: 35.14512, lng: 129.00862, elevation: 108, label: '산학협력관 도착' },
    ],
  },
  {
    id: 'course-2',
    shortLabel: '코스 2 (디자인·미래관)',
    startName: 'U-IT관 앞마당',
    destinationName: '대학교회·미래관',
    waypoints: [
      { lat: 35.14568, lng: 129.00738, elevation: 89, label: 'U-IT관 앞마당' },
      { lat: 35.14536, lng: 129.00815, elevation: 96, label: '중앙삼거리 코너' },
      { lat: 35.14482, lng: 129.00834, elevation: 108, label: '디자인홀 경사로 코너' },
      { lat: 35.14455, lng: 129.00918, elevation: 118, label: '디자인홀 동측' },
      { lat: 35.14418, lng: 129.00962, elevation: 126, label: '대학교회·미래관 도착' },
    ],
  },
  {
    id: 'course-3',
    shortLabel: '코스 3 (운동장 전망로)',
    startName: '글로벌빌리지',
    destinationName: '대운동장 전망로',
    waypoints: [
      { lat: 35.14618, lng: 129.00695, elevation: 90, label: '글로벌빌리지 앞' },
      { lat: 35.14574, lng: 129.00772, elevation: 88, label: '학생회관 서측 코너' },
      { lat: 35.14588, lng: 129.00885, elevation: 97, label: '뉴밀레니엄관 남측' },
      { lat: 35.14535, lng: 129.00975, elevation: 106, label: '민석도서관 동측 코너' },
      { lat: 35.14472, lng: 129.01045, elevation: 116, label: '대운동장 전망로 도착' },
    ],
  },
]

const METERS_PER_DEG_LAT = 111_320
const METERS_PER_DEG_LNG = 111_320 * Math.cos((CAMPUS_CENTER[0] * Math.PI) / 180)

function haversineMetersLocal(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dx = (lng2 - lng1) * METERS_PER_DEG_LNG
  const dy = (lat2 - lat1) * METERS_PER_DEG_LAT
  return Math.hypot(dx, dy)
}

/**
 * Pure offline route builder from an arbitrary array of Waypoints (no Geolocation API).
 */
export function buildRouteFromWaypoints(
  waypoints: MockWaypoint[],
  startName: string,
  destinationName: string,
): ActiveRoutePayload {
  const segments: RouteSegment[] = []
  const routeWaypoints: RouteWaypoint[] = waypoints.map((wp, idx) => ({
    node_id: `wp-${idx}`,
    lat: wp.lat,
    lng: wp.lng,
    elevation: wp.elevation,
    building_id: null,
    label: wp.label,
  }))

  let totalDist = 0
  let uphill = 0
  let downhill = 0
  let maxSlope = 0

  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i]
    const b = waypoints[i + 1]
    const dist = Math.max(1, haversineMetersLocal(a.lat, a.lng, b.lat, b.lng))
    const dz = b.elevation - a.elevation
    const slopePct = (dz / dist) * 100
    totalDist += dist
    if (dz > 0) uphill += dist
    if (dz < 0) downhill += dist
    maxSlope = Math.max(maxSlope, Math.abs(slopePct))

    segments.push({
      id: `mock-seg-${i}`,
      from_node: `wp-${i}`,
      to_node: `wp-${i + 1}`,
      from_coord: [a.lat, a.lng],
      to_coord: [b.lat, b.lng],
      from_elevation: a.elevation,
      to_elevation: b.elevation,
      distance_m: Number(dist.toFixed(1)),
      slope_pct: Number(slopePct.toFixed(1)),
      is_step_free: true,
    })
  }

  return {
    startName,
    destinationName,
    distance_m: Math.round(totalDist),
    estimated_minutes: Math.max(1, Math.round(totalDist / 65)),
    max_slope_pct: Number(maxSlope.toFixed(1)),
    uphill_distance_m: Math.round(uphill),
    downhill_distance_m: Math.round(downhill),
    step_free: true,
    waypoints: routeWaypoints,
    segments,
  }
}
