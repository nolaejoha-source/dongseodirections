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

let cachedCompassPermission: 'granted' | 'denied' | 'unsupported' | null = null

export async function requestCompassPermissionIfNeeded(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (typeof window === 'undefined') return 'unsupported'
  if (cachedCompassPermission === 'granted') return 'granted'
  const DO = window.DeviceOrientationEvent as
    | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> })
    | undefined
  if (!DO) {
    cachedCompassPermission = 'unsupported'
    return 'unsupported'
  }
  if (typeof DO.requestPermission === 'function') {
    try {
      const res = await DO.requestPermission()
      cachedCompassPermission = res === 'granted' ? 'granted' : 'denied'
      return cachedCompassPermission
    } catch {
      return 'denied'
    }
  }
  cachedCompassPermission = 'granted'
  return 'granted'
}

interface OrientationSensorLike {
  quaternion?: number[] | Float32Array
  start: () => void
  stop: () => void
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

type OrientationSensorCtor = new (options?: { frequency?: number; referenceFrame?: 'device' | 'screen' }) => OrientationSensorLike

function headingFromQuaternion(
  q: number[] | Float32Array,
  screenAngleDeg: number,
): number | null {
  if (!q || q.length < 4) return null
  const [qx, qy, qz, qw] = q
  if (![qx, qy, qz, qw].every(Number.isFinite)) return null

  // Rotate body +Y (top of phone: 0, 1, 0) into world ENU frame
  const eTop = 2 * (qx * qy - qw * qz)
  const nTop = 1 - 2 * (qx * qx + qz * qz)

  // Rotate body -Z (back of phone: 0, 0, -1) into world ENU frame
  const eBack = -2 * (qx * qz + qw * qy)
  const nBack = -2 * (qy * qz - qw * qx)

  // Tilt cosine factor from rotated +Z axis vertical component
  const upZ = 1 - 2 * (qx * qx + qy * qy)
  const wTop = Math.max(0.15, Math.min(1, Math.abs(upZ)))
  const wBack = 1 - wTop
  const vx = eTop * wTop + eBack * wBack
  const vy = nTop * wTop + nBack * wBack
  if (Math.hypot(vx, vy) < 1e-4) return null

  const azimuth = normalizeHeadingDeg(Math.atan2(vx, vy) * RAD_TO_DEG)
  return normalizeHeadingDeg(azimuth + screenAngleDeg)
}

export function subscribeLiveCompass(onReading: (reading: CompassReading) => void): () => void {
  if (typeof window === 'undefined') return () => undefined

  let screenAngleDeg = getScreenOrientationAngle()
  let lastAbsoluteAt = 0
  let stopped = false

  const updateScreenAngle = () => {
    screenAngleDeg = getScreenOrientationAngle()
  }

  const handleOrientation = (ev: DeviceOrientationEvent) => {
    if (stopped) return
    const reading = extractCompassHeading(
      ev as DeviceOrientationEvent & { webkitCompassHeading?: number | null },
      screenAngleDeg,
    )
    if (!reading) return
    const now = performance.now()
    if (reading.isAbsolute) {
      lastAbsoluteAt = now
    } else if (now - lastAbsoluteAt < 2500) {
      return
    }
    onReading(reading)
  }

  window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true)
  window.addEventListener('deviceorientation', handleOrientation as EventListener, true)
  window.addEventListener('orientationchange', updateScreenAngle, true)
  try {
    window.screen?.orientation?.addEventListener?.('change', updateScreenAngle)
  } catch {
    // Ignore restricted screen.orientation listeners
  }

  // Fallback high-frequency Web Sensor API (60Hz) for Android/Chrome where deviceorientation throttles
  const sensors: OrientationSensorLike[] = []
  const win = window as unknown as {
    AbsoluteOrientationSensor?: OrientationSensorCtor
    RelativeOrientationSensor?: OrientationSensorCtor
  }

  const attachSensor = (Ctor: OrientationSensorCtor | undefined, isAbsolute: boolean) => {
    if (!Ctor) return
    try {
      const sensor = new Ctor({ frequency: 60, referenceFrame: 'device' })
      const onSensorReading = () => {
        if (stopped || !sensor.quaternion) return
        const now = performance.now()
        if (!isAbsolute && now - lastAbsoluteAt < 2500) return
        const headingDeg = headingFromQuaternion(sensor.quaternion, screenAngleDeg)
        if (headingDeg === null) return
        if (isAbsolute) lastAbsoluteAt = now
        onReading({ headingDeg, isAbsolute })
      }
      sensor.addEventListener('reading', onSensorReading)
      sensor.addEventListener('error', () => {
        try {
          sensor.stop()
        } catch {
          // Ignore cleanup errors
        }
      })
      sensor.start()
      sensors.push(sensor)
    } catch {
      // Sensor API blocked by permissions policy or unsupported device
    }
  }

  attachSensor(win.AbsoluteOrientationSensor, true)
  attachSensor(win.RelativeOrientationSensor, false)

  return () => {
    stopped = true
    window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true)
    window.removeEventListener('deviceorientation', handleOrientation as EventListener, true)
    window.removeEventListener('orientationchange', updateScreenAngle, true)
    try {
      window.screen?.orientation?.removeEventListener?.('change', updateScreenAngle)
    } catch {
      // Ignore cleanup errors
    }
    for (const s of sensors) {
      try {
        s.stop()
      } catch {
        // Ignore cleanup errors
      }
    }
  }
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
