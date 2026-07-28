"use client"

import { RoundedBox } from "@react-three/drei"
import type { ThreeElements } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import * as THREE from "three"
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

function makeSurfaceTexture(base: [number, number, number], variance: number, seed: number) {
  const size = 128
  const data = new Uint8Array(size * size * 4)
  let state = seed >>> 0
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }

  for (let index = 0; index < size * size; index += 1) {
    const grain = (random() - 0.5) * variance
    const broad = Math.sin((index % size) * 0.18 + Math.floor(index / size) * 0.07) * variance * 0.12
    data[index * 4] = THREE.MathUtils.clamp(base[0] + grain + broad, 0, 255)
    data[index * 4 + 1] = THREE.MathUtils.clamp(base[1] + grain + broad, 0, 255)
    data[index * 4 + 2] = THREE.MathUtils.clamp(base[2] + grain + broad, 0, 255)
    data[index * 4 + 3] = 255
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function SurfaceMaterial({
  base,
  variance,
  repeat = [4, 4],
  roughness = 0.85,
  bumpScale = 0.012,
  seed = 1,
}: {
  base: [number, number, number]
  variance: number
  repeat?: [number, number]
  roughness?: number
  bumpScale?: number
  seed?: number
}) {
  const [red, green, blue] = base
  const texture = useMemo(
    () => makeSurfaceTexture([red, green, blue], variance, seed),
    [red, green, blue, variance, seed],
  )
  useEffect(() => () => texture.dispose(), [texture])
  texture.repeat.set(repeat[0], repeat[1])
  return <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={bumpScale} roughness={roughness} />
}

function TimberFloor() {
  const boards = Array.from({ length: 18 }, (_, index) => index)
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <SurfaceMaterial base={[132, 88, 55]} variance={22} repeat={[10, 3]} roughness={0.58} bumpScale={0.009} seed={31} />
      </mesh>
      {boards.map((index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0]} position={[-3.78 + index * 0.445, 0.003, 0]}>
          <planeGeometry args={[0.008, ROOM_D]} />
          <meshBasicMaterial color="#422a1d" transparent opacity={0.32} />
        </mesh>
      ))}
    </group>
  )
}

function ArchitecturalShell() {
  return (
    <group>
      <TimberFloor />
      <mesh receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <SurfaceMaterial base={[239, 235, 228]} variance={5} repeat={[5, 5]} roughness={0.94} bumpScale={0.006} seed={7} />
      </mesh>
      <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-4, 1.5, 0]}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <SurfaceMaterial base={[220, 214, 204]} variance={8} repeat={[7, 3]} roughness={0.93} bumpScale={0.01} seed={11} />
      </mesh>
      <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[4, 1.5, 0]}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <SurfaceMaterial base={[220, 214, 204]} variance={8} repeat={[7, 3]} roughness={0.93} bumpScale={0.01} seed={17} />
      </mesh>
      <Box size={[8, 0.12, 0.12]} position={[0, 0.06, -3.94]} color="#c7bfb3" roughness={0.9} />
      <Box size={[8, 0.12, 0.12]} position={[0, 2.94, -3.94]} color="#c7bfb3" roughness={0.9} />
    </group>
  )
}

function GlazedWall() {
  const z = -3.98
  const frame = "#1d2022"
  const bays = [-2.7, -0.9, 0.9, 2.7]
  return (
    <group>
      <Box size={[8, 0.66, 0.14]} position={[0, 0.33, z]} color="#ded8ce" roughness={0.92} />
      <Box size={[8, 0.38, 0.14]} position={[0, 2.81, z]} color="#ded8ce" roughness={0.92} />
      {[-4, -1.8, 0, 1.8, 4].map((x) => (
        <Box key={x} size={[0.065, 1.78, 0.1]} position={[x, 1.72, z + 0.02]} color={frame} roughness={0.35} metalness={0.6} />
      ))}
      {bays.map((x) => (
        <mesh key={x} position={[x, 1.72, z + 0.025]}>
          <planeGeometry args={[1.72, 1.72]} />
          <meshPhysicalMaterial color="#c8d9df" transparent opacity={0.18} roughness={0.08} transmission={0.78} thickness={0.02} />
        </mesh>
      ))}
      <Box size={[8, 0.06, 0.1]} position={[0, 0.84, z + 0.02]} color={frame} roughness={0.35} metalness={0.6} />
      <Box size={[8, 0.06, 0.1]} position={[0, 2.6, z + 0.02]} color={frame} roughness={0.35} metalness={0.6} />
      <Curtain x={-3.7} />
      <Curtain x={3.7} />
    </group>
  )
}

function Curtain({ x }: { x: number }) {
  return (
    <group position={[x, 1.7, -3.82]}>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} position={[(index - 3) * 0.075, 0, 0]} castShadow>
          <capsuleGeometry args={[0.055, 1.7, 5, 10]} />
          <meshStandardMaterial color="#b9b1a6" roughness={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

function Sofa() {
  return (
    <group position={[0.2, 0, -2.15]} rotation={[0, -0.04, 0]}>
      <RoundedBox args={[3.65, 0.42, 1.05]} radius={0.12} smoothness={4} position={[0, 0.38, 0]} castShadow receiveShadow>
        <SurfaceMaterial base={[170, 160, 146]} variance={10} repeat={[5, 3]} roughness={0.96} bumpScale={0.018} seed={41} />
      </RoundedBox>
      <RoundedBox args={[3.55, 0.88, 0.25]} radius={0.1} smoothness={4} position={[0, 0.86, -0.4]} castShadow>
        <SurfaceMaterial base={[184, 175, 161]} variance={10} repeat={[6, 2]} roughness={0.97} bumpScale={0.018} seed={43} />
      </RoundedBox>
      {[-1.32, 1.32].map((x) => (
        <RoundedBox key={x} args={[0.28, 0.62, 1.02]} radius={0.1} smoothness={4} position={[x, 0.65, 0]} castShadow>
          <meshStandardMaterial color="#a69c8e" roughness={0.97} />
        </RoundedBox>
      ))}
      {[-0.78, 0.45].map((x) => (
        <RoundedBox key={x} args={[1.08, 0.2, 0.82]} radius={0.08} smoothness={4} position={[x, 0.68, 0.05]} castShadow>
          <meshStandardMaterial color="#c7bfb3" roughness={1} />
        </RoundedBox>
      ))}
      <RoundedBox args={[0.58, 0.52, 0.16]} radius={0.08} smoothness={4} position={[-0.88, 1.03, 0.08]} rotation={[0, 0.06, 0.14]} castShadow>
        <meshStandardMaterial color="#263744" roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.48, 0.16]} radius={0.08} smoothness={4} position={[0.88, 1.01, 0.08]} rotation={[0, -0.05, -0.12]} castShadow>
        <meshStandardMaterial color="#a5532e" roughness={0.95} />
      </RoundedBox>
      {[-1.1, 1.1].map((x) => <Box key={x} size={[0.08, 0.2, 0.08]} position={[x, 0.1, 0.32]} color="#202326" metalness={0.65} roughness={0.35} />)}
    </group>
  )
}

function CoffeeTables() {
  return (
    <group position={[0.2, 0, -0.42]}>
      <mesh castShadow receiveShadow position={[-0.42, 0.4, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.075, 64]} />
        <meshStandardMaterial color="#d7d1c7" roughness={0.26} metalness={0.04} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.68, 0.32, 0.18]}>
        <cylinderGeometry args={[0.48, 0.48, 0.065, 64]} />
        <meshStandardMaterial color="#46382f" roughness={0.42} />
      </mesh>
      {[[-0.42, 0.2, 0], [0.68, 0.16, 0.18]].map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[index ? 0.27 : 0.4, index ? 0.34 : 0.48, y * 2, 48]} />
          <meshStandardMaterial color="#242729" metalness={0.55} roughness={0.38} />
        </mesh>
      ))}
      <mesh castShadow position={[-0.55, 0.53, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.22, 32]} />
        <meshStandardMaterial color="#9a704a" roughness={0.3} metalness={0.25} />
      </mesh>
    </group>
  )
}

function Rug() {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.014, -1.05]}>
      <planeGeometry args={[4.7, 3.35]} />
      <SurfaceMaterial base={[104, 105, 99]} variance={18} repeat={[8, 6]} roughness={1} bumpScale={0.024} seed={61} />
    </mesh>
  )
}

function FeatureWall() {
  return (
    <group position={[-3.86, 0, -0.45]}>
      <Box size={[0.16, 2.55, 3.95]} position={[0, 1.28, 0]} color="#78756e" roughness={0.78} />
      {[-1.75, -1.25, -0.75, -0.25, 0.25, 0.75, 1.25, 1.75].map((z) => (
        <Box key={z} size={[0.03, 2.32, 0.28]} position={[0.1, 1.28, z]} color="#5b3d2a" roughness={0.58} />
      ))}
      <Box size={[0.55, 0.48, 3.1]} position={[0.34, 0.24, 0]} color="#2d2925" roughness={0.5} />
      <mesh position={[0.2, 1.64, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.25, 1.18]} />
        <meshStandardMaterial color="#111315" roughness={0.18} metalness={0.25} />
      </mesh>
      <Box size={[0.04, 0.8, 1.55]} position={[0.17, 1.64, 0]} color="#202326" metalness={0.55} roughness={0.25} />
    </group>
  )
}

function ArtWall() {
  return (
    <group position={[3.91, 1.45, -1.15]} rotation={[0, -Math.PI / 2, 0]}>
      <Box size={[1.38, 1.05, 0.06]} position={[0, 0, 0]} color="#202326" roughness={0.4} />
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.22, 0.89]} />
        <meshStandardMaterial color="#c7ab83" roughness={0.92} />
      </mesh>
      <mesh position={[-0.22, 0.08, 0.04]} rotation={[0, 0, 0.35]}>
        <ringGeometry args={[0.16, 0.32, 48]} />
        <meshStandardMaterial color="#364a52" roughness={0.8} />
      </mesh>
      <mesh position={[0.28, -0.12, 0.045]}>
        <circleGeometry args={[0.22, 48]} />
        <meshStandardMaterial color="#a05232" roughness={0.86} />
      </mesh>
    </group>
  )
}

function LoungeChair() {
  return (
    <group position={[2.45, 0, -0.62]} rotation={[0, -0.5, 0]}>
      <RoundedBox args={[0.95, 0.22, 0.82]} radius={0.12} smoothness={4} position={[0, 0.52, 0]} rotation={[-0.12, 0, 0]} castShadow>
        <meshStandardMaterial color="#76513e" roughness={0.82} />
      </RoundedBox>
      <RoundedBox args={[0.88, 0.9, 0.2]} radius={0.1} smoothness={4} position={[0, 0.93, -0.3]} rotation={[-0.15, 0, 0]} castShadow>
        <meshStandardMaterial color="#825944" roughness={0.84} />
      </RoundedBox>
      {[-0.36, 0.36].map((x) => <Box key={x} size={[0.055, 0.53, 0.055]} position={[x, 0.26, 0.18]} rotation={[0.08, 0, x < 0 ? -0.08 : 0.08]} color="#232527" metalness={0.72} roughness={0.3} />)}
    </group>
  )
}

function Plant() {
  return (
    <group position={[3.18, 0, -2.92]}>
      <mesh castShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.28, 0.21, 0.62, 32]} />
        <meshStandardMaterial color="#3d3b38" roughness={0.75} />
      </mesh>
      {Array.from({ length: 11 }, (_, index) => {
        const angle = (index / 11) * Math.PI * 2
        const radius = 0.18 + (index % 3) * 0.09
        return (
          <mesh key={index} castShadow position={[Math.cos(angle) * radius, 0.85 + (index % 4) * 0.18, Math.sin(angle) * radius]} rotation={[0.2, -angle, Math.cos(angle) * 0.65]}>
            <sphereGeometry args={[0.16, 18, 10]} />
            <meshStandardMaterial color={index % 2 ? "#3f5b3c" : "#546b46"} roughness={0.96} />
          </mesh>
        )
      })}
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
      <ArchitecturalShell />
      <GlazedWall />
      <FeatureWall />
      <ArtWall />
      <Rug />
      <Sofa />
      <CoffeeTables />
      <LoungeChair />
      <Plant />
      {lights.map((light) => (
        <CeilingLight key={light.id} light={light} bodyColor={bodyColor} selected={light.id === selectedId} onSelect={onSelect} />
      ))}
    </group>
  )
}
