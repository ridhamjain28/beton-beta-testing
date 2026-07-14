"use client"

import type { ThreeElements } from "@react-three/fiber"
import { CeilingLight } from "./ceiling-light"
import type { BodyColor, LightState } from "@/lib/lights"

const ROOM_W = 8
const ROOM_D = 8
const ROOM_H = 3

type BoxProps = ThreeElements["mesh"] & {
  size: [number, number, number]
  color: string
  roughness?: number
  metalness?: number
}

function Box({ size, color, roughness = 0.8, metalness = 0, ...props }: BoxProps) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  )
}

function Sofa() {
  const fabric = "#c9c2b4"
  const fabricDark = "#b8b0a0"
  return (
    <group position={[0, 0, -2.5]}>
      <Box size={[3.2, 0.5, 1.1]} position={[0, 0.35, 0]} color={fabric} roughness={0.95} />
      <Box size={[3.2, 0.9, 0.3]} position={[0, 0.85, -0.4]} color={fabric} roughness={0.95} />
      <Box size={[0.3, 0.7, 1.1]} position={[-1.45, 0.6, 0]} color={fabricDark} roughness={0.95} />
      <Box size={[0.3, 0.7, 1.1]} position={[1.45, 0.6, 0]} color={fabricDark} roughness={0.95} />
      <Box size={[1.4, 0.25, 0.9]} position={[-0.75, 0.68, 0.05]} color="#d6d0c4" roughness={1} />
      <Box size={[1.4, 0.25, 0.9]} position={[0.75, 0.68, 0.05]} color="#d6d0c4" roughness={1} />
      {/* accent pillows */}
      <Box size={[0.5, 0.5, 0.18]} position={[-1, 0.95, 0.1]} rotation={[0, 0, 0.2]} color="#1f2937" roughness={1} />
      <Box size={[0.5, 0.5, 0.18]} position={[1, 0.95, 0.1]} rotation={[0, 0, -0.2]} color="#b45309" roughness={1} />
    </group>
  )
}

function CoffeeTable() {
  const leg = "#2b2b2b"
  return (
    <group position={[0, 0, -0.7]}>
      {/* matte oak top */}
      <Box size={[1.7, 0.09, 0.85]} position={[0, 0.45, 0]} color="#b8875a" roughness={0.5} metalness={0.05} />
      <Box size={[0.07, 0.45, 0.07]} position={[-0.77, 0.22, -0.35]} color={leg} metalness={0.6} roughness={0.4} />
      <Box size={[0.07, 0.45, 0.07]} position={[0.77, 0.22, -0.35]} color={leg} metalness={0.6} roughness={0.4} />
      <Box size={[0.07, 0.45, 0.07]} position={[-0.77, 0.22, 0.35]} color={leg} metalness={0.6} roughness={0.4} />
      <Box size={[0.07, 0.45, 0.07]} position={[0.77, 0.22, 0.35]} color={leg} metalness={0.6} roughness={0.4} />
    </group>
  )
}

function MetalVase() {
  return (
    <mesh castShadow position={[0.45, 0.66, -0.7]}>
      <cylinderGeometry args={[0.09, 0.13, 0.34, 32]} />
      <meshStandardMaterial color="#d4d4d8" metalness={1} roughness={0.12} />
    </mesh>
  )
}

function CeramicBowl() {
  return (
    <mesh castShadow receiveShadow position={[-0.35, 0.53, -0.7]}>
      <cylinderGeometry args={[0.16, 0.1, 0.1, 32]} />
      <meshStandardMaterial color="#1f2937" roughness={0.35} metalness={0.1} />
    </mesh>
  )
}

function PlantInPot() {
  return (
    <group position={[3.1, 0, -2.7]}>
      <Box size={[0.5, 0.5, 0.5]} position={[0, 0.25, 0]} color="#3f3f46" roughness={0.8} />
      <mesh castShadow position={[0, 1, 0]}>
        <sphereGeometry args={[0.5, 20, 20]} />
        <meshStandardMaterial color="#3f6212" roughness={1} />
      </mesh>
      <mesh castShadow position={[0.18, 0.78, 0.12]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#4d7c0f" roughness={1} />
      </mesh>
    </group>
  )
}

function MediaConsole() {
  return (
    <group position={[-3.1, 0, -1]}>
      {/* low console against the left wall */}
      <Box size={[0.5, 0.5, 3]} position={[0, 0.25, 0]} color="#2b2118" roughness={0.6} metalness={0.1} />
      <Box size={[0.52, 0.06, 3.02]} position={[0, 0.52, 0]} color="#c8a06a" roughness={0.4} metalness={0.1} />
    </group>
  )
}

function Rug() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -1.3]}>
      <planeGeometry args={[3.8, 2.6]} />
      <meshStandardMaterial color="#3f4650" roughness={1} />
    </mesh>
  )
}

/**
 * Back wall built as solid segments framing two large glazed openings, so the
 * sun and sky are visible through real windows and cast window-shaped light on
 * the floor.
 */
function WindowWall() {
  const wall = "#e9e4db"
  const frame = "#2a2a2a"
  const z = -ROOM_D / 2
  const sill = 0.8
  const head = 2.5
  const openL = -3
  const openR = 3
  const mull = 0.12

  return (
    <group>
      {/* sill (below windows) */}
      <mesh receiveShadow position={[0, sill / 2, z]}>
        <boxGeometry args={[ROOM_W, sill, 0.14]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {/* header (above windows) */}
      <mesh receiveShadow position={[0, (head + ROOM_H) / 2, z]}>
        <boxGeometry args={[ROOM_W, ROOM_H - head, 0.14]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {/* left solid segment */}
      <mesh receiveShadow position={[(-ROOM_W / 2 + openL) / 2, (sill + head) / 2, z]}>
        <boxGeometry args={[ROOM_W / 2 + openL, head - sill, 0.14]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {/* right solid segment */}
      <mesh receiveShadow position={[(ROOM_W / 2 + openR) / 2, (sill + head) / 2, z]}>
        <boxGeometry args={[ROOM_W / 2 - openR, head - sill, 0.14]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {/* center mullion */}
      <mesh position={[0, (sill + head) / 2, z + 0.01]}>
        <boxGeometry args={[mull, head - sill, 0.1]} />
        <meshStandardMaterial color={frame} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* frames around each opening */}
      {[
        [openL, -mull / 2],
        [mull / 2, openR],
      ].map(([a, b], i) => {
        const cx = (a + b) / 2
        const w = b - a
        return (
          <group key={i}>
            <mesh position={[cx, sill + 0.03, z + 0.01]}>
              <boxGeometry args={[w, 0.06, 0.1]} />
              <meshStandardMaterial color={frame} roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[cx, head - 0.03, z + 0.01]}>
              <boxGeometry args={[w, 0.06, 0.1]} />
              <meshStandardMaterial color={frame} roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[a + 0.03, (sill + head) / 2, z + 0.01]}>
              <boxGeometry args={[0.06, head - sill, 0.1]} />
              <meshStandardMaterial color={frame} roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[b - 0.03, (sill + head) / 2, z + 0.01]}>
              <boxGeometry args={[0.06, head - sill, 0.1]} />
              <meshStandardMaterial color={frame} roughness={0.5} metalness={0.2} />
            </mesh>
            {/* glass pane */}
            <mesh position={[cx, (sill + head) / 2, z + 0.02]}>
              <planeGeometry args={[w - 0.08, head - sill - 0.08]} />
              <meshPhysicalMaterial
                transparent
                opacity={0.14}
                roughness={0.05}
                metalness={0}
                transmission={0.9}
                thickness={0.05}
                color="#dbeafe"
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function Shell() {
  const wall = "#e9e4db"
  const ceiling = "#f4f1ec"
  return (
    <group>
      {/* wood floor, mildly reflective */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#a87b4f" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color={ceiling} roughness={1} />
      </mesh>
      {/* left wall */}
      <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-ROOM_W / 2, ROOM_H / 2, 0]}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {/* right wall */}
      <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[ROOM_W / 2, ROOM_H / 2, 0]}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
    </group>
  )
}

type Props = {
  lights: LightState[]
  bodyColor: BodyColor
  selectedId: string | null
  onSelect: (id: string) => void
}

export function RoomScene({ lights, bodyColor, selectedId, onSelect }: Props) {
  return (
    <group>
      <Shell />
      <WindowWall />
      <Rug />
      <Sofa />
      <CoffeeTable />
      <MetalVase />
      <CeramicBowl />
      <PlantInPot />
      <MediaConsole />

      {lights.map((light) => (
        <CeilingLight
          key={light.id}
          light={light}
          bodyColor={bodyColor}
          selected={light.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}
