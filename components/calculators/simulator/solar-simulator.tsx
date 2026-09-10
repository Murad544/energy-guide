"use client";
import { useState } from "react";
import { CalcShell } from "@/components/calculators/calc-shell";
import { DiagramSvg } from "@/components/calculators/simulator/diagram-svg";
import { calculatorCopy as copy } from "@/lib/copy/az";

type Mode = "onGrid" | "offGrid" | "hybrid";
export function SolarSimulator() {
  const [mode, setMode] = useState<Mode>("hybrid");
  const modes: Mode[] = ["onGrid", "offGrid", "hybrid"];
  return (
    <CalcShell title={copy.simulatorTitle} description={copy.simulatorText}>
      <div className="mb-6 flex flex-wrap gap-2">
        {modes.map((item) => (
          <button
            className={
              item === mode
                ? "bg-ink px-4 py-2 text-sm text-paper"
                : "border px-4 py-2 text-sm"
            }
            key={item}
            onClick={() => setMode(item)}
            type="button"
          >
            {copy.modes[item]}
          </button>
        ))}
      </div>
      <DiagramSvg mode={mode} />
      <p className="mt-5 border-l-2 border-teal pl-4 leading-7 text-ink-soft">
        {copy.modeInfo[mode]}
      </p>
    </CalcShell>
  );
}
