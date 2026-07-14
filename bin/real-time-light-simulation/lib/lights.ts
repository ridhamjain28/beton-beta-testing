export type BodyColor = "white" | "black"

export type LayoutId = "row" | "corners"

export type LightState = {
  id: string
  name: string
  // fixture position in the room [x, y, z]
  position: [number, number, number]
  kelvin: number
  // 0..100 user-facing brightness (acts as a dimmer on top of wattage)
  brightness: number
  // rated electrical power in watts; drives real light output
  wattage: number
  // full beam angle in degrees (COB downlight optics: narrow spot -> wide flood)
  beamAngle: number
  on: boolean
}

export const KELVIN_MIN = 2700
export const KELVIN_MAX = 6500

// Real COB downlight optics range from tight spots to wide floods.
export const BEAM_MIN = 10
export const BEAM_MAX = 90
export const BEAM_PRESETS = [15, 24, 36, 60] as const

// Wattage range for residential COB downlights.
export const WATT_MIN = 3
export const WATT_MAX = 30
export const WATT_PRESETS = [7, 10, 12, 18] as const
// Modern efficient COB LED luminous efficacy (lumens per watt).
export const LUMENS_PER_WATT = 90
// Wattage that maps to the baseline render intensity.
export const REFERENCE_WATT = 10

const CEIL_Y = 2.92

function makeLight(
  id: string,
  name: string,
  position: [number, number, number],
): LightState {
  return { id, name, position, kelvin: 2700, brightness: 80, wattage: 10, beamAngle: 36, on: true }
}

// Layout A: a row of three downlights over the seating area.
export const ROW_LIGHTS: LightState[] = [
  makeLight("l1", "Left Downlight", [-2.4, CEIL_Y, -0.6]),
  makeLight("l2", "Center Downlight", [0, CEIL_Y, -0.6]),
  makeLight("l3", "Right Downlight", [2.4, CEIL_Y, -0.6]),
]

// Layout B: four downlights, one toward each corner, evenly spaced.
export const CORNER_LIGHTS: LightState[] = [
  makeLight("c1", "Back-Left Downlight", [-2, CEIL_Y, -2]),
  makeLight("c2", "Back-Right Downlight", [2, CEIL_Y, -2]),
  makeLight("c3", "Front-Left Downlight", [-2, CEIL_Y, 2]),
  makeLight("c4", "Front-Right Downlight", [2, CEIL_Y, 2]),
]

export const LAYOUTS: { id: LayoutId; name: string; description: string; lights: LightState[] }[] = [
  { id: "row", name: "Row of 3", description: "Over the seating area", lights: ROW_LIGHTS },
  { id: "corners", name: "4 Corners", description: "Evenly spaced grid", lights: CORNER_LIGHTS },
]

export const DEFAULT_LAYOUT: LayoutId = "row"
export const DEFAULT_LIGHTS = ROW_LIGHTS
