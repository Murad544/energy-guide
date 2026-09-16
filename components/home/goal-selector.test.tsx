import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { GoalSelector } from "./goal-selector";

afterEach(cleanup);

it("updates the recommendation and destination when a goal is selected", () => {
  render(<GoalSelector />);
  expect(screen.getByRole("link").getAttribute("href")).toBe("/calculators?tool=pv");
  for (const [name, tool] of [["Damı qiymətləndirmək", "roof"], ["Ehtiyat enerji", "battery"], ["Sistemi anlamaq", "flow"], ["Sistem seçmək", "pv"]]) {
    fireEvent.click(screen.getByRole("button", { name }));
    expect(screen.getByRole("button", { name }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("link").getAttribute("href")).toBe(`/calculators?tool=${tool}`);
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
  }
});
