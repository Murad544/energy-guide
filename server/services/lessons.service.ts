import "server-only";
import { db } from "@/lib/prisma";
import type { FieldInputTypes } from "@/prisma/contract.d";

const lessons = db.orm.public.Lesson;
type LessonData = Pick<
  FieldInputTypes["public"]["Lesson"],
  | "slug"
  | "number"
  | "category"
  | "title"
  | "intro"
  | "contentJson"
  | "published"
>;

export const lessonsService = {
  listPublished: () =>
    lessons
      .where({ published: true })
      .orderBy((lesson) => lesson.number.asc())
      .all(),
  findPublishedBySlug: (slug: string) =>
    lessons.where({ slug, published: true }).first(),
  findById: (id: string) => lessons.first({ id }),
  listAll: () => lessons.orderBy((lesson) => lesson.number.asc()).all(),
  create: (data: LessonData) => lessons.create(data),
  update: (id: string, data: LessonData) => lessons.where({ id }).update(data),
  delete: (id: string) => lessons.where({ id }).delete(),
};
