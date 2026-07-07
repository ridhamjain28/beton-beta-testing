"use client"

import { FlashlightIcon, LayoutGrid, Lightbulb, LightbulbOff, Moon, Power, Sun, Sunrise, Sunset, Zap } from "lucide-react"
import { kelvinLabel, kelvinToCss } from "@/lib/color-temperature"
import {
  BEAM_MAX,
  BEAM_MIN,
  BEAM_PRESETS,
  KELVIN_MAX,
  KELVIN_MIN,
  LAYOUTS,
  LUMENS_PER_WATT,
  WATT_MAX,
  WATT_MIN,
  WATT_PRESETS,
  type BodyColor,
  type LayoutId,
  type LightState,
} from "@/lib/lights"
import { cn } from "@/lib/utils"

function beamLabel(deg: number): string {
  if (deg <= 20) return "Spot"
  if (deg <= 30) return "Narrow"
  if (deg <= 45) return "Medium"
  return "Flood"
}

type Props = {
  lights: LightState[]
  selectedId: string | null
  timeOfDay: number
  dayLabel: string
  layoutId: LayoutId
  bodyColor: BodyColor
  onLayoutChange: (id: LayoutId) => void
  onBodyColorChange: (c: BodyColor) => void
  onTimeChange: (t: number) => void
  onSelect: (id: string) => void
  onUpdate: (id: string, patch: Partial<LightState>) => void
  onToggleAll: (on: boolean) => void
  onApplyAll: (patch: Partial<LightState>) => void
}

const TIME_PRESETS: { label: string; time: number; icon: typeof Sun }[] = [
  { label: "Dawn", time: 6, icon: Sunrise },
  { label: "Midday", time: 13, icon: Sun },
  { label: "Sunset", time: 18.5, icon: Sunset },
  { label: "Night", time: 23, icon: Moon },
]

function formatClock(t: number) {
  const h = Math.floor(t)
  const m = Math.round((t - h) * 60)
  const period = h < 12 ? "AM" : "PM"
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${m.toString().padStart(2, "0")} ${period}`
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
  trackColor,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  trackColor?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
      style={{
        background: `linear-gradient(to right, ${trackColor ?? "#e5e5e5"} ${pct}%, #3f3f46 ${pct}%)`,
      }}
    />
  )
}

export function LightControls({
  lights,
  selectedId,
  timeOfDay,
  dayLabel,
  layoutId,
  bodyColor,
  onLayoutChange,
  onBodyColorChange,
  onTimeChange,
  onSelect,
  onUpdate,
  onToggleAll,
  onApplyAll,
}: Props) {
  const selected = lights.find((l) => l.id === selectedId) ?? null
  const allOn = lights.every((l) => l.on)

  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-y-auto p-5 text-neutral-100">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-balance">Light Studio</h1>
          <p className="text-sm leading-relaxed text-neutral-400">
            Preview how your ceiling lights will actually look. Drag to orbit the room.
          </p>
        </div>
        <button
          onClick={() => onToggleAll(!allOn)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
            allOn
              ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
              : "border-neutral-700 bg-neutral-800 text-neutral-300",
          )}
        >
          <Power className="size-3.5" />
          {allOn ? "All On" : "All Off"}
        </button>
      </header>

      {/* outdoor light / time of day */}
      <section className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Sun className="size-4 text-amber-300" /> Outside Light
          </span>
          <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
            {dayLabel} · {formatClock(timeOfDay)}
          </span>
        </div>

        <Slider
          value={timeOfDay}
          min={0}
          max={24}
          step={0.25}
          onChange={onTimeChange}
          trackColor="#60a5fa"
        />
        <div className="flex justify-between text-[10px] uppercase tracking-wide text-neutral-500">
          <span>12 AM</span>
          <span>Noon</span>
          <span>12 AM</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {TIME_PRESETS.map((p) => {
            const Icon = p.icon
            const active = Math.abs(timeOfDay - p.time) < 0.75
            return (
              <button
                key={p.label}
                onClick={() => onTimeChange(p.time)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "border-neutral-400 bg-neutral-800 text-neutral-100"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700",
                )}
              >
                <Icon className="size-4" />
                {p.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* layout + fixture body */}
      <section className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <LayoutGrid className="size-4 text-sky-300" /> Fixture Layout
        </span>
        <div className="grid grid-cols-2 gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => onLayoutChange(l.id)}
              className={cn(
                "flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors",
                layoutId === l.id
                  ? "border-neutral-400 bg-neutral-800 text-neutral-100"
                  : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700",
              )}
            >
              <span className="text-sm font-medium">{l.name}</span>
              <span className="text-[11px] text-neutral-500">{l.description}</span>
            </button>
          ))}
        </div>

        <span className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-500">Body Color</span>
        <div className="grid grid-cols-2 gap-2">
          {(["white", "black"] as BodyColor[]).map((c) => (
            <button
              key={c}
              onClick={() => onBodyColorChange(c)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                bodyColor === c
                  ? "border-neutral-400 bg-neutral-800 text-neutral-100"
                  : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700",
              )}
            >
              <span
                className="size-4 rounded-full border border-neutral-600"
                style={{ background: c === "white" ? "#f4f4f2" : "#0b0b0b" }}
              />
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* fixture selector */}
      <section className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">Fixtures</span>
        <div className="grid grid-cols-1 gap-2">
          {lights.map((light) => (
            <button
              key={light.id}
              onClick={() => onSelect(light.id)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                light.id === selectedId
                  ? "border-neutral-400 bg-neutral-800"
                  : "border-neutral-800 bg-neutral-900 hover:border-neutral-700",
              )}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="grid size-7 place-items-center rounded-full"
                  style={{
                    background: light.on ? kelvinToCss(light.kelvin) : "#3f3f46",
                    boxShadow: light.on ? `0 0 12px 1px ${kelvinToCss(light.kelvin)}` : "none",
                  }}
                >
                  {light.on ? (
                    <Lightbulb className="size-3.5 text-neutral-900" />
                  ) : (
                    <LightbulbOff className="size-3.5 text-neutral-400" />
                  )}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{light.name}</span>
                  <span className="text-xs text-neutral-500">
                    {light.on ? `${light.kelvin}K · ${light.wattage}W · ${light.brightness}%` : "Off"}
                  </span>
                </span>
              </span>
              <span
                role="switch"
                aria-checked={light.on}
                onClick={(e) => {
                  e.stopPropagation()
                  onUpdate(light.id, { on: !light.on })
                }}
                className={cn(
                  "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                  light.on ? "bg-amber-400" : "bg-neutral-700",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-4 rounded-full bg-white transition-transform",
                    light.on ? "translate-x-4" : "translate-x-0.5",
                  )}
                />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* selected fixture controls */}
      {selected && (
        <section className="flex flex-col gap-5 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{selected.name}</span>
            <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
              {kelvinLabel(selected.kelvin)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-300">Color Temperature</span>
              <span className="tabular-nums text-neutral-400">{selected.kelvin}K</span>
            </div>
            <Slider
              value={selected.kelvin}
              min={KELVIN_MIN}
              max={KELVIN_MAX}
              step={50}
              onChange={(v) => onUpdate(selected.id, { kelvin: v })}
              trackColor={kelvinToCss(selected.kelvin)}
            />
            <div className="flex justify-between text-[10px] uppercase tracking-wide text-neutral-500">
              <span>Warm</span>
              <span>Cool</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                <Sun className="size-3.5" /> Brightness
              </span>
              <span className="tabular-nums text-neutral-400">{selected.brightness}%</span>
            </div>
            <Slider
              value={selected.brightness}
              min={0}
              max={100}
              step={1}
              onChange={(v) => onUpdate(selected.id, { brightness: v })}
              trackColor="#fbbf24"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                <Zap className="size-3.5" /> Wattage
              </span>
              <span className="tabular-nums text-neutral-400">
                ≈ {Math.round(selected.wattage * LUMENS_PER_WATT)} lm
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={WATT_MIN}
                max={WATT_MAX}
                step={1}
                value={selected.wattage}
                onChange={(e) => {
                  const raw = Number(e.target.value)
                  if (Number.isNaN(raw)) return
                  const clamped = Math.min(WATT_MAX, Math.max(WATT_MIN, raw))
                  onUpdate(selected.id, { wattage: clamped })
                }}
                className="w-20 rounded-md border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-sm tabular-nums text-neutral-100 outline-none focus:border-neutral-500"
                aria-label="Wattage in watts"
              />
              <span className="text-sm text-neutral-400">W</span>
              <div className="ml-auto flex gap-1.5">
                {WATT_PRESETS.map((w) => (
                  <button
                    key={w}
                    onClick={() => onUpdate(selected.id, { wattage: w })}
                    className={cn(
                      "rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
                      selected.wattage === w
                        ? "border-neutral-400 bg-neutral-800 text-neutral-100"
                        : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700",
                    )}
                  >
                    {w}W
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                <FlashlightIcon className="size-3.5" /> Beam Angle
              </span>
              <span className="tabular-nums text-neutral-400">
                {selected.beamAngle}° · {beamLabel(selected.beamAngle)}
              </span>
            </div>
            <Slider
              value={selected.beamAngle}
              min={BEAM_MIN}
              max={BEAM_MAX}
              step={1}
              onChange={(v) => onUpdate(selected.id, { beamAngle: v })}
              trackColor="#a3a3a3"
            />
            <div className="mt-1 grid grid-cols-4 gap-2">
              {BEAM_PRESETS.map((deg) => (
                <button
                  key={deg}
                  onClick={() => onUpdate(selected.id, { beamAngle: deg })}
                  className={cn(
                    "rounded-md border py-1.5 text-[11px] font-medium transition-colors",
                    selected.beamAngle === deg
                      ? "border-neutral-400 bg-neutral-800 text-neutral-100"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700",
                  )}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() =>
              onApplyAll({
                kelvin: selected.kelvin,
                brightness: selected.brightness,
                wattage: selected.wattage,
                beamAngle: selected.beamAngle,
              })
            }
            className="rounded-md border border-neutral-700 bg-neutral-800 py-2 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            Apply this setting to all fixtures
          </button>
        </section>
      )}
    </div>
  )
}
