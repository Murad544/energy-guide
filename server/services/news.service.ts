import "server-only";
import { prisma } from "@/lib/prisma";

export const newsService = {
  listPublished: () =>
    prisma.news.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
  findPublishedBySlug: (slug: string) =>
    prisma.news.findFirst({ where: { slug, published: true } }),
  findById: (id: string) => prisma.news.findUnique({ where: { id } }),
  listAll: () => prisma.news.findMany({ orderBy: { updatedAt: "desc" } }),
  create: (data: Parameters<typeof prisma.news.create>[0]["data"]) =>
    prisma.news.create({ data }),
  update: (
    id: string,
    data: Parameters<typeof prisma.news.update>[0]["data"],
  ) => prisma.news.update({ where: { id }, data }),
  delete: (id: string) => prisma.news.delete({ where: { id } }),
};
