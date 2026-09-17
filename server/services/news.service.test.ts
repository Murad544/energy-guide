// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";

const { execute, query } = vi.hoisted(() => ({
  execute: vi.fn(),
  query: vi.fn(() => {
    throw new Error("Batch deletion must not select a single row first");
  }),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", async () => {
  const { default: postgres } = await import("@prisma/orm-postgres/runtime");
  const { orm } = await import("@prisma/orm-postgres/orm-client");
  const { default: contractJson } = await import("@/prisma/contract.json");
  const client = postgres({ contractJson });
  return {
    db: { orm: orm({ context: client.context, runtime: { execute, query } }) },
  };
});
import { newsService } from "./news.service";

beforeEach(() => {
  execute.mockReset();
  query.mockClear();
});

it("compiles one bulk delete for every selected ID without a single-row lookup", async () => {
  execute.mockResolvedValue({ affectedRows: 3 });
  const count = await newsService.deleteMany(["a", "b", "c"]);
  expect(count).toBe(3);
  expect(execute).toHaveBeenCalledTimes(1);
  expect(query).not.toHaveBeenCalled();
  const plan = execute.mock.calls[0][0];
  expect(plan.ast).toMatchObject({
    kind: "delete",
    table: { name: "News", namespaceId: "public" },
    where: {
      op: "in",
      left: { column: "id" },
      right: { values: [{ value: "a" }, { value: "b" }, { value: "c" }] },
    },
  });
  expect(plan.params).toEqual(["a", "b", "c"]);
});

it("rejects an empty selection before issuing a query", () => {
  expect(() => newsService.deleteMany([])).toThrow("No news selected");
  expect(execute).not.toHaveBeenCalled();
  expect(query).not.toHaveBeenCalled();
});
