import { useEffect, useMemo } from 'react'
import { Compass, CornerUpLeft, CornerUpRight, EyeOff, Flag, Navigation, Pause, Play, RotateCcw, X } from 'lucide-react'
import { CAMPUS_CENTER } from './campusData'
import type { Building, Language, RouteSegment, RouteWaypoint } from './data'
import { EXT_UI_COPY, getLocalizedBuildingName } from './i18nCatalog'
import { MOCK_WAYPOINT_COURSES, ROUTE_NAV_CONFIG } from './routeNavigationConfig'

export type ActiveRouteData = {
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

export type RouteSamplePoint = {
  distFromStart: number
  lat: number
  lng: number
  elevation: number
  slope_pct: number
  is_step_free: boolean
  headingDeg: number
  segmentIndex: number
  nearBuildingName: string
}

const METERS_PER_DEG_LAT = 111_320
const METERS_PER_DEG_LNG = 111_320 * Math.cos((CAMPUS_CENTER[0] * Math.PI) / 180)

function toMetersXY(lat: number, lng: number): [number, number] {
  return [(lng - CAMPUS_CENTER[1]) * METERS_PER_DEG_LNG, (lat - CAMPUS_CENTER[0]) * METERS_PER_DEG_LAT]
}

export function classifySlope(slopePct: number, isStepFree: boolean, language: Language = 'ko') {
  const tx = EXT_UI_COPY[language]
  if (!isStepFree) {
    return { label: tx.slopeStairsLabel, shortLabel: tx.slopeStairsShort, color: '#9333ea', roadColor: '#a855f7', level: 'stairs' as const }
  }
  if (slopePct >= 8.0) {
    const pct = slopePct.toFixed(1)
    return { label: tx.slopeSteepUpLabel(pct), shortLabel: tx.slopeSteepUpShort(pct), color: '#dc2626', roadColor: '#ef4444', level: 'steep-up' as const }
  }
  if (slopePct >= 3.0) {
    const pct = slopePct.toFixed(1)
    return { label: tx.slopeGentleUpLabel(pct), shortLabel: tx.slopeGentleUpShort(pct), color: '#d97706', roadColor: '#f59e0b', level: 'gentle-up' as const }
  }
  if (slopePct <= -8.0) {
    const pct = slopePct.toFixed(1)
    return { label: tx.slopeSteepDownLabel(pct), shortLabel: tx.slopeSteepDownShort(pct), color: '#1d4ed8', roadColor: '#2563eb', level: 'steep-down' as const }
  }
  if (slopePct <= -3.0) {
    const pct = slopePct.toFixed(1)
    return { label: tx.slopeGentleDownLabel(pct), shortLabel: tx.slopeGentleDownShort(pct), color: '#0284c7', roadColor: '#38bdf8', level: 'gentle-down' as const }
  }
  const signedPct = `${slopePct >= 0 ? '+' : ''}${slopePct.toFixed(1)}`
  return { label: tx.slopeFlatLabel(signedPct), shortLabel: tx.slopeFlatShort(slopePct.toFixed(1)), color: '#15803d', roadColor: '#22c55e', level: 'flat' as const }
}

export function buildRouteSamples(route: ActiveRouteData, buildings: Building[], language: Language = 'ko') {
  const pts: RouteSamplePoint[] = []
  let accDist = 0
  const tx = EXT_UI_COPY[language]

  const findNearestBuildingName = (lat: number, lng: number) => {
    let bestName = tx.campusWalkway
    let bestD = Infinity
    const [px, py] = toMetersXY(lat, lng)
    for (const b of buildings) {
      const [bx, by] = toMetersXY(b.lat, b.lng)
      const d = Math.hypot(bx - px, by - py)
      if (d < bestD) {
        bestD = d
        bestName = getLocalizedBuildingName(b, language)
      }
    }
    return bestD < 95 ? bestName : tx.campusWalkway
  }

  if (!route.segments.length) {
    pts.push({
      distFromStart: 0,
      lat: CAMPUS_CENTER[0],
      lng: CAMPUS_CENTER[1],
      elevation: 100,
      slope_pct: 0,
      is_step_free: true,
      headingDeg: 0,
      segmentIndex: 0,
      nearBuildingName: tx.campusWalkway,
    })
    return { samples: pts, totalDistance: 1 }
  }

  route.segments.forEach((seg, segIdx) => {
    const [x1, y1] = toMetersXY(seg.from_coord[0], seg.from_coord[1])
    const [x2, y2] = toMetersXY(seg.to_coord[0], seg.to_coord[1])
    const segLen = Math.max(1, seg.distance_m)
    const bearingDeg = ((Math.atan2(x2 - x1, y2 - y1) * 180) / Math.PI + 360) % 360
    const steps = Math.max(2, Math.ceil(segLen / 1.5))
    const nearName = findNearestBuildingName(
      (seg.from_coord[0] + seg.to_coord[0]) / 2,
      (seg.from_coord[1] + seg.to_coord[1]) / 2,
    )

    for (let i = 0; i < steps; i++) {
      const t = i / steps
      pts.push({
        distFromStart: accDist + segLen * t,
        lat: seg.from_coord[0] + (seg.to_coord[0] - seg.from_coord[0]) * t,
        lng: seg.from_coord[1] + (seg.to_coord[1] - seg.from_coord[1]) * t,
        elevation: seg.from_elevation + (seg.to_elevation - seg.from_elevation) * t,
        slope_pct: seg.slope_pct,
        is_step_free: seg.is_step_free,
        headingDeg: bearingDeg,
        segmentIndex: segIdx,
        nearBuildingName: nearName,
      })
    }
    accDist += segLen
  })

  const lastSeg = route.segments[route.segments.length - 1]
  const [x1, y1] = toMetersXY(lastSeg.from_coord[0], lastSeg.from_coord[1])
  const [x2, y2] = toMetersXY(lastSeg.to_coord[0], lastSeg.to_coord[1])
  const lastBearing = ((Math.atan2(x2 - x1, y2 - y1) * 180) / Math.PI + 360) % 360
  pts.push({
    distFromStart: accDist,
    lat: lastSeg.to_coord[0],
    lng: lastSeg.to_coord[1],
    elevation: lastSeg.to_elevation,
    slope_pct: lastSeg.slope_pct,
    is_step_free: lastSeg.is_step_free,
    headingDeg: lastBearing,
    segmentIndex: route.segments.length - 1,
    nearBuildingName: route.destinationName,
  })

  return { samples: pts, totalDistance: Math.max(1, accDist) }
}

function samplePositionAtDist(samples: RouteSamplePoint[], targetDist: number): { lat: number; lng: number; sampleIdx: number } {
  if (samples.length === 1) return { lat: samples[0].lat, lng: samples[0].lng, sampleIdx: 0 }
  const clamped = Math.max(samples[0].distFromStart, Math.min(samples[samples.length - 1].distFromStart, targetDist))
  let idx = 0
  while (idx < samples.length - 2 && samples[idx + 1].distFromStart < clamped) {
    idx++
  }
  const a = samples[idx]
  const b = samples[idx + 1]
  const span = Math.max(0.001, b.distFromStart - a.distFromStart)
  const t = Math.max(0, Math.min(1, (clamped - a.distFromStart) / span))
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
    sampleIdx: idx,
  }
}

export function interpolateSampleAtDistance(samples: RouteSamplePoint[], totalDistance: number, targetDist: number): RouteSamplePoint {
  if (samples.length === 1) return samples[0]
  const clamped = Math.max(0, Math.min(totalDistance, targetDist))
  const cur = samplePositionAtDist(samples, clamped)
  const a = samples[cur.sampleIdx]
  const b = samples[cur.sampleIdx + 1]
  const span = Math.max(0.001, b.distFromStart - a.distFromStart)
  const t = Math.max(0, Math.min(1, (clamped - a.distFromStart) / span))

  const ahead = samplePositionAtDist(samples, Math.min(totalDistance, clamped + ROUTE_NAV_CONFIG.BEARING_LOOKAHEAD_M))
  const [ax, ay] = toMetersXY(cur.lat, cur.lng)
  const [lx, ly] = toMetersXY(ahead.lat, ahead.lng)
  const smoothHeading =
    Math.hypot(lx - ax, ly - ay) > 0.35
      ? ((Math.atan2(lx - ax, ly - ay) * 180) / Math.PI + 360) % 360
      : a.headingDeg

  return {
    distFromStart: clamped,
    lat: cur.lat,
    lng: cur.lng,
    elevation: a.elevation + (b.elevation - a.elevation) * t,
    slope_pct: a.slope_pct,
    is_step_free: a.is_step_free,
    headingDeg: smoothHeading,
    segmentIndex: a.segmentIndex,
    nearBuildingName: a.nearBuildingName,
  }
}

export default function Naver2DRouteFollower({
  route,
  samples,
  totalDistance,
  currentSample,
  progressDist,
  setProgressDist,
  isPlaying,
  setIsPlaying,
  speedMultiplier = 1,
  setSpeedMultiplier,
  headingUpMode,
  setHeadingUpMode,
  onRecenterCamera,
  selectedMockCourseId,
  onSelectMockCourse,
  mapViewMode,
  onToggleMapViewMode,
  navHudEnabled,
  onToggleNavHud,
  onCloseFollow,
  language = 'ko',
}: {
  route: ActiveRouteData
  samples: RouteSamplePoint[]
  totalDistance: number
  currentSample: RouteSamplePoint
  progressDist: number
  setProgressDist: React.Dispatch<React.SetStateAction<number>>
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  speedMultiplier?: 1 | 2 | 4
  setSpeedMultiplier?: React.Dispatch<React.SetStateAction<1 | 2 | 4>>
  headingUpMode: boolean
  setHeadingUpMode: React.Dispatch<React.SetStateAction<boolean>>
  onRecenterCamera?: () => void
  selectedMockCourseId?: string
  onSelectMockCourse?: (courseId: string) => void
  mapViewMode?: '2d' | '3d'
  onToggleMapViewMode?: () => void
  navHudEnabled: boolean
  onToggleNavHud: () => void
  onCloseFollow: () => void
  language?: Language
}) {
  const tx = EXT_UI_COPY[language]

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        setIsPlaying(false)
        setProgressDist((d) => Math.min(totalDistance, d + ROUTE_NAV_CONFIG.KEYBOARD_STEP_M))
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        setIsPlaying(false)
        setProgressDist((d) => Math.max(0, d - ROUTE_NAV_CONFIG.KEYBOARD_STEP_M))
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying((p) => !p)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [totalDistance, setIsPlaying, setProgressDist])

  const currentSlopeInfo = classifySlope(currentSample.slope_pct, currentSample.is_step_free, language)
  const remainingDist = Math.max(0, Math.round(totalDistance - currentSample.distFromStart))
  const progressPct = Math.min(100, Math.round((currentSample.distFromStart / totalDistance) * 100))
  const remainingMin = Math.max(1, Math.ceil((remainingDist / Math.max(1, totalDistance)) * route.estimated_minutes))

  const turnGuidance = useMemo(() => {
    if (remainingDist <= 4) {
      return {
        type: 'arrived' as const,
        title: tx.arrivedTitle(route.destinationName),
      }
    }
    const aheadDist = Math.min(totalDistance, currentSample.distFromStart + 18)
    const aheadSample = samples.find((s) => s.distFromStart >= aheadDist) ?? samples[samples.length - 1]
    let diff = aheadSample.headingDeg - currentSample.headingDeg
    while (diff > 180) diff -= 360
    while (diff < -180) diff += 360

    const distToTurn = Math.max(5, Math.round(aheadSample.distFromStart - currentSample.distFromStart))

    if (diff > 24) {
      return {
        type: 'right' as const,
        title: tx.turnRightTitle(distToTurn),
      }
    }
    if (diff < -24) {
      return {
        type: 'left' as const,
        title: tx.turnLeftTitle(distToTurn),
      }
    }
    return {
      type: 'straight' as const,
      title: tx.straightTitle(remainingDist, currentSample.nearBuildingName),
    }
  }, [currentSample, samples, remainingDist, totalDistance, route.destinationName, tx])

  const togglePlayback = () => {
    if (progressDist >= totalDistance - 1) setProgressDist(0)
    setIsPlaying(!isPlaying)
  }

  if (!navHudEnabled) {
    return (
      <div className="naver2d-collapsed-bar" role="region" aria-label={tx.followMyViewBtn}>
        <button
          type="button"
          className="naver2d-collapsed-on-btn"
          onClick={onToggleNavHud}
          aria-pressed={false}
        >
          <Navigation size={13} />
          <span>{tx.navToggleOn}</span>
        </button>
        <button
          type="button"
          className="naver2d-collapsed-icon-btn"
          onClick={togglePlayback}
          aria-label={isPlaying ? tx.pauseBtn : tx.playBtn}
          title={isPlaying ? tx.pauseBtn : progressDist >= totalDistance - 1 ? tx.replayBtn : tx.playBtn}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <button
          type="button"
          className="naver2d-collapsed-icon-btn exit"
          onClick={onCloseFollow}
          aria-label={tx.exitFollowBtn}
          title={tx.exitFollowBtn}
        >
          <X size={13} />
        </button>
      </div>
    )
  }

  return (
    <div className="naver2d-top-hud" role="region" aria-label={tx.followMyViewBtn}>
      <div className="naver2d-turn-card">
        <div className="naver2d-compact-top">
          <div className="naver2d-turn-icon">
            {turnGuidance.type === 'arrived' ? (
              <Flag size={18} />
            ) : turnGuidance.type === 'left' ? (
              <CornerUpLeft size={19} />
            ) : turnGuidance.type === 'right' ? (
              <CornerUpRight size={19} />
            ) : (
              <Navigation size={18} />
            )}
          </div>
          <div className="naver2d-turn-body">
            <strong>{turnGuidance.title}</strong>
            <div className="naver2d-route-meta">
              <span className="naver2d-remain-pill">{tx.remainMeta(remainingDist, remainingMin, progressPct)}</span>
              <span className="naver2d-slope-tag" style={{ background: currentSlopeInfo.color }}>
                {currentSlopeInfo.shortLabel}
              </span>
            </div>
          </div>
          <div className="naver2d-top-actions">
            <button
              type="button"
              className="naver2d-mini-btn nav-off"
              onClick={onToggleNavHud}
              aria-pressed={true}
              aria-label={tx.navToggleOff}
              title={tx.navToggleOff}
            >
              <EyeOff size={13} />
            </button>
            <button
              type="button"
              className="naver2d-mini-btn exit"
              onClick={onCloseFollow}
              aria-label={tx.exitFollowBtn}
              title={tx.exitFollowBtn}
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="naver2d-inline-controls">
          <button
            type="button"
            className="naver2d-inline-play"
            onClick={togglePlayback}
            aria-label={isPlaying ? tx.pauseBtn : tx.playBtn}
            title={isPlaying ? tx.pauseBtn : progressDist >= totalDistance - 1 ? tx.replayBtn : tx.playBtn}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <input
            type="range"
            className="naver2d-inline-scrubber"
            min={0}
            max={Math.round(totalDistance)}
            value={Math.round(currentSample.distFromStart)}
            onChange={(e) => {
              setIsPlaying(false)
              setProgressDist(Number(e.target.value))
            }}
            aria-label={tx.playBtn}
          />
          {setSpeedMultiplier && (
            <button
              type="button"
              className="naver2d-mini-btn naver2d-speed-btn"
              onClick={() => {
                const speeds = ROUTE_NAV_CONFIG.SPEED_MULTIPLIERS
                const next = speeds[(speeds.indexOf(speedMultiplier) + 1) % speeds.length]
                setSpeedMultiplier(next)
              }}
              title="이동 속도 배율"
            >
              {speedMultiplier}x
            </button>
          )}
          <button
            type="button"
            className={headingUpMode ? 'naver2d-mini-btn active' : 'naver2d-mini-btn'}
            onClick={() => {
              if (!headingUpMode && onRecenterCamera) {
                onRecenterCamera()
              } else {
                setHeadingUpMode(!headingUpMode)
              }
            }}
            aria-label={headingUpMode ? tx.cameraLockOn : tx.cameraLockOff}
            title={headingUpMode ? tx.cameraLockOn : tx.cameraLockOff}
          >
            <Compass size={13} />
          </button>
          {!headingUpMode && onRecenterCamera && (
            <button
              type="button"
              className="naver2d-mini-btn recenter"
              onClick={onRecenterCamera}
            >
              <RotateCcw size={12} />
              <span>시점 복귀</span>
            </button>
          )}
          {onToggleMapViewMode && (
            <button
              type="button"
              className="naver2d-mini-btn mode"
              onClick={onToggleMapViewMode}
              title={mapViewMode === '3d' ? tx.switchTo2DBtn : tx.switchTo3DBtn}
            >
              {mapViewMode === '3d' ? '2D' : '3D'}
            </button>
          )}
        </div>
        {onSelectMockCourse && (
          <div className="naver2d-course-pills" role="group" aria-label="샘플 웨이포인트 경로">
            {MOCK_WAYPOINT_COURSES.map((course) => (
              <button
                key={course.id}
                type="button"
                className={selectedMockCourseId === course.id ? 'naver2d-course-pill active' : 'naver2d-course-pill'}
                onClick={() => onSelectMockCourse(course.id)}
              >
                {course.shortLabel}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
