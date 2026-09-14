import Parser from "rss-parser";
import type { RawFeedArticle } from "./types";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
    name: "Solar Power World",
    url: "https://www.solarpowerworldonline.com/feed/",
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
 * Extracts a featured/thumbnail image URL from an RSS feed item.
 */
function extractFeedItemImage(item: Record<string, unknown>): string | null {
  const enclosure = item.enclosure as { url?: string; type?: string } | undefined;
  if (enclosure?.url && (enclosure.type?.startsWith("image/") || !enclosure.type)) {
    return enclosure.url;
  }

  const mediaContent = item["media:content"] as { $?: { url?: string } } | undefined;
  if (mediaContent?.$?.url) {
    return mediaContent.$.url;
  }

  const mediaThumbnail = item["media:thumbnail"] as { $?: { url?: string } } | undefined;
  if (mediaThumbnail?.$?.url) {
    return mediaThumbnail.$.url;
  }

  const rawHtml =
    (item["content:encoded"] as string) ||
    (item.content as string) ||
    (item.summary as string) ||
    "";
  const match = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]?.startsWith("http")) {
    return match[1];
  }

  return null;
}

/**
 * Extracts the primary image from an article's HTML (og:image, twitter:image, etc.)
 */
function extractHtmlImage(html: string, baseUrl: string): string | null {
  // 1. Open Graph / Twitter meta tags
  const ogMatch =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
    html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i) ||
    html.match(/<meta[^>]+property=["']og:image:url["'][^>]+content=["']([^"']+)["']/i);

  let rawUrl = ogMatch?.[1]?.trim();

  // 2. Schema.org JSON-LD
  if (!rawUrl) {
    const jsonLdBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdBlocks) {
      for (const block of jsonLdBlocks) {
        try {
          const jsonText = block.replace(/<\/?script[^>]*>/gi, "");
          const data = JSON.parse(jsonText);
          const findImg = (val: unknown): string | null => {
            if (!val || typeof val !== "object") return null;
            const obj = val as Record<string, unknown>;
            if (typeof obj.image === "string") return obj.image;
            if (Array.isArray(obj.image) && typeof obj.image[0] === "string") return obj.image[0];
            if (obj.image && typeof obj.image === "object" && typeof (obj.image as Record<string, unknown>).url === "string") {
              return (obj.image as Record<string, unknown>).url as string;
            }
            if (obj.primaryImageOfPage && typeof obj.primaryImageOfPage === "object" && typeof (obj.primaryImageOfPage as Record<string, unknown>).url === "string") {
              return (obj.primaryImageOfPage as Record<string, unknown>).url as string;
            }
            if (Array.isArray(obj["@graph"])) {
              for (const sub of obj["@graph"]) {
                const found = findImg(sub);
                if (found) return found;
              }
            }
            return null;
          };
          const found = findImg(data);
          if (found) {
            rawUrl = found;
            break;
          }
        } catch {
          // ignore JSON parsing errors
        }
      }
    }
  }

  // 3. First article body image
  if (!rawUrl) {
    const articleImg = html.match(/<article[\s\S]*?<img[^>]+src=["']([^"']+)["']/i);
    rawUrl = articleImg?.[1];
  }

  if (!rawUrl) return null;

  try {
    const resolved = new URL(rawUrl, baseUrl).toString();
    // Filter out tiny icons, tracking pixels, avatars
    if (
      resolved.startsWith("http") &&
      !resolved.includes("1x1") &&
      !resolved.includes("gravatar") &&
      !resolved.includes("favicon") &&
      !resolved.includes("avatar")
    ) {
      return resolved;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Fetches the article webpage to extract key text paragraphs and the featured image.
 */
async function fetchFullArticleData(url: string): Promise<{
  paragraphsText: string | null;
  imageUrl: string | null;
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

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

    if (!res.ok) return { paragraphsText: null, imageUrl: null };

    const html = await res.text();
    const finalUrl = res.url || url;

    const imageUrl = extractHtmlImage(html, finalUrl);

    // Extract article paragraphs
    const matches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const paragraphs: string[] = [];

    for (const match of matches) {
      const text = cleanHtml(match);
      if (
        text.length > 60 &&
        !text.toLowerCase().includes("cookie") &&
        !text.toLowerCase().includes("privacy policy") &&
        !text.toLowerCase().includes("all rights reserved") &&
        !text.toLowerCase().includes("terms of service")
      ) {
        paragraphs.push(text);
      }
      if (paragraphs.length >= 6) break;
    }

    return {
      paragraphsText: paragraphs.length > 0 ? paragraphs.join("\n\n") : null,
      imageUrl,
    };
  } catch {
    return { paragraphsText: null, imageUrl: null };
  }
}

/**
 * Fetches recent solar energy news from RSS feeds including text and featured images.
 */
export async function fetchSolarFeedArticles(maxPerFeed = 10): Promise<RawFeedArticle[]> {
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

        // First check if feed item itself provides an image
        let imageUrl: string | null = extractFeedItemImage(item as Record<string, unknown>);

        // Fetch full page to get high-res og:image and richer paragraphs
        const pageData = await fetchFullArticleData(item.link);

        if (pageData.imageUrl) {
          imageUrl = pageData.imageUrl;
        }

        if (pageData.paragraphsText && (cleanSnippet.length < 150 || pageData.paragraphsText.length > cleanSnippet.length)) {
          cleanSnippet = pageData.paragraphsText;
        }

        articles.push({
          title: cleanHtml(item.title),
          link: item.link,
          snippet: cleanSnippet,
          sourceName: feedConfig.name,
          pubDate: item.isoDate || item.pubDate,
          imageUrl: imageUrl ?? undefined,
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
