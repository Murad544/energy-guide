import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CalculatorWorkspace } from "./calculator-workspace";

vi.mock("./calculators/annual-calculator", () => ({
  AnnualCalculator: () => null,
}));
vi.mock("./calculators/battery-calculator", () => ({
  BatteryCalculator: () => null,
}));
vi.mock("./calculators/pv-size-calculator", () => ({
  PvSizeCalculator: () => null,
}));
vi.mock("./calculators/roi-calculator", () => ({ RoiCalculator: () => null }));
vi.mock("./calculators/roof-calculator", () => ({
  RoofCalculator: () => null,
}));
vi.mock("./simulator/solar-simulator", () => ({ SolarSimulator: () => null }));

afterEach(cleanup);

it.each([
  ["pv", "Sistem ölçüsü"],
  ["roof", "Dam potensialı"],
  ["battery", "Batareya tutumu"],
  ["flow", "Sistem simulyatoru"],
  ["unknown", "Sistem ölçüsü"],
])("opens the requested tool %s with a safe fallback", (initialTool, name) => {
  render(<CalculatorWorkspace initialTool={initialTool} />);
  expect(screen.getByRole("tab", { name, selected: true })).toBeTruthy();
});

it("allows keyboard selection of another calculator after following a deep link", () => {
  render(<CalculatorWorkspace initialTool="flow" />);
  fireEvent.keyDown(screen.getByRole("tab", { name: "Dam potensialı" }), {
    key: "Enter",
  });
  expect(
    screen.getByRole("tab", { name: "Dam potensialı", selected: true }),
  ).toBeTruthy();
});
