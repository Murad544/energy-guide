import type { RawFeedArticle, TranslatedArticle } from './types';
import { buildTiptapDocument } from './tiptap';

interface GeminiResponseFormat {
  title: string;
  excerpt: string;
  paragraphs: string[];
}

/**
 * Translates and formats an English solar energy article into Azerbaijani using Google Gemini API.
 */
export async function translateArticleWithGemini(
  raw: RawFeedArticle,
  apiKey?: string,
): Promise<TranslatedArticle> {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    console.warn(
      '[Scraper] GEMINI_API_KEY is not set in environment variables. Using placeholder translation for testing.',
    );
    return createFallbackArticle(raw);
  }

  const prompt = `
You are a professional energy journalist and editor for an Azerbaijani solar and renewable energy portal ("energy-guide").
Your task is to translate and adapt the following English solar energy article into natural, accurate Azerbaijani (az-AZ).

Article Title:
"""
${raw.title}
"""

Article Content / Summary:
"""
${raw.snippet}
"""

Instructions:
1. Translate and rewrite the article into professional Azerbaijani.
2. Use accurate Azerbaijani renewable energy terminology:
   - "solar panels" -> "günəş panelləri"
   - "photovoltaic" -> "fotovoltaik / fotoelektrik"
   - "inverter" -> "inverter"
   - "grid" -> "elektrik şəbəkəsi"
   - "efficiency" -> "səmərəlilik / faydalı iş əmsalı"
   - "energy storage / battery" -> "enerji saxlama sistemləri / batareyalar"
3. Output MUST be valid JSON with the following structure:
{
  "title": "Clear, informative headline in Azerbaijani (under 180 characters)",
  "excerpt": "Concise overview summary in Azerbaijani (1-2 sentences, max 280 characters)",
  "paragraphs": [
    "First paragraph explaining the core event or discovery...",
    "Second paragraph with technical or market details...",
    "Third paragraph discussing the importance or future impact..."
  ]
}

Only return the raw JSON object, without markdown backticks or commentary.
`.trim();

  // Try gemini-2.5-flash first, fallback to gemini-1.5-flash if needed
  const models = ['gemini-3.6-flash'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errorText}`);
      }

      const json = await res.json();
      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Empty response received from Gemini API');
      }

      const cleanedText = rawText.replace(/```json\s*|```/g, '').trim();
      const parsed: GeminiResponseFormat = JSON.parse(cleanedText);

      const title = (parsed.title || raw.title).trim().slice(0, 180);
      const excerpt = (parsed.excerpt || raw.snippet || '')
        .trim()
        .slice(0, 300);
      const paragraphs =
        Array.isArray(parsed.paragraphs) && parsed.paragraphs.length > 0
          ? parsed.paragraphs
          : [excerpt];

      const contentJson = buildTiptapDocument({
        paragraphs,
        imageUrl: raw.imageUrl,
        imageAlt: title,
        sourceUrl: raw.link,
        sourceName: raw.sourceName,
      });

      return {
        title,
        excerpt,
        contentJson,
        sourceUrl: raw.link,
        originalTitle: raw.title,
        imageUrl: raw.imageUrl,
      };
    } catch (err) {
      lastError = err as Error;
      console.warn(
        `[Gemini] Model ${model} failed, trying next...:`,
        (err as Error).message,
      );
    }
  }

  console.error('[Gemini] All translation attempts failed:', lastError);
  // Fall back gracefully so the pipeline doesn't break
  return createFallbackArticle(raw);
}

/**
 * Creates a clean placeholder translation when GEMINI_API_KEY is not configured
 * or when external AI calls fail during manual testing.
 */
function createFallbackArticle(raw: RawFeedArticle): TranslatedArticle {
  const title = `[Qaralama] ${raw.title}`.slice(0, 180);
  const excerpt = (
    raw.snippet || 'Məqalənin qısa icmalı tezliklə əlavə olunacaq.'
  ).slice(0, 300);

  const paragraphs = [
    raw.snippet || 'Məqalə haqqında məlumat yüklənir.',
    'Qeyd: Bu məqalə xarici mənbədən avtomatik toplanmışdır və redaktə olunmaq üçün qaralama rejimində saxlanılır.',
  ];

  const contentJson = buildTiptapDocument({
    paragraphs,
    imageUrl: raw.imageUrl,
    imageAlt: title,
    sourceUrl: raw.link,
    sourceName: raw.sourceName,
  });

  return {
    title,
    excerpt,
    contentJson,
    sourceUrl: raw.link,
    originalTitle: raw.title,
    imageUrl: raw.imageUrl,
  };
}
