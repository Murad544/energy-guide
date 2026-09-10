export type ContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; level: 3 | 4; text: string }
  | { kind: "list"; style: "bullet" | "check" | "cross"; items: string[] }
  | { kind: "steps"; items: { num: string; title: string; body: string }[] }
  | {
      kind: "proCon";
      plus: string[];
      minus: string[];
      plusLabel?: string;
      minusLabel?: string;
    }
  | { kind: "compare"; rows: { name: string; cells: string[] }[] }
  | {
      kind: "tabs";
      items: { id: string; title: string; body: ContentBlock[] }[];
    }
  | { kind: "callout"; tone: "info" | "warn"; text: string };

export type LessonSummary = {
  slug: string;
  number: number;
  title: string;
  intro: string;
};
