import "server-only";
import { lessonsService } from "@/server/services/lessons.service";

export const getPublishedLessons = () => lessonsService.listPublished();
export const getLessonBySlug = (slug: string) =>
  lessonsService.findPublishedBySlug(slug);
