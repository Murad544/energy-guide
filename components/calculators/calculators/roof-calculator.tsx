"use client";
import { useState } from "react";
import { CalcField } from "@/components/calculators/calc-field";
import { CalcOutputTile } from "@/components/calculators/calc-output-tile";
import { CalcShell } from "@/components/calculators/calc-shell";
import { Input } from "@/components/ui/input";
import { calculatorCopy as copy } from "@/lib/copy/az";
import { calculateRoof } from "@/lib/formulas/roof";
import { formatNumberAz } from "@/lib/utils";

export function RoofCalculator() {
  const [area, setArea] = useState(45);
  const [panel, setPanel] = useState(450);
  const [factor, setFactor] = useState(0.95);
  const result = calculateRoof(area, panel, factor);
  return (
    <CalcShell title={copy.roofTitle} description={copy.roofText}>
      <div className="grid gap-5 md:grid-cols-5">
        <CalcField label={copy.area}>
          <Input
            type="number"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
          />
        </CalcField>
        <CalcField label={copy.panelPower}>
          <Input
            type="number"
            value={panel}
            onChange={(e) => setPanel(Number(e.target.value))}
          />
        </CalcField>
        <CalcField label={copy.orientation}>
          <Input
            type="number"
            step="0.05"
            value={factor}
            onChange={(e) => setFactor(Number(e.target.value))}
          />
        </CalcField>
        <CalcOutputTile
          label={copy.panelCount}
          value={`${result.maxPanels} ${copy.panels}`}
        />
        <CalcOutputTile
          label={copy.effectivePower}
          value={`${formatNumberAz(result.effectiveKw)} kVt`}
        />
      </div>
    </CalcShell>
  );
}
