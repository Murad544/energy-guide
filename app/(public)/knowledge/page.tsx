import { LessonSection } from "@/components/knowledge/lesson-section";
import { PageHeading } from "@/components/layout/page-heading";
import { siteCopy } from "@/lib/copy/az";
import { getPublishedLessons } from "@/server/queries/lessons";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const lessons = await getPublishedLessons();
  return (
    <>
      <PageHeading
        eyebrow={`${lessons.length} dərslik kurs`}
        title={siteCopy.knowledge.title}
        lede={siteCopy.knowledge.lede}
      />
      <section className="mx-auto max-w-5xl px-5 py-16 md:px-10">
        {lessons.length ? (
          lessons.map((lesson) => (
            <LessonSection
              intro={lesson.intro ?? ""}
              key={lesson.id}
              number={lesson.number}
              slug={lesson.slug}
              title={lesson.title}
            />
          ))
        ) : (
          <p className="py-12 text-center text-ink-soft">
            Hazırda nəşr edilmiş dərs yoxdur.
          </p>
        )}
      </section>
    </>
  );
}
