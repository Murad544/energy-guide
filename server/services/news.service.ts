import "server-only";
import { db } from "@/lib/prisma";
import type { FieldInputTypes, FieldOutputTypes } from "@/prisma/contract.d";

const news = db.orm.public.News;
type NewsData = Pick<
  FieldInputTypes["public"]["News"],
  "slug" | "title" | "excerpt" | "contentJson" | "published"
> & {
  publishedAt: FieldOutputTypes["public"]["News"]["publishedAt"];
};

export const newsService = {
  listPublished: () =>
    news
      .where({ published: true })
      .orderBy([
        (article) => article.publishedAt.desc(),
        (article) => article.createdAt.desc(),
      ])
      .all(),
  findPublishedBySlug: (slug: string) =>
    news.where({ slug, published: true }).first(),
  findById: (id: string) => news.first({ id }),
  listAll: () => news.orderBy((article) => article.updatedAt.desc()).all(),
  create: (data: NewsData) => news.create(data),
  update: (id: string, data: NewsData) => news.where({ id }).update(data),
  delete: (id: string) => news.where({ id }).delete(),
  deleteMany: (ids: string[]) => {
    if (!ids.length) throw new Error("No news selected for deletion");
    return news.where((article) => article.id.in(ids)).deleteAndCount();
  },
};
