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
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-hairline [&::-webkit-slider-thumb]:bg-brand-white [&::-webkit-slider-thumb]:shadow"
      style={{
        background: `linear-gradient(to right, ${trackColor ?? "#264796"} ${pct}%, #d9dee8 ${pct}%)`,
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
    <div className="flex h-full w-full flex-col gap-5 overflow-y-auto p-5 text-brand-ink">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-brand-cobalt">Light Studio</h1>
          <p className="text-xs leading-relaxed text-brand-body mt-0.5">
            Preview how your ceiling lights will actually look. Drag to orbit the room.
          </p>
        </div>
        <button
          onClick={() => onToggleAll(!allOn)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
            allOn
              ? "border-brand-orange bg-brand-orange text-brand-white hover:bg-brand-orange/90"
              : "border-brand-hairline bg-brand-surface-soft text-brand-body hover:bg-brand-hairline/40",
          )}
        >
          <Power className="size-3.5" />
          {allOn ? "All On" : "All Off"}
        </button>
      </header>

      {/* outdoor light / time of day */}
      <section className="flex flex-col gap-3 rounded border border-brand-hairline bg-brand-surface-soft p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-bold text-brand-cobalt">
            <Sun className="size-4 text-brand-orange" /> Outside Light
          </span>
          <span className="rounded-full bg-brand-surface-blue-soft px-2.5 py-0.5 text-xs font-semibold text-brand-cobalt">
            {dayLabel} · {formatClock(timeOfDay)}
          </span>
        </div>

        <Slider
          value={timeOfDay}
          min={0}
          max={24}
          step={0.25}
          onChange={onTimeChange}
          trackColor="#264796"
        />
        <div className="flex justify-between text-[10px] uppercase font-semibold tracking-wider text-brand-muted">
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
                  "flex flex-col items-center gap-1 rounded border px-1 py-2 text-[11px] font-semibold transition-colors cursor-pointer",
                  active
                    ? "border-brand-cobalt bg-brand-surface-blue-soft text-brand-cobalt"
                    : "border-brand-hairline bg-brand-white text-brand-body hover:border-brand-cobalt/40",
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
      <section className="flex flex-col gap-3 rounded border border-brand-hairline bg-brand-surface-soft p-4">
        <span className="flex items-center gap-1.5 text-sm font-bold text-brand-cobalt">
          <LayoutGrid className="size-4 text-brand-orange" /> Fixture Layout
        </span>
        <div className="grid grid-cols-2 gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => onLayoutChange(l.id)}
              className={cn(
                "flex flex-col items-start gap-0.5 rounded border px-3 py-2 text-left transition-colors cursor-pointer",
                layoutId === l.id
                  ? "border-brand-cobalt bg-brand-surface-blue-soft text-brand-cobalt"
                  : "border-brand-hairline bg-brand-white text-brand-body hover:border-brand-cobalt/40",
              )}
            >
              <span className="text-sm font-bold">{l.name}</span>
              <span className="text-[11px] text-brand-muted">{l.description}</span>
            </button>
          ))}
        </div>

        <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-brand-muted">Body Color</span>
        <div className="grid grid-cols-2 gap-2">
          {(["white", "black"] as BodyColor[]).map((c) => (
            <button
              key={c}
              onClick={() => onBodyColorChange(c)}
              className={cn(
                "flex items-center justify-center gap-2 rounded border px-3 py-2 text-sm font-semibold capitalize transition-colors cursor-pointer",
                bodyColor === c
                  ? "border-brand-cobalt bg-brand-surface-blue-soft text-brand-cobalt"
                  : "border-brand-hairline bg-brand-white text-brand-body hover:border-brand-cobalt/40",
              )}
            >
              <span
                className="size-4 rounded-full border border-brand-hairline"
                style={{ background: c === "white" ? "#FEFEFE" : "#111827" }}
              />
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* fixture selector */}
      <section className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">Fixtures</span>
        <div className="grid grid-cols-1 gap-2">
          {lights.map((light) => (
            <button
              key={light.id}
              onClick={() => onSelect(light.id)}
              className={cn(
                "flex items-center justify-between gap-3 rounded border px-3 py-2.5 text-left transition-colors cursor-pointer",
                light.id === selectedId
                  ? "border-brand-cobalt bg-brand-surface-blue-soft"
                  : "border-brand-hairline bg-brand-white hover:border-brand-cobalt/40",
              )}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="grid size-7 place-items-center rounded-full"
                  style={{
                    background: light.on ? kelvinToCss(light.kelvin) : "#6B7280",
                    boxShadow: light.on ? `0 0 10px 1px ${kelvinToCss(light.kelvin)}` : "none",
                  }}
                >
                  {light.on ? (
                    <Lightbulb className="size-3.5 text-brand-ink" />
                  ) : (
                    <LightbulbOff className="size-3.5 text-brand-white" />
                  )}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-brand-ink">{light.name}</span>
                  <span className="text-xs text-brand-body">
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
                  "relative h-5 w-9 shrink-0 rounded-full transition-colors cursor-pointer",
                  light.on ? "bg-brand-orange" : "bg-brand-hairline",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-4 rounded-full bg-brand-white transition-transform",
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
        <section className="flex flex-col gap-5 rounded border border-brand-hairline bg-brand-surface-soft p-4">
          <div className="flex items-center justify-between border-b border-brand-hairline pb-2.5">
            <span className="text-sm font-bold text-brand-cobalt">{selected.name}</span>
            <span className="rounded-full bg-brand-surface-blue-soft px-2.5 py-0.5 text-xs font-semibold text-brand-cobalt">
              {kelvinLabel(selected.kelvin)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-body">Color Temperature</span>
              <span className="tabular-nums font-semibold text-brand-ink">{selected.kelvin}K</span>
            </div>
            <Slider
              value={selected.kelvin}
              min={KELVIN_MIN}
              max={KELVIN_MAX}
              step={50}
              onChange={(v) => onUpdate(selected.id, { kelvin: v })}
              trackColor={kelvinToCss(selected.kelvin)}
            />
            <div className="flex justify-between text-[10px] uppercase font-semibold tracking-wider text-brand-muted">
              <span>Warm</span>
              <span>Cool</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-brand-body">
                <Sun className="size-3.5" /> Brightness
              </span>
              <span className="tabular-nums font-semibold text-brand-ink">{selected.brightness}%</span>
            </div>
            <Slider
              value={selected.brightness}
              min={0}
              max={100}
              step={1}
              onChange={(v) => onUpdate(selected.id, { brightness: v })}
              trackColor="#FECC00"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-brand-body">
                <Zap className="size-3.5" /> Wattage
              </span>
              <span className="tabular-nums font-semibold text-brand-ink">
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
                className="w-16 rounded border border-brand-hairline bg-brand-white px-2 py-1 text-xs tabular-nums text-brand-ink outline-none focus:border-brand-cobalt"
                aria-label="Wattage in watts"
              />
              <span className="text-xs text-brand-body font-semibold">W</span>
              <div className="ml-auto flex gap-1">
                {WATT_PRESETS.map((w) => (
                  <button
                    key={w}
                    onClick={() => onUpdate(selected.id, { wattage: w })}
                    className={cn(
                      "rounded border px-2 py-1 text-[11px] font-semibold transition-colors cursor-pointer",
                      selected.wattage === w
                        ? "border-brand-cobalt bg-brand-surface-blue-soft text-brand-cobalt"
                        : "border-brand-hairline bg-brand-white text-brand-body hover:border-brand-cobalt/40",
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
              <span className="flex items-center gap-1.5 font-semibold text-brand-body">
                <FlashlightIcon className="size-3.5" /> Beam Angle
              </span>
              <span className="tabular-nums font-semibold text-brand-ink">
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
                    "rounded border py-1 text-[11px] font-semibold transition-colors cursor-pointer",
                    selected.beamAngle === deg
                      ? "border-brand-cobalt bg-brand-surface-blue-soft text-brand-cobalt"
                      : "border-brand-hairline bg-brand-white text-brand-body hover:border-brand-cobalt/40",
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
            className="rounded border border-brand-cobalt bg-brand-surface-blue-soft py-2 text-xs font-bold text-brand-cobalt transition-colors hover:bg-brand-cobalt hover:text-brand-white cursor-pointer"
          >
            Apply this setting to all fixtures
          </button>
        </section>
      )}
    </div>
  )
}
