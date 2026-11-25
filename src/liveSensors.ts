export interface CachedGpsFix {
  lat: number
  lng: number
  headingDeg?: number
  timestamp: number
}

const GPS_CACHE_KEY = 'dsu_campus_last_gps_v1'
const GPS_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000
const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

export function normalizeHeadingDeg(deg: number): number {
  const n = deg % 360
  return n < 0 ? n + 360 : n
}

export function shortestAngleDeltaDeg(fromDeg: number, toDeg: number): number {
  let delta = normalizeHeadingDeg(toDeg) - normalizeHeadingDeg(fromDeg)
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return delta
}

export function stepAngleDeg(currentDeg: number, targetDeg: number, factor: number): number {
  return normalizeHeadingDeg(currentDeg + shortestAngleDeltaDeg(currentDeg, targetDeg) * factor)
}

export function loadCachedGpsFix(): CachedGpsFix | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(GPS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CachedGpsFix>
    if (
      typeof parsed.lat !== 'number' ||
      !Number.isFinite(parsed.lat) ||
      typeof parsed.lng !== 'number' ||
      !Number.isFinite(parsed.lng) ||
      typeof parsed.timestamp !== 'number' ||
      !Number.isFinite(parsed.timestamp)
    ) {
      return null
    }
    if (Date.now() - parsed.timestamp > GPS_CACHE_MAX_AGE_MS) {
      return null
    }
    const headingDeg =
      typeof parsed.headingDeg === 'number' && Number.isFinite(parsed.headingDeg)
        ? normalizeHeadingDeg(parsed.headingDeg)
        : undefined
    return {
      lat: parsed.lat,
      lng: parsed.lng,
      headingDeg,
      timestamp: parsed.timestamp,
    }
  } catch {
    return null
  }
}

export function saveCachedGpsFix(lat: number, lng: number, headingDeg?: number): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
    const payload: CachedGpsFix = {
      lat,
      lng,
      timestamp: Date.now(),
    }
    if (typeof headingDeg === 'number' && Number.isFinite(headingDeg)) {
      payload.headingDeg = normalizeHeadingDeg(headingDeg)
    }
    window.localStorage.setItem(GPS_CACHE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage quota or private-mode failures
  }
}

export function getScreenOrientationAngle(): number {
  if (typeof window === 'undefined') return 0
  const screenAngle = window.screen?.orientation?.angle
  if (typeof screenAngle === 'number' && Number.isFinite(screenAngle)) {
    return screenAngle
  }
  const legacyOrientation = (window as Window & { orientation?: number }).orientation
  if (typeof legacyOrientation === 'number' && Number.isFinite(legacyOrientation)) {
    return legacyOrientation
  }
  return 0
}

export interface CompassReading {
  headingDeg: number
  isAbsolute: boolean
}

export interface CompassEventLike {
  alpha: number | null
  beta: number | null
  gamma: number | null
  absolute?: boolean
  webkitCompassHeading?: number | null
  webkitCompassAccuracy?: number | null
}

/**
 * Extracts clockwise compass azimuth (0 = North, 90 = East, 180 = South, 270 = West)
 * smoothly across flat (`beta ~ 0`), tilted (`beta ~ 45`), and upright (`beta ~ 90`) phone holds.
 */
export function extractCompassHeading(
  ev: CompassEventLike,
  screenAngleDeg = getScreenOrientationAngle(),
): CompassReading | null {
  if (typeof ev.webkitCompassHeading === 'number' && Number.isFinite(ev.webkitCompassHeading) && ev.webkitCompassHeading >= 0) {
    return {
      headingDeg: normalizeHeadingDeg(ev.webkitCompassHeading + screenAngleDeg),
      isAbsolute: true,
    }
  }

  if (typeof ev.alpha !== 'number' || !Number.isFinite(ev.alpha)) {
    return null
  }

  const beta = typeof ev.beta === 'number' && Number.isFinite(ev.beta) ? ev.beta : 0
  const gamma = typeof ev.gamma === 'number' && Number.isFinite(ev.gamma) ? ev.gamma : 0

  const a = ev.alpha * DEG_TO_RAD
  const b = beta * DEG_TO_RAD
  const g = gamma * DEG_TO_RAD

  const cA = Math.cos(a)
  const sA = Math.sin(a)
  const cB = Math.cos(b)
  const sB = Math.sin(b)
  const cG = Math.cos(g)
  const sG = Math.sin(g)

  // +Y_body (phone top edge) projected onto world East-North horizontal plane
  const eTop = -sA * cB
  const nTop = cA * cB

  // -Z_body (back of phone, facing away from viewer) projected onto world East-North horizontal plane
  const eBack = -cA * sG - sA * sB * cG
  const nBack = -sA * sG + cA * sB * cG

  // Blend top-edge vector (dominant when flat) with back-facing vector (dominant when upright)
  // so there is zero gimbal jump around beta = 90 deg.
  const vx = eTop * cB + eBack * sB
  const vy = nTop * cB + nBack * sB

  let headingDeg: number
  if (Math.hypot(vx, vy) < 1e-4) {
    headingDeg = normalizeHeadingDeg(-ev.alpha)
  } else {
    headingDeg = normalizeHeadingDeg(Math.atan2(vx, vy) * RAD_TO_DEG)
  }

  return {
    headingDeg: normalizeHeadingDeg(headingDeg + screenAngleDeg),
    isAbsolute: ev.absolute === true,
  }
}

export async function requestCompassPermissionIfNeeded(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (typeof window === 'undefined') return 'unsupported'
  const DO = window.DeviceOrientationEvent as
    | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> })
    | undefined
  if (!DO) return 'unsupported'
  if (typeof DO.requestPermission === 'function') {
    try {
      const res = await DO.requestPermission()
      return res === 'granted' ? 'granted' : 'denied'
    } catch {
      return 'denied'
    }
  }
  return 'granted'
}

export function formatCardinalDirection(deg: number, lang: string): string {
  const n = normalizeHeadingDeg(deg)
  const idx = Math.round(n / 45) % 8
  const labels =
    lang === 'ko'
      ? ['북', '북동', '동', '남동', '남', '남서', '서', '북서']
      : lang === 'zh'
        ? ['北', '東北', '東', '東南', '南', '西南', '西', '西北']
        : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return labels[idx]
}
