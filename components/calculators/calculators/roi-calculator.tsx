"use client";
import { useState } from "react";
import { CalcField } from "@/components/calculators/calc-field";
import { CalcOutputTile } from "@/components/calculators/calc-output-tile";
import { CalcShell } from "@/components/calculators/calc-shell";
import { Input } from "@/components/ui/input";
import { calculatorCopy as copy } from "@/lib/copy/az";
import { calculateRoi } from "@/lib/formulas/roi";
import { formatNumberAz } from "@/lib/utils";

export function RoiCalculator() {
  const [cost, setCost] = useState(7000);
  const [saving, setSaving] = useState(120);
  const [rate, setRate] = useState(1.7);
  const result = calculateRoi(cost, saving, rate);
  return (
    <CalcShell title={copy.roiTitle} description={copy.roiText}>
      <div className="grid gap-5 md:grid-cols-5">
        <CalcField label={copy.cost}>
          <Input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </CalcField>
        <CalcField label={copy.saving}>
          <Input
            type="number"
            value={saving}
            onChange={(e) => setSaving(Number(e.target.value))}
          />
        </CalcField>
        <CalcField label={copy.exchange}>
          <Input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </CalcField>
        <CalcOutputTile
          label={copy.payback}
          value={`${formatNumberAz(result.paybackYears)} ${copy.years}`}
        />
        <CalcOutputTile
          label={copy.savings25}
          value={`$${formatNumberAz(result.savings25, 0)}`}
        />
      </div>
    </CalcShell>
  );
}
