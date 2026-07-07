"use client"

import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense, useMemo, useState } from "react"
import * as THREE from "three"
import { LightControls } from "./light-controls"
import { OutdoorEnvironment } from "./outdoor-environment"
import { RoomScene } from "./room-scene"
import { computeDaylight } from "@/lib/daylight"
import {
  DEFAULT_LAYOUT,
  DEFAULT_LIGHTS,
  LAYOUTS,
  type BodyColor,
  type LayoutId,
  type LightState,
} from "@/lib/lights"

export function LightingStudio() {
  const [layoutId, setLayoutId] = useState<LayoutId>(DEFAULT_LAYOUT)
  const [lights, setLights] = useState<LightState[]>(DEFAULT_LIGHTS.map((l) => ({ ...l })))
  const [bodyColor, setBodyColor] = useState<BodyColor>("white")
  const [selectedId, setSelectedId] = useState<string | null>(DEFAULT_LIGHTS[1].id)
  const [timeOfDay, setTimeOfDay] = useState(19) // start at early evening so lamps + sky both read

  const day = useMemo(() => computeDaylight(timeOfDay), [timeOfDay])

  function updateLight(id: string, patch: Partial<LightState>) {
    setLights((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  function applyAll(patch: Partial<LightState>) {
    setLights((prev) => prev.map((l) => ({ ...l, ...patch })))
  }

  function toggleAll(on: boolean) {
    setLights((prev) => prev.map((l) => ({ ...l, on })))
  }

  function changeLayout(id: LayoutId) {
    const next = LAYOUTS.find((l) => l.id === id)
    if (!next) return
    setLayoutId(id)
    const fresh = next.lights.map((l) => ({ ...l }))
    setLights(fresh)
    setSelectedId(fresh[0]?.id ?? null)
  }

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-neutral-950 lg:flex-row">
      {/* 3D viewport */}
      <div className="relative min-h-0 flex-1">
        <Canvas
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
          dpr={[1, 2]}
        >
          <color attach="background" args={[day.backgroundColor]} />
          <PerspectiveCamera makeDefault position={[0, 1.5, 3.4]} fov={62} />
          <OrbitControls
            target={[0, 1.1, -1.5]}
            enablePan={false}
            minDistance={1.5}
            maxDistance={6}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={0.2}
          />

          {/* faint ambient so a fully-dark room still shows silhouettes */}
          <ambientLight intensity={day.ambientIntensity} />

          <Suspense fallback={null}>
            {/* the world outside the windows: sky, sun, moon, stars */}
            <OutdoorEnvironment day={day} />
            {/* interior reflections for PBR materials, brightness follows daylight */}
            <Environment preset="apartment" environmentIntensity={day.envIntensity} />
            <RoomScene lights={lights} bodyColor={bodyColor} selectedId={selectedId} onSelect={setSelectedId} />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute left-4 top-4 rounded-lg bg-black/50 px-3 py-1.5 text-xs text-neutral-300 backdrop-blur">
          Modern Living Room · {day.label} · real-time relight
        </div>
      </div>

      {/* control panel */}
      <aside className="h-[52vh] w-full shrink-0 border-t border-neutral-800 bg-neutral-950 lg:h-full lg:w-[340px] lg:border-l lg:border-t-0">
        <LightControls
          lights={lights}
          selectedId={selectedId}
          timeOfDay={timeOfDay}
          dayLabel={day.label}
          layoutId={layoutId}
          bodyColor={bodyColor}
          onLayoutChange={changeLayout}
          onBodyColorChange={setBodyColor}
          onTimeChange={setTimeOfDay}
          onSelect={setSelectedId}
          onUpdate={updateLight}
          onToggleAll={toggleAll}
          onApplyAll={applyAll}
        />
      </aside>
    </main>
  )
}
