import { expect, it } from "vitest";
import { simulate, type Mode } from "./simulation";

it("uses the grid at night in on-grid mode, never a battery", () => {
  expect(simulate("onGrid", 0, 3, true)).toMatchObject({
    imported: 3,
    discharge: 0,
    supplied: 3,
  });
});
it("uses battery power before importing in hybrid mode", () => {
  expect(simulate("hybrid", 0, 3, true)).toMatchObject({
    discharge: 2,
    imported: 1,
    unmet: 0,
  });
  expect(simulate("hybrid", 0, 3, false)).toMatchObject({
    discharge: 0,
    imported: 3,
  });
});
it("reports unmet off-grid demand and curtails unused surplus", () => {
  expect(simulate("offGrid", 0, 3, false)).toMatchObject({
    unmet: 3,
    supplied: 0,
    imported: 0,
  });
  expect(simulate("offGrid", 100, 1, true)).toMatchObject({
    charge: 2,
    curtailed: 2,
    exported: 0,
  });
});
it("charges before exporting surplus", () => {
  expect(simulate("hybrid", 100, 1, false)).toMatchObject({
    solar: 5,
    charge: 2,
    exported: 2,
  });
});
it("conserves power across all scenario combinations", () => {
  for (const mode of ["onGrid", "offGrid", "hybrid"] as Mode[]) {
    for (const light of [0, 20, 80, 100])
      for (const demand of [0, 1, 3, 6])
        for (const available of [true, false]) {
          const e = simulate(mode, light, demand, available);
          expect(e.solar + e.discharge + e.imported).toBeCloseTo(
            e.supplied + e.charge + e.exported + e.curtailed,
          );
          expect(e.supplied + e.unmet).toBeCloseTo(demand);
          expect(e.charge * e.discharge).toBe(0);
          expect(e.imported * e.exported).toBe(0);
        }
  }
});
