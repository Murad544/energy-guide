import type { JSONContent } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string";
import { normalizeTiptapContent } from "@/lib/content/tiptap";

export function RichText({ content }: { content: unknown }) {
  const html = renderToHTMLString({
    extensions: [
      StarterKit.configure({
        link: {
          HTMLAttributes: {
            rel: "noopener noreferrer nofollow",
            class: "rich-text-link",
          },
        },
      }),
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { loading: "lazy" },
      }),
    ],
    content: normalizeTiptapContent(content) as JSONContent,
  });
  return (
    <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
