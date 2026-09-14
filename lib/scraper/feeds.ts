import Parser from "rss-parser";
import type { RawFeedArticle } from "./types";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; EnergyGuideBot/1.0; +https://energy-guide.local)",
    Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
  },
});

export const SOLAR_RSS_FEEDS = [
  {
    name: "PV Magazine Global",
    url: "https://www.pv-magazine.com/feed/",
  },
  {
    name: "CleanTechnica Solar",
    url: "https://cleantechnica.com/category/solar-energy/feed/",
  },
  {
    name: "Google News Solar",
    url: "https://news.google.com/rss/search?q=solar+energy+photovoltaic&hl=en-US&gl=US&ceid=US:en",
  },
];

function cleanHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Optionally fetch article webpage and extract key text paragraphs
 */
async function fetchFullArticleText(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const html = await res.text();
    // Simple paragraph extraction regex (fast and requires no heavy DOM dependencies)
    const matches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const paragraphs: string[] = [];

    for (const match of matches) {
      const text = cleanHtml(match);
      // Filter out cookies, nav snippets, very short sentences
      if (
        text.length > 60 &&
        !text.toLowerCase().includes("cookie") &&
        !text.toLowerCase().includes("privacy policy") &&
        !text.toLowerCase().includes("all rights reserved")
      ) {
        paragraphs.push(text);
      }
      if (paragraphs.length >= 6) break;
    }

    return paragraphs.length > 0 ? paragraphs.join("\n\n") : null;
  } catch {
    return null;
  }
}

/**
 * Fetches recent solar energy news from RSS feeds.
 */
export async function fetchSolarFeedArticles(maxPerFeed = 5): Promise<RawFeedArticle[]> {
  const articles: RawFeedArticle[] = [];
  const seenLinks = new Set<string>();

  for (const feedConfig of SOLAR_RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedConfig.url);
      let count = 0;

      for (const item of feed.items || []) {
        if (!item.link || !item.title) continue;
        if (seenLinks.has(item.link)) continue;

        seenLinks.add(item.link);

        const rawSnippet = item.contentSnippet || item.summary || item.content || "";
        let cleanSnippet = cleanHtml(rawSnippet);

        // If snippet is too short, attempt to fetch first few paragraphs from the page
        if (cleanSnippet.length < 150) {
          const fetchedContent = await fetchFullArticleText(item.link);
          if (fetchedContent) {
            cleanSnippet = fetchedContent;
          }
        }

        articles.push({
          title: cleanHtml(item.title),
          link: item.link,
          snippet: cleanSnippet,
          sourceName: feedConfig.name,
          pubDate: item.isoDate || item.pubDate,
        });

        count++;
        if (count >= maxPerFeed) break;
      }
    } catch (err) {
      console.warn(`[Scraper] Failed to fetch feed ${feedConfig.name}:`, (err as Error).message);
    }
  }

  return articles;
}
