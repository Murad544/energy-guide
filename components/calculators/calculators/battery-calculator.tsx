"use client";
import { useState } from "react";
import { CalcField } from "@/components/calculators/calc-field";
import { CalcOutputTile } from "@/components/calculators/calc-output-tile";
import { CalcShell } from "@/components/calculators/calc-shell";
import { Input } from "@/components/ui/input";
import { calculatorCopy as copy } from "@/lib/copy/az";
import { calculateBattery } from "@/lib/formulas/battery";
import { formatNumberAz } from "@/lib/utils";

export function BatteryCalculator() {
  const [load, setLoad] = useState(8);
  const [days, setDays] = useState(1);
  const [dod, setDod] = useState(0.85);
  const result = calculateBattery(load, days, dod);
  return (
    <CalcShell title={copy.batteryTitle} description={copy.batteryText}>
      <div className="grid gap-5 md:grid-cols-5">
        <CalcField label={copy.dailyLoad}>
          <Input
            type="number"
            value={load}
            onChange={(e) => setLoad(Number(e.target.value))}
          />
        </CalcField>
        <CalcField label={copy.autonomy}>
          <Input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </CalcField>
        <CalcField label={copy.dod}>
          <Input
            type="number"
            step="0.05"
            value={dod}
            onChange={(e) => setDod(Number(e.target.value))}
          />
        </CalcField>
        <CalcOutputTile
          label={copy.capacity}
          value={`${formatNumberAz(result.capacityKwh)} kVt·s`}
        />
        <CalcOutputTile
          label={copy.estimate}
          value={`$${formatNumberAz(result.priceUsd, 0)}`}
        />
      </div>
    </CalcShell>
  );
}
