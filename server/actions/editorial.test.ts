import { beforeEach, expect, it, vi } from "vitest";
import { deleteNewsBatchAction } from "./editorial";
import { requireSession } from "@/lib/auth/require-session";
import { newsService } from "@/server/services/news.service";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/auth/require-session", () => ({ requireSession: vi.fn() }));
vi.mock("@/server/services/news.service", () => ({
  newsService: { deleteMany: vi.fn() },
}));
vi.mock("@/server/services/lessons.service", () => ({ lessonsService: {} }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
beforeEach(() => vi.resetAllMocks());

it("requires authentication before deleting", async () => {
  vi.mocked(requireSession).mockRejectedValueOnce(new Error("Unauthorized"));
  await expect(deleteNewsBatchAction(["a"])).rejects.toThrow("Unauthorized");
  expect(newsService.deleteMany).not.toHaveBeenCalled();
});
it.each([[], [""], ["  "], [123], null])(
  "rejects invalid input %j without deleting",
  async (ids) => {
    const result = await deleteNewsBatchAction(ids as string[]);
    expect(result.ok).toBe(false);
    expect(newsService.deleteMany).not.toHaveBeenCalled();
  },
);
it("deduplicates selection and invalidates admin, public list, and detail pages", async () => {
  expect(await deleteNewsBatchAction(["a", "b", "a"])).toEqual({
    ok: true,
    data: null,
  });
  expect(newsService.deleteMany).toHaveBeenCalledWith(["a", "b"]);
  expect(revalidatePath).toHaveBeenCalledWith("/dashboard/news");
  expect(revalidatePath).toHaveBeenCalledWith("/news");
  expect(revalidatePath).toHaveBeenCalledWith("/news/[slug]", "page");
});
it("returns a retryable error on database failure without invalidating pages", async () => {
  vi.spyOn(console, "error").mockImplementationOnce(() => {});
  vi.mocked(newsService.deleteMany).mockRejectedValueOnce(
    new Error("Database unavailable"),
  );
  expect((await deleteNewsBatchAction(["a"])).ok).toBe(false);
  expect(revalidatePath).not.toHaveBeenCalled();
});
