import { notFound } from "next/navigation";
import { RichText } from "@/components/content/rich-text";
import { getLessonBySlug } from "@/server/queries/lessons";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper">
        Dərs {String(lesson.number).padStart(2, "0")}
      </p>
      <h1 className="mt-5 font-serif text-5xl tracking-[-0.03em] md:text-7xl">
        {lesson.title}
      </h1>
      {lesson.intro ? (
        <p className="mt-6 text-xl leading-8 text-ink-soft">{lesson.intro}</p>
      ) : null}
      <div className="mt-12">
        <RichText content={lesson.contentJson} />
      </div>
    </article>
  );
}
