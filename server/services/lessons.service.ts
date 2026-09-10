import "server-only";
import { prisma } from "@/lib/prisma";

export const lessonsService = {
  listPublished: () =>
    prisma.lesson.findMany({
      where: { published: true },
      orderBy: { number: "asc" },
    }),
  findPublishedBySlug: (slug: string) =>
    prisma.lesson.findFirst({ where: { slug, published: true } }),
  findById: (id: string) => prisma.lesson.findUnique({ where: { id } }),
  listAll: () => prisma.lesson.findMany({ orderBy: { number: "asc" } }),
  create: (data: Parameters<typeof prisma.lesson.create>[0]["data"]) =>
    prisma.lesson.create({ data }),
  update: (
    id: string,
    data: Parameters<typeof prisma.lesson.update>[0]["data"],
  ) => prisma.lesson.update({ where: { id }, data }),
  delete: (id: string) => prisma.lesson.delete({ where: { id } }),
};
