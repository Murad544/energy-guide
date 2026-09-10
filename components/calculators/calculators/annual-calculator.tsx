"use client";
import { useState } from "react";
import { CalcField } from "@/components/calculators/calc-field";
import { CalcOutputTile } from "@/components/calculators/calc-output-tile";
import { CalcShell } from "@/components/calculators/calc-shell";
import { Input } from "@/components/ui/input";
import { calculatorCopy as copy } from "@/lib/copy/az";
import { calculateAnnualProduction } from "@/lib/formulas/annual";
import { formatNumberAz } from "@/lib/utils";

export function AnnualCalculator() {
  const [kw, setKw] = useState(5);
  const [sun, setSun] = useState(4.5);
  const [year, setYear] = useState(10);
  const result = calculateAnnualProduction(kw, sun, 0.5, year);
  return (
    <CalcShell title={copy.annualTitle} description={copy.annualText}>
      <div className="grid gap-5 md:grid-cols-4">
        <CalcField label={copy.systemKw}>
          <Input
            type="number"
            value={kw}
            onChange={(e) => setKw(Number(e.target.value))}
          />
        </CalcField>
        <CalcField label={copy.peakSun}>
          <Input
            type="number"
            step="0.1"
            value={sun}
            onChange={(e) => setSun(Number(e.target.value))}
          />
        </CalcField>
        <CalcField label={copy.year}>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </CalcField>
        <CalcOutputTile
          label={copy.production}
          value={`${formatNumberAz(result.yearNKwh, 0)} kVt·s`}
        />
      </div>
    </CalcShell>
  );
}
