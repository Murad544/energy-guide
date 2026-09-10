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
      className="group grid gap-5 border-t py-8 transition-colors hover:bg-paper-dim md:grid-cols-[100px_1fr_auto] md:items-center md:px-5"
      href={`/knowledge/${slug}`}
    >
      <span className="font-serif text-3xl text-amber-dim">
        {String(number).padStart(2, "0")}
      </span>
      <span>
        <strong className="block font-serif text-2xl font-normal group-hover:text-copper">
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
