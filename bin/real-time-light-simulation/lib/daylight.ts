// Physically-inspired outdoor lighting model driven by a time-of-day value (0-24h).
// Produces a sun direction, sun color/intensity, sky/ambient fill and night flags
// so the interior reacts to the world outside the windows in real time.

export type Daylight = {
  timeOfDay: number
  sunPosition: [number, number, number]
  sunColor: string
  sunIntensity: number
  skyRayleigh: number
  skyTurbidity: number
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
  ambientIntensity: number
  envIntensity: number
  isNight: boolean
  backgroundColor: string
  label: string
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v))
}

// mix two hex colors
function mixHex(a: string, b: string, t: number) {
  const pa = [Number.parseInt(a.slice(1, 3), 16), Number.parseInt(a.slice(3, 5), 16), Number.parseInt(a.slice(5, 7), 16)]
  const pb = [Number.parseInt(b.slice(1, 3), 16), Number.parseInt(b.slice(3, 5), 16), Number.parseInt(b.slice(5, 7), 16)]
  const r = Math.round(lerp(pa[0], pb[0], t))
  const g = Math.round(lerp(pa[1], pb[1], t))
  const bl = Math.round(lerp(pa[2], pb[2], t))
  return `#${[r, g, bl].map((n) => n.toString(16).padStart(2, "0")).join("")}`
}

function labelFor(time: number) {
  if (time < 5) return "Night"
  if (time < 6.5) return "Dawn"
  if (time < 9) return "Morning"
  if (time < 16) return "Midday"
  if (time < 18) return "Afternoon"
  if (time < 19.5) return "Sunset"
  if (time < 21) return "Dusk"
  return "Night"
}

export function computeDaylight(timeOfDay: number): Daylight {
  // sun path: rises at 5:30, peaks near 12:30, sets at 19:30
  const SUNRISE = 5.5
  const SUNSET = 19.5
  const dayFrac = (timeOfDay - SUNRISE) / (SUNSET - SUNRISE)
  const angle = dayFrac * Math.PI
  const elevation = Math.sin(angle) // >0 while the sun is above the horizon
  const azimuthX = -Math.cos(angle) * 90 // swings across the sky

  const above = clamp(elevation, 0, 1)
  // how close to the horizon while still up (drives warm golden-hour color)
  const horizonWarmth = above > 0 ? 1 - clamp(elevation / 0.35, 0, 1) : 1

  const isNight = elevation <= 0.02

  // sun color: warm at the horizon -> neutral daylight at the peak
  const sunColor = mixHex("#fff4e0", "#ff7b33", horizonWarmth * 0.85)

  // sun intensity ramps up off the horizon and peaks at noon
  const sunIntensity = above <= 0 ? 0 : lerp(0.6, 4.2, Math.pow(above, 0.6))

  // sky look for the drei <Sky> shader
  const skyRayleigh = lerp(0.6, 3.2, horizonWarmth) // more scattering near horizon = redder
  const skyTurbidity = lerp(2, 10, horizonWarmth)

  // hemisphere fill (soft sky/ground ambient inside the room)
  const daySky = "#bcd6ff"
  const sunsetSky = "#ffb27a"
  const nightSky = "#10192e"
  const hemiSky = isNight ? nightSky : mixHex(daySky, sunsetSky, horizonWarmth)
  const hemiGround = isNight ? "#0a0a12" : "#5b4a3a"
  const hemiIntensity = isNight ? 0.12 : lerp(0.25, 0.9, above)

  const ambientIntensity = isNight ? 0.04 : lerp(0.05, 0.18, above)
  const envIntensity = isNight ? 0.05 : lerp(0.1, 0.55, above)

  const backgroundColor = isNight ? "#05070f" : mixHex("#1a2a4a", "#8fb6ef", above)

  return {
    timeOfDay,
    sunPosition: [azimuthX, Math.max(elevation, -0.25) * 90, -80],
    sunColor,
    sunIntensity,
    skyRayleigh,
    skyTurbidity,
    hemiSky,
    hemiGround,
    hemiIntensity,
    ambientIntensity,
    envIntensity,
    isNight,
    backgroundColor,
    label: labelFor(timeOfDay),
  }
}
