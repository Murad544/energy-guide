"use client";

import { useMemo, useState } from "react";
import { CalcField } from "@/components/calculators/calc-field";
import { CalcOutputTile } from "@/components/calculators/calc-output-tile";
import { CalcShell } from "@/components/calculators/calc-shell";
import { Input } from "@/components/ui/input";
import { calculatorCopy as copy } from "@/lib/copy/az";
import { calculatePvSize } from "@/lib/formulas/pv-size";
import { formatNumberAz } from "@/lib/utils";

export function PvSizeCalculator() {
  const [monthlyKwh, setMonthlyKwh] = useState(350);
  const [peakSunHours, setPeakSunHours] = useState(4.5);
  const [panelW, setPanelW] = useState(450);
  const result = useMemo(
    () => calculatePvSize({ monthlyKwh, peakSunHours, panelW, tariff: 0.11 }),
    [monthlyKwh, peakSunHours, panelW],
  );
  return (
    <CalcShell title={copy.systemSizeTitle} description={copy.systemSizeText}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid gap-5">
          <CalcField label={copy.monthlyUse} suffix="kVt·s">
            <Input
              min="1"
              type="number"
              value={monthlyKwh}
              onChange={(event) => setMonthlyKwh(Number(event.target.value))}
            />
          </CalcField>
          <CalcField label={copy.peakSun} suffix="saat">
            <Input
              min="1"
              step="0.1"
              type="number"
              value={peakSunHours}
              onChange={(event) => setPeakSunHours(Number(event.target.value))}
            />
          </CalcField>
          <CalcField label={copy.panelPower} suffix="Vt">
            <Input
              min="100"
              step="10"
              type="number"
              value={panelW}
              onChange={(event) => setPanelW(Number(event.target.value))}
            />
          </CalcField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CalcOutputTile
            label={copy.systemPower}
            value={`${formatNumberAz(result.systemKw, 2)} kVt`}
          />
          <CalcOutputTile label={copy.panelCount} value={`${result.panels}`} />
          <CalcOutputTile
            label={copy.roofArea}
            value={`${formatNumberAz(result.roofArea)} m²`}
          />
          <CalcOutputTile
            label={copy.monthlySaving}
            value={`${formatNumberAz(result.monthlySavings)} AZN`}
          />
        </div>
      </div>
    </CalcShell>
  );
}
