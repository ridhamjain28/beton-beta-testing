"use client"

import { ContactShadows, Environment, Html, OrbitControls, PerspectiveCamera, useProgress } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Bloom, EffectComposer, N8AO, Vignette } from "@react-three/postprocessing"
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
    <main className="flex h-screen min-w-[1100px] overflow-hidden bg-neutral-950">
      {/* 3D viewport */}
      <div className="relative min-h-0 flex-1">
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.88,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          dpr={[1, 1.75]}
          camera={{ near: 0.1, far: 80 }}
        >
          <color attach="background" args={[day.backgroundColor]} />
          <PerspectiveCamera makeDefault position={[3.15, 1.58, 3.5]} fov={55} />
          <OrbitControls
            target={[0, 1.15, -1.15]}
            enablePan={false}
            minDistance={4.2}
            maxDistance={6.1}
            minAzimuthAngle={-0.3}
            maxAzimuthAngle={1.28}
            maxPolarAngle={Math.PI / 2 - 0.12}
            minPolarAngle={0.72}
          />

          {/* faint ambient so a fully-dark room still shows silhouettes */}
          <ambientLight intensity={day.ambientIntensity} />

          <Suspense fallback={<SceneLoader />}>
            {/* the world outside the windows: sky, sun, moon, stars */}
            <OutdoorEnvironment day={day} />
            {/* interior reflections for PBR materials, brightness follows daylight */}
            <Environment preset="apartment" environmentIntensity={day.envIntensity} />
            <RoomScene lights={lights} bodyColor={bodyColor} selectedId={selectedId} onSelect={setSelectedId} />
            <ContactShadows
              position={[0, 0.018, -0.8]}
              scale={8}
              opacity={0.28}
              blur={2.6}
              far={3.2}
              resolution={1024}
              color="#241b16"
            />
          </Suspense>
          <EffectComposer multisampling={4} enableNormalPass>
            <N8AO aoRadius={0.55} intensity={0.75} distanceFalloff={0.65} color="#17120f" />
            <Bloom luminanceThreshold={1.35} luminanceSmoothing={0.3} intensity={0.09} mipmapBlur />
            <Vignette offset={0.38} darkness={0.24} eskil={false} />
          </EffectComposer>
        </Canvas>

        <div className="pointer-events-none absolute left-5 top-5 border border-white/15 bg-black/55 px-4 py-2 text-xs font-medium tracking-wide text-neutral-200 backdrop-blur-sm">
          Residence 01 · Living room · {day.label}
        </div>
        <div className="pointer-events-none absolute bottom-5 left-5 max-w-sm border-l-2 border-brand-orange bg-black/55 px-4 py-3 text-xs leading-relaxed text-neutral-300 backdrop-blur-sm">
          Visual preview only. Perceived brightness varies by room finish, fixture specification and screen calibration.
        </div>
      </div>

      {/* control panel */}
      <aside className="h-full w-[360px] shrink-0 border-l border-brand-hairline bg-brand-white">
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

function SceneLoader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="w-52 border border-white/15 bg-black/70 p-4 text-center text-xs uppercase tracking-[0.14em] text-white">
        Preparing room {Math.round(progress)}%
      </div>
    </Html>
  )
}
