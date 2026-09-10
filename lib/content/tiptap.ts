import type { JSONContent } from "@tiptap/react";

export const EMPTY_TIPTAP_DOCUMENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

type LegacyBlock = {
  kind?: string;
  text?: string;
  level?: number;
  items?: string[];
};

export function normalizeTiptapContent(value: unknown): JSONContent {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value as JSONContent).type === "doc"
  ) {
    return value as JSONContent;
  }

  if (Array.isArray(value)) {
    const content = (value as LegacyBlock[]).flatMap((block): JSONContent[] => {
      if (block.kind === "heading" && block.text)
        return [
          {
            type: "heading",
            attrs: { level: block.level ?? 2 },
            content: [{ type: "text", text: block.text }],
          },
        ];
      if (
        (block.kind === "paragraph" || block.kind === "callout") &&
        block.text
      )
        return [
          { type: "paragraph", content: [{ type: "text", text: block.text }] },
        ];
      if (block.kind === "list" && block.items?.length)
        return [
          {
            type: "bulletList",
            content: block.items.map((item) => ({
              type: "listItem",
              content: [
                { type: "paragraph", content: [{ type: "text", text: item }] },
              ],
            })),
          },
        ];
      return [];
    });
    return {
      type: "doc",
      content: content.length ? content : EMPTY_TIPTAP_DOCUMENT.content,
    };
  }

  return EMPTY_TIPTAP_DOCUMENT;
}
