import type { JSONContent } from "@tiptap/react";

/**
 * Builds a valid TipTap JSON document matching the application's RichText renderer.
 */
export function buildTiptapDocument(options: {
  paragraphs: string[];
  sourceUrl?: string;
  sourceName?: string;
}): JSONContent {
  const { paragraphs, sourceUrl, sourceName } = options;

  const content: JSONContent[] = [];

  for (const text of paragraphs) {
    const trimmed = text.trim();
    if (!trimmed) continue;

    content.push({
      type: "paragraph",
      content: [
        {
          type: "text",
          text: trimmed,
        },
      ],
    });
  }

  // Add source attribution link if provided
  if (sourceUrl) {
    content.push({
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Mənbə: ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: sourceUrl,
                target: "_blank",
                rel: "noopener noreferrer nofollow",
              },
            },
          ],
          text: sourceName ? `${sourceName} (Orijinal məqalə)` : "Orijinal məqaləyə keçid",
        },
      ],
    });
  }

  if (content.length === 0) {
    content.push({
      type: "paragraph",
      content: [{ type: "text", text: "Məzmun tezliklə əlavə olunacaq." }],
    });
  }

  return {
    type: "doc",
    content,
  };
}
