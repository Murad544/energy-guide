import "server-only";
import { newsService } from "@/server/services/news.service";

export const getPublishedNews = () => newsService.listPublished();
export const getNewsBySlug = (slug: string) =>
  newsService.findPublishedBySlug(slug);
