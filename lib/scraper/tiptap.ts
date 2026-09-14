import type { JSONContent } from "@tiptap/react";

/**
 * Builds a valid TipTap JSON document matching the application's RichText renderer.
 */
export function buildTiptapDocument(options: {
  paragraphs: string[];
  imageUrl?: string;
  imageAlt?: string;
  sourceUrl?: string;
  sourceName?: string;
}): JSONContent {
  const { paragraphs, imageUrl, imageAlt, sourceUrl, sourceName } = options;

  const content: JSONContent[] = [];

  // Add featured image node if provided
  if (imageUrl) {
    content.push({
      type: "image",
      attrs: {
        src: imageUrl,
        alt: imageAlt || "Məqalə şəkli",
      },
    });
  }

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
