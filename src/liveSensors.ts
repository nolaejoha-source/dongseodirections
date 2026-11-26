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
let cachedMotionPermission: 'granted' | 'denied' | 'unsupported' | null = null

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

export async function requestMotionPermissionIfNeeded(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (typeof window === 'undefined') return 'unsupported'
  if (cachedMotionPermission === 'granted') return 'granted'
  const DM = window.DeviceMotionEvent as
    | (typeof DeviceMotionEvent & { requestPermission?: () => Promise<'granted' | 'denied'> })
    | undefined
  if (!DM) {
    cachedMotionPermission = 'unsupported'
    return 'unsupported'
  }
  if (typeof DM.requestPermission === 'function') {
    try {
      const res = await DM.requestPermission()
      cachedMotionPermission = res === 'granted' ? 'granted' : 'denied'
      return cachedMotionPermission
    } catch {
      return 'denied'
    }
  }
  cachedMotionPermission = 'granted'
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

export function unlockSpeechSynthesis(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    const utter = new SpeechSynthesisUtterance('')
    utter.volume = 0
    window.speechSynthesis.speak(utter)
    window.speechSynthesis.cancel()
  } catch {
    // Ignore blocked speech synthesis before interaction
  }
}

export function cancelSpeech(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    // Ignore cleanup errors
  }
}

export function speakArrivalAnnouncement(lang: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const textByLang: Record<string, { text: string; locale: string }> = {
    ko: { text: '도착지점에 도착하셨습니다.', locale: 'ko-KR' },
    en: { text: 'You have arrived at your destination.', locale: 'en-US' },
    zh: { text: '您已到达目的地。', locale: 'zh-CN' },
    vi: { text: 'Bạn đã đến điểm đến.', locale: 'vi-VN' },
    lt: { text: 'Atvykote į kelionės tikslą.', locale: 'lt-LT' },
    hi: { text: 'आप अपने गंतव्य पर पहुँच गए हैं।', locale: 'hi-IN' },
  }
  const entry = textByLang[lang] ?? textByLang.ko
  try {
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(entry.text)
    utter.lang = entry.locale
    utter.rate = 1.0
    utter.pitch = 1.0
    utter.volume = 1.0
    window.speechSynthesis.speak(utter)
  } catch {
    // Ignore TTS failures on unsupported devices
  }
}

export interface RawGpsFixInput {
  latitude: number
  longitude: number
  accuracy?: number | null
  heading?: number | null
  trueHeading?: number | null
  magneticHeading?: number | null
  course?: number | null
  speed?: number | null
  timestamp?: number
}

export interface FusedLocationTick {
  lat: number
  lng: number
  rawLat: number
  rawLng: number
  accuracyM: number | null
  speedMps: number
  reportHz: number
  gpsFixAgeMs: number
  isPredicted: boolean
}

const METERS_PER_DEG_LAT = 111_320

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * 10 Hz (0.1s) Hybrid GNSS + Accelerometer PDR Sensor Fusion Engine.
 * Smoothly blends raw satellite fixes with 60Hz pedestrian dead reckoning & ZUPT
 * so location updates continuously every 100ms with zero stationary drift.
 */
export class GpsFusion10HzEngine {
  private readonly getHeadingDeg: () => number
  private readonly onTick: (tick: FusedLocationTick) => void
  private readonly reportIntervalMs: number

  private timerId: number | null = null
  private motionBound = false
  private running = false

  private originLat: number | null = null
  private originLng: number | null = null
  private metersPerDegLng = 91_000

  private hasFix = false
  private rawLat = 0
  private rawLng = 0
  private accuracyM: number | null = null
  private estE = 0
  private estN = 0
  private velE = 0
  private velN = 0
  private anchorE = 0
  private anchorN = 0
  private prevFixE = 0
  private prevFixN = 0
  private lastFixPerf = 0
  private lastTickPerf = 0
  private lastGpsSpeedMps = 0
  private outlierCount = 0

  private gravEma = 9.81
  private accelEnergyEma = 0
  private lastStepPerf = 0
  private stepActiveSincePerf = 0
  private tickTimestamps: number[] = []

  constructor(options: {
    getHeadingDeg: () => number
    onTick: (tick: FusedLocationTick) => void
    reportIntervalMs?: number
  }) {
    this.getHeadingDeg = options.getHeadingDeg
    this.onTick = options.onTick
    this.reportIntervalMs = Math.max(50, options.reportIntervalMs ?? 100)
  }

  private toEnu(lat: number, lng: number): [number, number] {
    if (this.originLat === null || this.originLng === null) {
      this.originLat = lat
      this.originLng = lng
      this.metersPerDegLng = METERS_PER_DEG_LAT * Math.cos(lat * DEG_TO_RAD)
    }
    return [(lng - this.originLng) * this.metersPerDegLng, (lat - this.originLat) * METERS_PER_DEG_LAT]
  }

  private toLatLng(e: number, n: number): [number, number] {
    const oLat = this.originLat ?? 0
    const oLng = this.originLng ?? 0
    return [oLat + n / METERS_PER_DEG_LAT, oLng + e / this.metersPerDegLng]
  }

  private handleDeviceMotion = (ev: DeviceMotionEvent) => {
    if (!this.running || !this.hasFix) return
    const now = performance.now()
    const lin = ev.acceleration
    let devMag = 0
    if (
      lin &&
      typeof lin.x === 'number' &&
      typeof lin.y === 'number' &&
      typeof lin.z === 'number' &&
      Number.isFinite(lin.x) &&
      Number.isFinite(lin.y) &&
      Number.isFinite(lin.z)
    ) {
      devMag = Math.hypot(lin.x, lin.y, lin.z)
    } else {
      const inc = ev.accelerationIncludingGravity
      if (
        !inc ||
        typeof inc.x !== 'number' ||
        typeof inc.y !== 'number' ||
        typeof inc.z !== 'number' ||
        !Number.isFinite(inc.x) ||
        !Number.isFinite(inc.y) ||
        !Number.isFinite(inc.z)
      ) {
        return
      }
      const totalMag = Math.hypot(inc.x, inc.y, inc.z)
      this.gravEma = this.gravEma * 0.9 + totalMag * 0.1
      devMag = Math.abs(totalMag - this.gravEma)
    }

    this.accelEnergyEma = this.accelEnergyEma * 0.85 + devMag * 0.15

    // Step impulse peak detection with 260ms refractory guard
    if (devMag >= 1.45 && this.accelEnergyEma >= 0.55 && now - this.lastStepPerf >= 260) {
      this.lastStepPerf = now
      this.stepActiveSincePerf = now
      const headingRad = normalizeHeadingDeg(this.getHeadingDeg()) * DEG_TO_RAD
      const dirE = Math.sin(headingRad)
      const dirN = Math.cos(headingRad)
      const strideSpeed = clamp(Math.max(1.25, this.lastGpsSpeedMps), 1.1, 2.6)
      this.velE = this.velE * 0.35 + dirE * strideSpeed * 0.65
      this.velN = this.velN * 0.35 + dirN * strideSpeed * 0.65
      this.estE += dirE * 0.18
      this.estN += dirN * 0.18
      this.clampToAnchor()
    }
  }

  private clampToAnchor() {
    const dx = this.estE - this.anchorE
    const dy = this.estN - this.anchorN
    const d = Math.hypot(dx, dy)
    const maxOffset = Math.max(4.5, Math.min(10, (this.accuracyM ?? 10) * 0.45))
    if (d > maxOffset) {
      const scale = maxOffset / d
      this.estE = this.anchorE + dx * scale
      this.estN = this.anchorN + dy * scale
    }
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.lastTickPerf = performance.now()
    if (typeof window !== 'undefined') {
      window.addEventListener('devicemotion', this.handleDeviceMotion, true)
      this.motionBound = true
      this.timerId = window.setInterval(() => this.emitTick(false), this.reportIntervalMs)
    }
  }

  stop(): void {
    this.running = false
    if (typeof window !== 'undefined') {
      if (this.timerId !== null) {
        window.clearInterval(this.timerId)
        this.timerId = null
      }
      if (this.motionBound) {
        window.removeEventListener('devicemotion', this.handleDeviceMotion, true)
        this.motionBound = false
      }
    }
  }

  reset(): void {
    this.hasFix = false
    this.originLat = null
    this.originLng = null
    this.estE = 0
    this.estN = 0
    this.velE = 0
    this.velN = 0
    this.anchorE = 0
    this.anchorN = 0
    this.lastGpsSpeedMps = 0
    this.outlierCount = 0
    this.tickTimestamps = []
  }

  ingestGpsFix(fix: RawGpsFixInput): void {
    const { latitude, longitude, accuracy, speed, course, heading, trueHeading, magneticHeading } = fix
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return

    const now = performance.now()
    const [fx, fy] = this.toEnu(latitude, longitude)
    const acc = typeof accuracy === 'number' && Number.isFinite(accuracy) && accuracy > 0 ? accuracy : 14

    if (!this.hasFix) {
      this.hasFix = true
      this.rawLat = latitude
      this.rawLng = longitude
      this.accuracyM = acc
      this.estE = fx
      this.estN = fy
      this.anchorE = fx
      this.anchorN = fy
      this.prevFixE = fx
      this.prevFixN = fy
      this.velE = 0
      this.velN = 0
      this.lastFixPerf = now
      this.lastTickPerf = now
      this.emitTick(false)
      return
    }

    const dtFix = Math.max(0.05, (now - this.lastFixPerf) / 1000)
    const jumpFromEst = Math.hypot(fx - this.estE, fy - this.estN)

    // Reject single-frame GNSS multipath spikes (>35 m/s jump) unless repeated
    if (jumpFromEst / dtFix > 35 && this.outlierCount < 1) {
      this.outlierCount += 1
      return
    }
    this.outlierCount = 0

    // Re-center tangent plane if user moved > 2km
    if (Math.hypot(fx, fy) > 2000) {
      this.originLat = latitude
      this.originLng = longitude
      this.metersPerDegLng = METERS_PER_DEG_LAT * Math.cos(latitude * DEG_TO_RAD)
      this.estE = 0
      this.estN = 0
      this.anchorE = 0
      this.anchorN = 0
      this.prevFixE = 0
      this.prevFixN = 0
      this.lastFixPerf = now
      this.rawLat = latitude
      this.rawLng = longitude
      this.accuracyM = acc
      this.emitTick(false)
      return
    }

    this.rawLat = latitude
    this.rawLng = longitude
    this.accuracyM = acc

    // Accuracy-weighted Kalman alpha-beta update
    const alpha = clamp(18 / (acc + 10), 0.3, 0.94)
    this.estE += alpha * (fx - this.estE)
    this.estN += alpha * (fy - this.estN)
    this.anchorE = fx
    this.anchorN = fy

    const dispVx = (fx - this.prevFixE) / dtFix
    const dispVy = (fy - this.prevFixN) / dtFix
    this.prevFixE = fx
    this.prevFixN = fy
    this.lastFixPerf = now

    const reportedSpeed =
      typeof speed === 'number' && Number.isFinite(speed) && speed >= 0 ? clamp(speed, 0, 14) : null
    if (reportedSpeed !== null) {
      this.lastGpsSpeedMps = reportedSpeed
    } else {
      this.lastGpsSpeedMps = clamp(Math.hypot(dispVx, dispVy), 0, 14)
    }

    const nativeDir =
      typeof course === 'number' && Number.isFinite(course) && course >= 0
        ? course
        : typeof trueHeading === 'number' && Number.isFinite(trueHeading) && trueHeading >= 0
          ? trueHeading
          : typeof magneticHeading === 'number' && Number.isFinite(magneticHeading) && magneticHeading >= 0
            ? magneticHeading
            : typeof heading === 'number' && Number.isFinite(heading) && heading >= 0
              ? heading
              : this.getHeadingDeg()

    if (reportedSpeed !== null && reportedSpeed >= 0.25) {
      const dirRad = normalizeHeadingDeg(nativeDir) * DEG_TO_RAD
      const targetVx = reportedSpeed * Math.sin(dirRad)
      const targetVy = reportedSpeed * Math.cos(dirRad)
      this.velE = this.velE * 0.4 + targetVx * 0.6
      this.velN = this.velN * 0.4 + targetVy * 0.6
    } else if (dtFix >= 0.12 && Math.hypot(dispVx, dispVy) >= 0.35 && Math.hypot(dispVx, dispVy) <= 14) {
      const beta = 0.48 * alpha
      this.velE = this.velE * (1 - beta) + dispVx * beta
      this.velN = this.velN * (1 - beta) + dispVy * beta
    } else if (reportedSpeed !== null && reportedSpeed < 0.2 && now - this.lastStepPerf > 650) {
      this.velE *= 0.25
      this.velN *= 0.25
    }

    if (this.running) {
      this.emitTick(false)
    }
  }

  private emitTick(_predictedHint: boolean): void {
    if (!this.hasFix) return
    const now = performance.now()
    const dt = clamp((now - this.lastTickPerf) / 1000, 0, 0.25)
    this.lastTickPerf = now

    const fixAgeMs = Math.max(0, now - this.lastFixPerf)
    const isStationary =
      now - this.stepActiveSincePerf > 650 && this.accelEnergyEma < 0.45 && this.lastGpsSpeedMps < 0.3

    let predicted = false
    if (isStationary) {
      const damp = Math.exp(-8.0 * dt)
      this.velE *= damp
      this.velN *= damp
    } else if (fixAgeMs <= 2500 && Math.hypot(this.velE, this.velN) > 0.15) {
      const prevE = this.estE
      const prevN = this.estN
      this.estE += this.velE * dt
      this.estN += this.velN * dt
      this.clampToAnchor()
      const decay = Math.exp(-0.95 * dt)
      this.velE *= decay
      this.velN *= decay
      predicted = Math.hypot(this.estE - prevE, this.estN - prevN) > 0.005
    }

    this.tickTimestamps.push(now)
    while (this.tickTimestamps.length > 0 && now - this.tickTimestamps[0] > 1000) {
      this.tickTimestamps.shift()
    }
    const reportHz =
      this.tickTimestamps.length >= 2
        ? clamp(
            Math.round(
              ((this.tickTimestamps.length - 1) * 1000) /
                Math.max(100, now - this.tickTimestamps[0]),
            ),
            1,
            10,
          )
        : 10

    const [lat, lng] = this.toLatLng(this.estE, this.estN)
    this.onTick({
      lat,
      lng,
      rawLat: this.rawLat,
      rawLng: this.rawLng,
      accuracyM: this.accuracyM !== null ? Math.round(this.accuracyM) : null,
      speedMps: Math.round(Math.hypot(this.velE, this.velN) * 10) / 10,
      reportHz,
      gpsFixAgeMs: Math.round(fixAgeMs),
      isPredicted: predicted,
    })
  }
}
