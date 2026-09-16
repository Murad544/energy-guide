"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { CalcShell } from "@/components/calculators/calc-shell";
import { calculatorCopy as copy } from "@/lib/copy/az";
import { formatNumberAz } from "@/lib/utils";
import { parts, simulate, type Mode, type Part } from "./simulation";

const SolarScene = dynamic(() => import("./solar-scene"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="grid h-[320px] place-items-center rounded-xl bg-ink text-white sm:h-[420px]"
    >
      3D model yüklənir…
    </div>
  ),
});
const format = (value: number) => `${formatNumberAz(value)} kVt`;

export function SolarSimulator() {
  const [mode, setMode] = useState<Mode>("hybrid");
  const [sunlight, setSunlight] = useState(80);
  const [demand, setDemand] = useState(2);
  const [batteryAvailable, setBatteryAvailable] = useState(true);
  const [selected, setSelected] = useState<Part>("panel");
  const [paused, setPaused] = useState(false);
  const [view, setView] = useState(0);
  const energy = simulate(mode, sunlight, demand, batteryAvailable);
  const visibleParts = (Object.keys(parts) as Part[]).filter(
    (part) =>
      !(part === "battery" && mode === "onGrid") &&
      !(part === "grid" && mode === "offGrid"),
  );
  function changeMode(next: Mode) {
    setMode(next);
    if (
      (next === "onGrid" && selected === "battery") ||
      (next === "offGrid" && selected === "grid")
    )
      setSelected("panel");
  }
  return (
    <CalcShell
      title="3D enerji simulyatoru"
      description="Sistemi fırladın, komponentləri seçin və işıqla enerji tələbatını dəyişərək enerji axınını izləyin."
    >
      <div
        className="mb-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Sistem növü"
      >
        {(["onGrid", "offGrid", "hybrid"] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={mode === item}
            onClick={() => changeMode(item)}
            className="min-h-11 rounded-full border px-4 py-2 text-sm transition-colors hover:border-teal aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
          >
            {copy.modes[item]}
          </button>
        ))}
      </div>
      <SolarScene
        mode={mode}
        energy={energy}
        selected={selected}
        onSelect={setSelected}
        paused={paused}
        view={view}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs leading-5 text-ink-soft">
          Fırlatmaq üçün sürükləyin · Yaxınlaşdırmaq üçün sürüşdürün və ya iki
          barmaqdan istifadə edin
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="min-h-11 rounded-lg border px-3 text-xs font-medium hover:bg-paper-dim"
            onClick={() => setView((value) => value + 1)}
          >
            Görünüşü sıfırla
          </button>
          <button
            type="button"
            aria-pressed={paused}
            className="min-h-11 rounded-lg border px-3 text-xs font-medium hover:bg-paper-dim"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? "Animasiyanı davam etdir" : "Animasiyanı dayandır"}
          </button>
        </div>
      </div>
      <div
        className="mt-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Komponent seçimi"
      >
        {visibleParts.map((part) => (
          <button
            key={part}
            type="button"
            aria-pressed={selected === part}
            aria-controls="component-description"
            onClick={() => setSelected(part)}
            className="min-h-11 rounded-lg border px-4 text-sm hover:border-teal aria-pressed:border-teal aria-pressed:bg-paper-dim aria-pressed:text-teal"
          >
            {parts[part].label}
          </button>
        ))}
      </div>
      <div
        id="component-description"
        aria-live="polite"
        className="mt-3 min-h-28 rounded-xl bg-paper-dim/60 p-5"
      >
        <h3 className="font-semibold">{parts[selected].label}</h3>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          {parts[selected].text}
        </p>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="sim-sunlight"
            className="flex justify-between gap-2 text-sm font-semibold"
          >
            <span>Günəş işığı</span>
            <span>{sunlight}%</span>
          </label>
          <input
            id="sim-sunlight"
            type="range"
            min="0"
            max="100"
            step="5"
            value={sunlight}
            onChange={(event) => setSunlight(Number(event.target.value))}
            className="mt-3 h-8 w-full accent-teal"
          />
          <div className="flex justify-between text-xs text-ink-soft">
            <span>Gecə</span>
            <span>Tam günəş</span>
          </div>
        </div>
        <div>
          <label
            htmlFor="sim-demand"
            className="flex justify-between gap-2 text-sm font-semibold"
          >
            <span>Evin tələbatı</span>
            <span>{format(demand)}</span>
          </label>
          <input
            id="sim-demand"
            type="range"
            min="0"
            max="6"
            step="0.5"
            value={demand}
            onChange={(event) => setDemand(Number(event.target.value))}
            className="mt-3 h-8 w-full accent-teal"
          />
          <div className="flex justify-between text-xs text-ink-soft">
            <span>0 kVt</span>
            <span>6 kVt</span>
          </div>
        </div>
      </div>
      {mode !== "onGrid" && (
        <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={batteryAvailable}
            onChange={(event) => setBatteryAvailable(event.target.checked)}
            className="h-5 w-5 rounded accent-teal"
          />
          Batareyada istifadə edilə bilən enerji var
        </label>
      )}
      <dl
        className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-label="Enerji göstəriciləri"
      >
        {[
          ["Günəş istehsalı", format(energy.solar)],
          ["Evə verilən güc", format(energy.supplied)],
          [
            energy.discharge > 0 ? "Batareyadan" : "Batareyaya",
            mode === "onGrid"
              ? "Qoşulmayıb"
              : format(energy.discharge || energy.charge),
          ],
          [
            energy.imported > 0 ? "Şəbəkədən" : "Şəbəkəyə",
            mode === "offGrid"
              ? "Qoşulmayıb"
              : format(energy.imported || energy.exported),
          ],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border p-4">
            <dt className="text-xs text-ink-soft">{label}</dt>
            <dd className="mt-2 text-lg font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <div role="status" className="mt-4 text-sm leading-6 text-teal">
        {energy.unmet > 0
          ? `Təmin edilməyən tələbat: ${format(energy.unmet)}. İşığı artırın və ya tələbatı azaldın.`
          : energy.curtailed > 0
            ? `İstifadə olunmayan günəş gücü: ${format(energy.curtailed)}.`
            : demand === 0
              ? "Evin hazırda enerji tələbatı yoxdur."
              : "Evin enerji tələbatı tam təmin olunur."}
      </div>
      <p className="mt-5 border-l-2 border-teal pl-4 text-sm leading-7 text-ink-soft">
        {copy.modeInfo[mode]}
      </p>
      <p className="mt-4 text-xs leading-6 text-ink-soft">
        Sadələşdirilmiş tədris modeli: 5 kVt panel sistemi, maksimum 2 kVt
        batareya gücü. İtkilər və batareyanın zamanla dolması və boşalması
        hesablanmır; batareyanın enerji vəziyyətini özünüz seçirsiniz.
        Azaldılmış hərəkət seçiminiz varsa, axın animasiyası söndürülür.
      </p>
    </CalcShell>
  );
}
