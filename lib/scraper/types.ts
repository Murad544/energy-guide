import type { JSONContent } from "@tiptap/react";

export interface RawFeedArticle {
  title: string;
  link: string;
  snippet: string;
  sourceName: string;
  pubDate?: string;
}

export interface TranslatedArticle {
  title: string;
  excerpt: string;
  contentJson: JSONContent;
  sourceUrl: string;
  originalTitle: string;
}

export interface ScraperResult {
  success: boolean;
  message: string;
  insertedCount: number;
  articles: Array<{
    id?: string;
    slug: string;
    title: string;
    excerpt: string | null;
    published: boolean;
    publishedAt: string | null;
  }>;
}
