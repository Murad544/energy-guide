import Link from "next/link";

type LessonSectionProps = {
  number: number;
  slug: string;
  title: string;
  intro: string;
};

export function LessonSection({
  number,
  slug,
  title,
  intro,
}: LessonSectionProps) {
  return (
    <Link
      className="feature-card group mb-4 grid gap-4 rounded-xl border bg-white p-6 md:grid-cols-[70px_1fr_auto] md:items-center md:p-8"
      href={`/knowledge/${slug}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-paper-dim text-lg font-semibold text-teal">
        {String(number).padStart(2, "0")}
      </span>
      <span>
        <strong className="block text-xl font-semibold group-hover:text-copper">
          {title}
        </strong>
        <span className="mt-2 block leading-7 text-ink-soft">{intro}</span>
      </span>
      <span aria-hidden className="text-2xl">
        ↗
      </span>
    </Link>
  );
}
