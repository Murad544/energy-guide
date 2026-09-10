import { describe, expect, it } from "vitest";
import { normalizeTiptapContent } from "@/lib/content/tiptap";

describe("normalizeTiptapContent", () => {
  it("keeps a Tiptap document unchanged", () => {
    const document = { type: "doc", content: [{ type: "paragraph" }] };
    expect(normalizeTiptapContent(document)).toEqual(document);
  });

  it("converts legacy lesson blocks", () => {
    expect(
      normalizeTiptapContent([{ kind: "paragraph", text: "Salam" }]),
    ).toEqual({
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Salam" }] },
      ],
    });
  });
});
