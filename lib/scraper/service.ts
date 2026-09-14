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
 * Strips tracking query params and normalizes URL for accurate deduplication.
 */
function normalizeUrl(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    u.searchParams.delete("utm_source");
    u.searchParams.delete("utm_medium");
    u.searchParams.delete("utm_campaign");
    u.searchParams.delete("utm_term");
    u.searchParams.delete("utm_content");
    return `${u.origin}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return rawUrl.trim().toLowerCase().replace(/\/+$/, "");
  }
}

/**
 * Extracts all original source URLs already saved in existing articles' contentJson.
 */
function extractExistingSourceUrls(articles: Array<{ contentJson: unknown }>): Set<string> {
  const set = new Set<string>();
  for (const article of articles) {
    try {
      const jsonStr =
        typeof article.contentJson === "string"
          ? article.contentJson
          : JSON.stringify(article.contentJson);

      const matches = jsonStr.matchAll(/"href":\s*"([^"]+)"/g);
      for (const m of matches) {
        if (m[1]) set.add(normalizeUrl(m[1]));
      }
    } catch {
      // ignore
    }
  }
  return set;
}

/**
 * Runs the scraper pipeline:
 * 1. Fetches recent solar articles from English RSS feeds.
 * 2. Filters out articles that already exist in the database (by source URL).
 * 3. Sorts candidate articles by publication date (newest first).
 * 4. Translates and formats up to `limit` (default 3) articles into Azerbaijani.
 * 5. Inserts them into the News table as DRAFTS (published: false, publishedAt: null).
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

  // 2. Query existing news to extract previously saved source URLs
  const existingArticles = await db.orm.public.News
    .orderBy((a) => a.createdAt.desc())
    .all();

  const existingSourceUrls = extractExistingSourceUrls(existingArticles);
  const existingSlugs = new Set(existingArticles.map((a) => a.slug));
  console.log(`[Scraper] Found ${existingSourceUrls.size} existing source URLs in database.`);

  // 3. Filter candidates by source URL (guarantees no repeats)
  const freshCandidates = rawArticles.filter((item) => {
    if (options.force) return true;
    const normUrl = normalizeUrl(item.link);
    if (existingSourceUrls.has(normUrl)) {
      return false; // Already scraped previously!
    }
    return true;
  });

  // Sort fresh candidates by publication date descending (newest first)
  freshCandidates.sort((a, b) => {
    const timeA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const timeB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return timeB - timeA;
  });

  console.log(`[Scraper] Found ${freshCandidates.length} fresh (unscraped) articles.`);

  const selectedCandidates = freshCandidates.slice(0, limit);

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
          imageUrl: translated.imageUrl,
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
          imageUrl: translated.imageUrl,
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
