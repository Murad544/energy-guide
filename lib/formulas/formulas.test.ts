import { describe, expect, it } from "vitest";
import { calculateAnnualProduction } from "@/lib/formulas/annual";
import { calculateBattery } from "@/lib/formulas/battery";
import { calculatePvSize } from "@/lib/formulas/pv-size";
import { calculateRoi } from "@/lib/formulas/roi";
import { calculateRoof } from "@/lib/formulas/roof";

describe("energy formulas", () => {
  it("sizes a PV system", () => {
    const result = calculatePvSize({
      monthlyKwh: 300,
      peakSunHours: 5,
      panelW: 500,
      tariff: 0.1,
    });
    expect(result.systemKw).toBe(2.5);
    expect(result.panels).toBe(5);
  });
  it("applies annual degradation", () =>
    expect(calculateAnnualProduction(5, 4, 1, 2).yearNKwh).toBeCloseTo(7227));
  it("sizes usable battery capacity", () =>
    expect(calculateBattery(10, 1, 0.5).capacityKwh).toBe(20));
  it("calculates simple payback", () =>
    expect(calculateRoi(6000, 170, 1.7).paybackYears).toBe(5));
  it("calculates roof capacity", () =>
    expect(calculateRoof(19, 500, 0.9)).toEqual({
      maxPanels: 10,
      effectiveKw: 4.5,
    }));
});
