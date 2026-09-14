import { describe, expect, it } from "vitest";
import { generateNewsSlug } from "./slug";
import { buildTiptapDocument } from "./tiptap";
import { normalizeTiptapContent } from "@/lib/content/tiptap";

describe("Scraper Helpers", () => {
  describe("generateNewsSlug", () => {
    it("transliterates Azerbaijani characters and respects slug regex", () => {
      const title = "Azərbaycanda yeni günəş paneli və şəbəkə qoşulması!";
      const slug = generateNewsSlug(title, false);

      expect(slug).toBe("azerbaycanda-yeni-gunes-paneli-ve-sebeke-qosulmasi");
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    });

    it("appends unique random suffix when requested", () => {
      const title = "Test Günəş Enerjisi";
      const slug = generateNewsSlug(title, true);

      expect(slug).toMatch(/^test-gunes-enerjisi-[a-z0-9]+$/);
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    });

    it("handles empty or special character titles gracefully", () => {
      const slug = generateNewsSlug("!!! ??? ###", false);
      expect(slug).toBe("solar-news");
    });
  });

  describe("buildTiptapDocument", () => {
    it("creates a valid TipTap doc containing paragraphs and source attribution", () => {
      const doc = buildTiptapDocument({
        paragraphs: ["Birinci abzas", "İkinci texniki abzas"],
        sourceUrl: "https://pv-magazine.com/example",
        sourceName: "PV Magazine",
      });

      expect(doc.type).toBe("doc");
      expect(doc.content).toHaveLength(3); // 2 paragraphs + 1 source paragraph

      // Verify that the document passes application's normalizeTiptapContent intact
      const normalized = normalizeTiptapContent(doc);
      expect(normalized).toEqual(doc);
    });
  });
});
