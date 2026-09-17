import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NewsList } from "./news-list";
import { deleteNewsBatchAction } from "@/server/actions/editorial";

vi.mock("@/server/actions/editorial", () => ({
  deleteNewsAction: vi.fn(),
  deleteNewsBatchAction: vi.fn(),
}));
const articles = ["a", "b"].map((id) => ({
  id,
  title: id,
  slug: id,
  published: true,
  updatedAt: "17.09.2026",
}));
beforeEach(() => {
  vi.mocked(deleteNewsBatchAction).mockResolvedValue({ ok: true, data: null });
  vi.spyOn(window, "confirm").mockReturnValue(true);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

it("deletes only selected rows and clears selection after success", async () => {
  render(<NewsList articles={articles} />);
  expect(
    screen.getByRole<HTMLButtonElement>("button", {
      name: "Seçilənləri sil (0)",
    }).disabled,
  ).toBe(true);
  fireEvent.click(screen.getByRole("checkbox", { name: "a seç" }));
  expect(
    screen.getByRole<HTMLInputElement>("checkbox", { name: "Hamısını seç" })
      .indeterminate,
  ).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Seçilənləri sil (1)" }));
  await waitFor(() =>
    expect(deleteNewsBatchAction).toHaveBeenCalledWith(["a"]),
  );
  await waitFor(() =>
    expect(
      screen.getByRole<HTMLInputElement>("checkbox", { name: "a seç" }).checked,
    ).toBe(false),
  );
});

it("selects and clears all, respects cancellation, and preserves selection on failure", async () => {
  render(<NewsList articles={articles} />);
  const all = screen.getByRole("checkbox", { name: "Hamısını seç" });
  fireEvent.click(all);
  fireEvent.click(all);
  expect(
    screen.getByRole<HTMLInputElement>("checkbox", { name: "a seç" }).checked,
  ).toBe(false);
  fireEvent.click(all);
  vi.mocked(window.confirm).mockReturnValueOnce(false);
  fireEvent.click(screen.getByRole("button", { name: "Seçilənləri sil (2)" }));
  expect(deleteNewsBatchAction).not.toHaveBeenCalled();
  vi.mocked(deleteNewsBatchAction).mockResolvedValueOnce({
    ok: false,
    error: { code: "INTERNAL", message: "Failed" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Seçilənləri sil (2)" }));
  expect(await screen.findByRole("alert")).toHaveProperty(
    "textContent",
    "Failed",
  );
  expect(deleteNewsBatchAction).toHaveBeenCalledWith(["a", "b"]);
  expect(
    screen.getByRole<HTMLInputElement>("checkbox", { name: "a seç" }).checked,
  ).toBe(true);
});
