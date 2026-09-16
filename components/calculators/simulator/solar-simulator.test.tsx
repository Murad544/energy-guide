import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { SolarSimulator } from "./solar-simulator";
vi.mock("next/dynamic", () => ({ default: () => () => <div>3D scene</div> }));
afterEach(cleanup);
it("updates supply when sunlight and demand change, and supports empty battery scenarios", () => {
  render(<SolarSimulator />);
  fireEvent.click(screen.getByRole("button", { name: "Avtonom" }));
  fireEvent.change(screen.getByRole("slider", { name: /Günəş işığı/ }), {
    target: { value: "0" },
  });
  fireEvent.change(screen.getByRole("slider", { name: /Evin tələbatı/ }), {
    target: { value: "3" },
  });
  expect(screen.getByRole("status").textContent).toContain("1 kVt");
  fireEvent.click(screen.getByRole("checkbox"));
  expect(screen.getByRole("status").textContent).toContain("3 kVt");
  fireEvent.click(screen.getByRole("button", { name: "Şəbəkəli" }));
  expect(screen.getByRole("status").textContent).toContain("tam təmin olunur");
  expect(screen.queryByRole("checkbox")).toBeNull();
});
it("keeps component selection valid across modes and offers pause", () => {
  render(<SolarSimulator />);
  fireEvent.click(screen.getByRole("button", { name: "Batareya" }));
  expect(screen.getByRole("heading", { name: "Batareya" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Şəbəkəli" }));
  expect(screen.queryByRole("button", { name: "Batareya" })).toBeNull();
  expect(
    screen.getByRole("button", { name: "Panel", pressed: true }),
  ).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Animasiyanı dayandır" }));
  expect(
    screen.getByRole("button", {
      name: "Animasiyanı davam etdir",
      pressed: true,
    }),
  ).toBeTruthy();
});
