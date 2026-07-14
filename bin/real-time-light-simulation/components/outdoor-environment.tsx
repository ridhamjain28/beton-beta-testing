"use client"

import { Sky, Stars } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"
import type { Daylight } from "@/lib/daylight"

type Props = {
  day: Daylight
}

/**
 * Everything "outside" the room: the sky dome, the sun (a shadow-casting
 * directional light aimed through the windows), a cool moonlight fill at night,
 * stars after dark, and a soft hemisphere fill that tints the whole interior
 * with the color of the current sky.
 */
export function OutdoorEnvironment({ day }: Props) {
  const sunRef = useRef<THREE.DirectionalLight>(null)

  const [sx, sy, sz] = day.sunPosition
  const sunColor = new THREE.Color(day.sunColor)

  return (
    <group>
      {/* sky dome (only meaningful while the sun is up) */}
      {!day.isNight && (
        <Sky
          distance={450}
          sunPosition={[sx, sy, sz]}
          rayleigh={day.skyRayleigh}
          turbidity={day.skyTurbidity}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
      )}

      {/* night sky */}
      {day.isNight && <Stars radius={120} depth={60} count={3500} factor={3} saturation={0} fade speed={0.4} />}

      {/* the sun: streams through the windows and casts window-shaped light on the floor */}
      <directionalLight
        ref={sunRef}
        position={[sx * 0.06, sy * 0.06, sz * 0.06]}
        color={sunColor}
        intensity={day.sunIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
      />

      {/* cool moonlight so a night scene still reads through the glass */}
      {day.isNight && (
        <directionalLight position={[-3, 5, -6]} color="#8fb0ff" intensity={0.35} castShadow shadow-bias={-0.0005} />
      )}

      {/* sky/ground hemisphere fill tints the interior with the outdoor color */}
      <hemisphereLight color={day.hemiSky} groundColor={day.hemiGround} intensity={day.hemiIntensity} />
    </group>
  )
}
