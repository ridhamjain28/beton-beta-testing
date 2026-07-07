"use client"

import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { kelvinToRGB } from "@/lib/color-temperature"
import { REFERENCE_WATT, type BodyColor, type LightState } from "@/lib/lights"

type Props = {
  light: LightState
  bodyColor: BodyColor
  selected: boolean
  onSelect: (id: string) => void
}

const DEG2RAD = Math.PI / 180

/**
 * A recessed COB downlight modeled after a real fixture: a cylindrical
 * anti-glare reflector cup with the COB LED recessed at the top, a black
 * finned heat-sink barrel above the ceiling, and spring mounting brackets.
 *
 * The reflector cup + trim follow the user's body color (white or black),
 * while the heat sink stays dark like the real aluminium casting.
 *
 * The emitted light is a real THREE.SpotLight whose cone half-angle tracks the
 * beam-angle setting and whose intensity scales with the fixture's wattage
 * (rated output) times the brightness dimmer. It always points straight down.
 */
export function CeilingLight({ light, bodyColor, selected, onSelect }: Props) {
  const spotRef = useRef<THREE.SpotLight>(null)
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D())

  const [x, y, z] = light.position
  const [r, g, b] = kelvinToRGB(light.kelvin)
  const color = useMemo(() => new THREE.Color(r, g, b), [r, g, b])

  // Wattage sets rated output; brightness is a dimmer on top of it.
  const wattFactor = light.wattage / REFERENCE_WATT
  const factor = light.on ? (light.brightness / 100) * wattFactor : 0

  // Narrow beams concentrate the same flux into a smaller pool, so they read
  // brighter/punchier; wide beams spread and soften. Scale intensity mildly.
  const beamScale = THREE.MathUtils.clamp(36 / light.beamAngle, 0.65, 1.9)
  const spotIntensity = factor * 26 * beamScale
  const fillIntensity = factor * 3.5
  const emissiveIntensity = light.on ? 0.3 + Math.min(factor, 2) * 2.4 : 0.02

  // THREE spotLight.angle is the half-angle from center, in radians.
  const halfAngle = (light.beamAngle / 2) * DEG2RAD
  // Tighter beams get crisper edges; floods get soft falloff.
  const penumbra = THREE.MathUtils.clamp(0.15 + light.beamAngle / 140, 0.2, 0.7)

  // Cup + trim materials follow the chosen body color; heat sink stays dark.
  const shellColor = bodyColor === "white" ? "#f4f4f2" : "#0b0b0b"
  const shellRoughness = bodyColor === "white" ? 0.55 : 0.7
  const shellMetalness = bodyColor === "white" ? 0.1 : 0.25

  // black radial heat-sink fins
  const fins = useMemo(() => {
    const count = 14
    return Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2)
  }, [])

  // Keep the spotlight aimed straight down at the floor beneath the fixture.
  useEffect(() => {
    const target = targetRef.current
    target.position.set(x, 0, z)
    target.updateMatrixWorld()
    if (spotRef.current) {
      spotRef.current.target = target
    }
  }, [x, z])

  return (
    <group>
      <primitive object={targetRef.current} />

      {/* real emitted light, sourced just inside the cup mouth */}
      <spotLight
        ref={spotRef}
        position={[x, y - 0.02, z]}
        color={color}
        intensity={spotIntensity}
        angle={halfAngle}
        penumbra={penumbra}
        distance={16}
        decay={1.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
      />

      {/* soft omni fill so the ceiling/walls near the fixture pick up bounce */}
      <pointLight position={[x, y - 0.05, z]} color={color} intensity={fillIntensity} distance={5} decay={2} />

      {/* ---- fixture body, built around the cup mouth at (x, y, z) ---- */}
      <group
        position={[x, y, z]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(light.id)
        }}
      >
        {/* flush trim ring at the ceiling (body color) */}
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.03, 48]} />
          <meshStandardMaterial color={shellColor} metalness={shellMetalness} roughness={shellRoughness} />
        </mesh>

        {/* cylindrical anti-glare reflector cup (straight walls, open bottom) */}
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.205, 0.205, 0.3, 48, 1, true]} />
          <meshStandardMaterial
            color={shellColor}
            metalness={shellMetalness}
            roughness={shellRoughness}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* recessed COB phosphor ring, facing down into the room */}
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.15, 48]} />
          <meshStandardMaterial
            color={light.on ? "#fff7e6" : "#d8d4c8"}
            emissive={color}
            emissiveIntensity={emissiveIntensity * 0.5}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* bright COB emitter dot at the center */}
        <mesh position={[0, 0.305, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.07, 40]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* black heat-sink barrel above the ceiling */}
        <mesh position={[0, 0.44, 0]}>
          <cylinderGeometry args={[0.185, 0.185, 0.22, 32]} />
          <meshStandardMaterial color="#121212" metalness={0.6} roughness={0.45} />
        </mesh>

        {/* black radial heat-sink fins */}
        {fins.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 0.185, 0.58, Math.sin(a) * 0.185]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.02, 0.2, 0.13]} />
            <meshStandardMaterial color="#161616" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}

        {/* top cap of the heat sink */}
        <mesh position={[0, 0.69, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 24]} />
          <meshStandardMaterial color="#0d0d0d" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* subtle selection cue: a small floating dot above the fixture (no trim ring) */}
        {selected && (
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" toneMapped={false} />
          </mesh>
        )}
      </group>
    </group>
  )
}
