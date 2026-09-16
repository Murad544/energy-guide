import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { LessonLibrary } from "./lesson-library";

afterEach(cleanup);
const lessons = [
  {
    id: "1",
    number: 1,
    slug: "isiq",
    title: "İşıq və enerji",
    intro: "Günəş panelinin işi",
  },
  {
    id: "2",
    number: 2,
    slug: "batareya",
    title: "Batareya",
    intro: "Ehtiyat enerji",
  },
];

it("filters using Azerbaijani casing and restores results and focus when cleared", () => {
  render(<LessonLibrary lessons={lessons} />);
  const input = screen.getByRole("searchbox");
  fireEvent.change(input, { target: { value: "  İŞIQ  " } });
  expect(screen.getAllByRole("link")).toHaveLength(1);
  expect(screen.getByRole("link").getAttribute("href")).toBe("/knowledge/isiq");
  fireEvent.change(input, { target: { value: "missing" } });
  expect(screen.queryAllByRole("link")).toHaveLength(0);
  expect(screen.getByText("Uyğun dərs tapılmadı")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Axtarışı təmizlə" }));
  expect(screen.getAllByRole("link")).toHaveLength(2);
  expect(document.activeElement).toBe(input);
});

it("searches descriptions and shows the publication empty state", () => {
  const { rerender } = render(<LessonLibrary lessons={lessons} />);
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "ehtiyat" },
  });
  expect(screen.getByRole("link").getAttribute("href")).toBe(
    "/knowledge/batareya",
  );
  rerender(<LessonLibrary lessons={[]} />);
  expect(screen.getByText("Hazırda nəşr edilmiş dərs yoxdur.")).toBeTruthy();
  expect(screen.queryByRole("searchbox")).toBeNull();
});
