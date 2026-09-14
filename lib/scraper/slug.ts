/**
 * Generates a clean URL slug from a title, with full transliteration
 * for Azerbaijani special characters and strict adherence to the project's slug format:
 * ^[a-z0-9]+(?:-[a-z0-9]+)*$
 */
export function generateNewsSlug(title: string, addRandomSuffix = true): string {
  const azCharMap: Record<string, string> = {
    ə: "e",
    Ə: "e",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ü: "u",
    Ü: "u",
    ğ: "g",
    Ğ: "g",
    ş: "s",
    Ş: "s",
    ç: "c",
    Ç: "c",
  };

  const transliterated = title
    .split("")
    .map((char) => azCharMap[char] ?? char)
    .join("");

  let clean = transliterated
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .trim()
    .replace(/[\s_]+/g, "-") // replace spaces and underscores with hyphen
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading and trailing hyphens

  if (!clean) {
    clean = "solar-news";
  }

  // Cap length to leave room for suffix (NewsInput max slug length is 120)
  clean = clean.slice(0, 90).replace(/-+$/, "");

  if (addRandomSuffix) {
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${clean}-${suffix}`;
  }

  return clean;
}
