import { useEffect, useMemo } from 'react'
import { Compass, CornerUpLeft, CornerUpRight, FastForward, Flag, MapPin, Mountain, Navigation, Pause, Play, RotateCcw, SkipBack, SkipForward, Sparkles, X } from 'lucide-react'
import { CAMPUS_CENTER } from './campusData'
import type { Building, Language, RouteSegment, RouteWaypoint } from './data'
import { EXT_UI_COPY, getLocalizedBuildingName } from './i18nCatalog'

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

export function interpolateSampleAtDistance(samples: RouteSamplePoint[], totalDistance: number, targetDist: number): RouteSamplePoint {
  if (samples.length === 1) return samples[0]
  const clamped = Math.max(0, Math.min(totalDistance, targetDist))
  let idx = 0
  while (idx < samples.length - 2 && samples[idx + 1].distFromStart < clamped) {
    idx++
  }
  const a = samples[idx]
  const b = samples[idx + 1]
  const span = Math.max(0.001, b.distFromStart - a.distFromStart)
  const t = Math.max(0, Math.min(1, (clamped - a.distFromStart) / span))

  const lookIdx = Math.min(samples.length - 1, idx + 3)
  const [ax, ay] = toMetersXY(a.lat, a.lng)
  const [lx, ly] = toMetersXY(samples[lookIdx].lat, samples[lookIdx].lng)
  const smoothHeading =
    Math.hypot(lx - ax, ly - ay) > 0.5
      ? ((Math.atan2(lx - ax, ly - ay) * 180) / Math.PI + 360) % 360
      : a.headingDeg

  return {
    distFromStart: clamped,
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
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
  speedMultiplier,
  setSpeedMultiplier,
  headingUpMode,
  setHeadingUpMode,
  mapViewMode,
  onToggleMapViewMode,
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
  speedMultiplier: 1 | 2 | 4
  setSpeedMultiplier: React.Dispatch<React.SetStateAction<1 | 2 | 4>>
  headingUpMode: boolean
  setHeadingUpMode: React.Dispatch<React.SetStateAction<boolean>>
  mapViewMode?: '2d' | '3d'
  onToggleMapViewMode?: () => void
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
        setProgressDist((d) => Math.min(totalDistance, d + 6))
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        setIsPlaying(false)
        setProgressDist((d) => Math.max(0, d - 6))
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
        subtitle: tx.arrivedSub,
      }
    }
    const aheadDist = Math.min(totalDistance, currentSample.distFromStart + 18)
    const aheadSample = samples.find((s) => s.distFromStart >= aheadDist) ?? samples[samples.length - 1]
    let diff = aheadSample.headingDeg - currentSample.headingDeg
    while (diff > 180) diff -= 360
    while (diff < -180) diff += 360

    const distToTurn = Math.max(5, Math.round(aheadSample.distFromStart - currentSample.distFromStart))
    const slopeDesc =
      currentSample.slope_pct >= 6
        ? tx.slopeUpWay
        : currentSample.slope_pct <= -6
          ? tx.slopeDownWay
          : tx.slopeFlatWay

    if (diff > 24) {
      return {
        type: 'right' as const,
        title: tx.turnRightTitle(distToTurn),
        subtitle: tx.turnSub(currentSample.nearBuildingName, aheadSample.nearBuildingName, slopeDesc),
      }
    }
    if (diff < -24) {
      return {
        type: 'left' as const,
        title: tx.turnLeftTitle(distToTurn),
        subtitle: tx.turnSub(currentSample.nearBuildingName, aheadSample.nearBuildingName, slopeDesc),
      }
    }
    return {
      type: 'straight' as const,
      title: tx.straightTitle(remainingDist, currentSample.nearBuildingName),
      subtitle: tx.straightSub(route.destinationName, slopeDesc),
    }
  }, [currentSample, samples, remainingDist, totalDistance, route.destinationName, tx])

  return (
    <>
      {/* Naver Map Style Top Turn-by-Turn Guidance HUD */}
      <div className="naver2d-top-hud" role="region" aria-label={tx.followMyViewBtn}>
        <div className="naver2d-turn-card">
          <div className="naver2d-turn-icon">
            {turnGuidance.type === 'arrived' ? (
              <Flag size={24} />
            ) : turnGuidance.type === 'left' ? (
              <CornerUpLeft size={26} />
            ) : turnGuidance.type === 'right' ? (
              <CornerUpRight size={26} />
            ) : (
              <Navigation size={24} />
            )}
          </div>
          <div className="naver2d-turn-body">
            <div className="naver2d-route-meta">
              <span>{route.startName} → {route.destinationName}</span>
              <span className="naver2d-remain-pill">{tx.remainMeta(remainingDist, remainingMin, progressPct)}</span>
            </div>
            <strong>{turnGuidance.title}</strong>
            <p>{turnGuidance.subtitle}</p>
            <div className="naver2d-badges">
              <span className="naver2d-badge"><MapPin size={12} />{tx.currentPosBadge(currentSample.nearBuildingName)}</span>
              <span className="naver2d-badge"><Mountain size={12} />{tx.elevValue(Number(currentSample.elevation.toFixed(1)))}</span>
              <span className="naver2d-badge" style={{ background: currentSlopeInfo.color, color: '#fff' }}>
                {currentSlopeInfo.label}
              </span>
            </div>
          </div>
          <div className="naver2d-top-controls">
            {onToggleMapViewMode && (
              <button
                className="naver2d-compass-btn active"
                style={{ background: mapViewMode === '3d' ? '#dc2626' : '#1d573f' }}
                onClick={onToggleMapViewMode}
              >
                <span>{mapViewMode === '3d' ? tx.switchTo2DBtn : tx.switchTo3DBtn}</span>
              </button>
            )}
            <button
              className={headingUpMode ? 'naver2d-compass-btn active' : 'naver2d-compass-btn'}
              onClick={() => setHeadingUpMode(!headingUpMode)}
            >
              <Compass size={15} />
              <span>{headingUpMode ? tx.cameraLockOn : tx.cameraLockOff}</span>
            </button>
            <button className="naver2d-exit-btn" onClick={onCloseFollow}>
              <X size={15} />
              <span>{tx.exitFollowBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Path-Following & Slope Profile Bar */}
      <div className="naver2d-bottom-dock" role="region" aria-label={tx.slopeProfileTitle}>
        <div className="naver2d-slope-header">
          <span className="naver2d-slope-title">
            <Sparkles size={13} />{tx.slopeProfileTitle}
          </span>
          <span className="naver2d-slope-legend">
            <i><b style={{ background: '#22c55e' }} />{tx.legendFlat}</i>
            <i><b style={{ background: '#f59e0b' }} />{tx.legendGentle}</i>
            <i><b style={{ background: '#ef4444' }} />{tx.legendSteepUp}</i>
            <i><b style={{ background: '#38bdf8' }} />{tx.legendDown}</i>
          </span>
        </div>

        <svg
          className="naver2d-elevation-svg"
          viewBox="0 0 600 54"
          preserveAspectRatio="none"
          onClick={(e) => {
            const box = e.currentTarget.getBoundingClientRect()
            const ratio = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width))
            setIsPlaying(false)
            setProgressDist(ratio * totalDistance)
          }}
        >
          {(() => {
            const minE = Math.min(...samples.map((s) => s.elevation)) - 4
            const maxE = Math.max(...samples.map((s) => s.elevation)) + 4
            const spanE = Math.max(10, maxE - minE)
            const toX = (d: number) => (d / totalDistance) * 580 + 10
            const toY = (el: number) => 46 - ((el - minE) / spanE) * 36

            return (
              <>
                {samples.slice(0, -1).map((s, idx) => {
                  const nxt = samples[idx + 1]
                  const x1 = toX(s.distFromStart)
                  const x2 = toX(nxt.distFromStart)
                  const y1 = toY(s.elevation)
                  const y2 = toY(nxt.elevation)
                  const info = classifySlope(s.slope_pct, s.is_step_free, language)
                  return (
                    <g key={idx}>
                      <polygon
                        points={`${x1},48 ${x1},${y1} ${x2},${y2} ${x2},48`}
                        fill={info.roadColor}
                        fillOpacity={0.3}
                      />
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={info.roadColor} strokeWidth={2.6} />
                    </g>
                  )
                })}
                {(() => {
                  const cx = toX(currentSample.distFromStart)
                  const cy = toY(currentSample.elevation)
                  return (
                    <g>
                      <line x1={cx} y1={3} x2={cx} y2={50} stroke="#1d4ed8" strokeWidth={1.8} strokeDasharray="3 2" />
                      <circle cx={cx} cy={cy} r={5} fill="#2563eb" stroke="#ffffff" strokeWidth={2} />
                    </g>
                  )
                })()}
              </>
            )
          })()}
        </svg>

        <div className="naver2d-controls-row">
          <button
            className="naver2d-play-btn"
            onClick={() => {
              if (progressDist >= totalDistance - 1) setProgressDist(0)
              setIsPlaying(!isPlaying)
            }}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            <span>{isPlaying ? tx.pauseBtn : progressDist >= totalDistance - 1 ? tx.replayBtn : tx.playBtn}</span>
          </button>

          <button
            className="naver2d-step-btn"
            onClick={() => {
              setIsPlaying(false)
              setProgressDist((d) => Math.max(0, d - 20))
            }}
          >
            <SkipBack size={14} />{tx.prevSegBtn}
          </button>

          <input
            type="range"
            className="naver2d-scrubber"
            min={0}
            max={Math.round(totalDistance)}
            value={Math.round(currentSample.distFromStart)}
            onChange={(e) => {
              setIsPlaying(false)
              setProgressDist(Number(e.target.value))
            }}
            aria-label={tx.playBtn}
          />

          <button
            className="naver2d-step-btn"
            onClick={() => {
              setIsPlaying(false)
              setProgressDist((d) => Math.min(totalDistance, d + 20))
            }}
          >
            {tx.nextSegBtn}<SkipForward size={14} />
          </button>

          <button
            className="naver2d-step-btn"
            onClick={() => setSpeedMultiplier((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
          >
            <FastForward size={13} />{tx.speedBtn(speedMultiplier)}
          </button>

          <button
            className="naver2d-step-btn"
            onClick={() => {
              setIsPlaying(false)
              setProgressDist(0)
            }}
            title={tx.originResetBtn}
          >
            <RotateCcw size={13} />{tx.originResetBtn}
          </button>
        </div>
      </div>
    </>
  )
}
