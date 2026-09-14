import { db } from "@/lib/prisma";
import type { FieldInputTypes } from "@/prisma/contract.d";
import { fetchSolarFeedArticles } from "./feeds";
import { translateArticleWithGemini } from "./gemini";
import { generateNewsSlug } from "./slug";
import type { ScraperResult } from "./types";

export interface ScrapeOptions {
  limit?: number;
  dryRun?: boolean;
  force?: boolean;
}

/**
 * Runs the scraper pipeline:
 * 1. Fetches recent solar articles from English RSS feeds.
 * 2. Filters out articles that already exist in the database.
 * 3. Translates and formats up to `limit` (default 3) articles into Azerbaijani.
 * 4. Inserts them into the News table as DRAFTS (published: false, publishedAt: null).
 */
export async function runNewsScraper(options: ScrapeOptions = {}): Promise<ScraperResult> {
  const limit = options.limit ?? 3;
  const dryRun = options.dryRun ?? false;

  console.log(`[Scraper] Starting scraper job (limit: ${limit}, dryRun: ${dryRun})...`);

  // 1. Fetch raw items from RSS feeds
  const rawArticles = await fetchSolarFeedArticles();
  console.log(`[Scraper] Discovered ${rawArticles.length} candidate articles from feeds.`);

  if (rawArticles.length === 0) {
    return {
      success: true,
      message: "No articles found in feeds at this time.",
      insertedCount: 0,
      articles: [],
    };
  }

  // 2. Query recent existing news to prevent duplicates
  const existingArticles = await db.orm.public.News
    .orderBy((a) => a.createdAt.desc())
    .all();

  const existingTitles = new Set(
    existingArticles.map((a) => a.title.toLowerCase().trim())
  );
  const existingSlugs = new Set(existingArticles.map((a) => a.slug));

  // 3. Filter candidates
  const candidates = rawArticles.filter((item) => {
    if (options.force) return true;
    const titleLower = item.title.toLowerCase().trim();
    // Skip if exact title was already inserted
    if (existingTitles.has(titleLower)) return false;
    return true;
  });

  const selectedCandidates = candidates.slice(0, limit);

  if (selectedCandidates.length === 0) {
    return {
      success: true,
      message: "All fetched articles already exist in database.",
      insertedCount: 0,
      articles: [],
    };
  }

  console.log(`[Scraper] Processing ${selectedCandidates.length} articles for translation...`);

  const insertedArticles: ScraperResult["articles"] = [];

  // 4. Translate, format and save each article
  for (const raw of selectedCandidates) {
    try {
      console.log(`[Scraper] Translating: "${raw.title}"`);
      const translated = await translateArticleWithGemini(raw);

      // Generate a unique slug
      let slug = generateNewsSlug(translated.title, true);
      while (existingSlugs.has(slug)) {
        slug = generateNewsSlug(translated.title, true);
      }
      existingSlugs.add(slug);

      if (dryRun) {
        console.log(`[Scraper] [DryRun] Would insert draft: "${translated.title}" (${slug})`);
        insertedArticles.push({
          slug,
          title: translated.title,
          excerpt: translated.excerpt,
          published: false,
          publishedAt: null,
        });
      } else {
        const created = await db.orm.public.News.create({
          slug,
          title: translated.title,
          excerpt: translated.excerpt || null,
          contentJson: translated.contentJson as unknown as FieldInputTypes["public"]["News"]["contentJson"],
          published: false, // DRAFT: user can review in /dashboard/news
          publishedAt: null,
        });

        console.log(`[Scraper] Created draft article [${created.id}]: "${created.title}"`);
        insertedArticles.push({
          id: created.id,
          slug: created.slug,
          title: created.title,
          excerpt: created.excerpt,
          published: created.published,
          publishedAt: created.publishedAt,
        });
      }
    } catch (err) {
      console.error(`[Scraper] Error processing article "${raw.title}":`, (err as Error).message);
    }
  }

  return {
    success: true,
    message: dryRun
      ? `Dry run completed. ${insertedArticles.length} articles prepared (not saved to DB).`
      : `Successfully saved ${insertedArticles.length} draft articles to News table.`,
    insertedCount: insertedArticles.length,
    articles: insertedArticles,
  };
}
