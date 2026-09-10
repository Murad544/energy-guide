import "server-only";
import { prisma } from "@/lib/prisma";

export const resourcesService = {
  listByCategory: (category: string) =>
    prisma.resource.findMany({
      where: { category },
      orderBy: { position: "asc" },
    }),
  listAll: () =>
    prisma.resource.findMany({
      orderBy: [{ category: "asc" }, { position: "asc" }],
    }),
};
