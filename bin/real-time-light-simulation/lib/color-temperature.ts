// Converts an LED color temperature in Kelvin to a normalized RGB triplet.
// Instead of a generic black-body curve, we interpolate between measured hex
// swatches supplied for this specific COB downlight, so the on-screen tint on
// objects matches how the real fixture looks at each CCT.

// Measured emitter colors for the fixture, warm -> cool.
const LAMP_ANCHORS: { k: number; rgb: [number, number, number] }[] = [
  { k: 2700, rgb: [0xff, 0xa7, 0x57] }, // #FFA757
  { k: 3000, rgb: [0xff, 0xb1, 0x6e] }, // #FFB16E
  { k: 3500, rgb: [0xff, 0xc1, 0x8d] }, // #FFC18D
  { k: 4000, rgb: [0xff, 0xce, 0xa6] }, // #FFCEA6
  { k: 5000, rgb: [0xff, 0xe4, 0xce] }, // #FFE4CE
  { k: 6500, rgb: [0xff, 0xfe, 0xfa] }, // #FFFEFA
]

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * @param kelvin color temperature (clamped to the fixture's 2700K..6500K range)
 * @returns [r, g, b] each in the 0..1 range, ready for THREE.Color.setRGB
 */
export function kelvinToRGB(kelvin: number): [number, number, number] {
  const first = LAMP_ANCHORS[0]
  const last = LAMP_ANCHORS[LAMP_ANCHORS.length - 1]
  if (kelvin <= first.k) return first.rgb.map((c) => c / 255) as [number, number, number]
  if (kelvin >= last.k) return last.rgb.map((c) => c / 255) as [number, number, number]

  for (let i = 0; i < LAMP_ANCHORS.length - 1; i++) {
    const lo = LAMP_ANCHORS[i]
    const hi = LAMP_ANCHORS[i + 1]
    if (kelvin >= lo.k && kelvin <= hi.k) {
      const t = (kelvin - lo.k) / (hi.k - lo.k)
      return [
        lerp(lo.rgb[0], hi.rgb[0], t) / 255,
        lerp(lo.rgb[1], hi.rgb[1], t) / 255,
        lerp(lo.rgb[2], hi.rgb[2], t) / 255,
      ]
    }
  }
  return last.rgb.map((c) => c / 255) as [number, number, number]
}

/** A CSS rgb() string for the same temperature, used to tint UI swatches. */
export function kelvinToCss(kelvin: number): string {
  const [r, g, b] = kelvinToRGB(kelvin)
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

/** Human-friendly label for a given temperature. */
export function kelvinLabel(kelvin: number): string {
  if (kelvin < 3000) return "Warm White"
  if (kelvin < 3700) return "Soft White"
  if (kelvin < 4500) return "Neutral White"
  if (kelvin < 5500) return "Cool White"
  return "Daylight"
}
