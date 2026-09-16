import { LessonLibrary } from '@/components/knowledge/lesson-library';
import { PageHeading } from '@/components/layout/page-heading';
import { siteCopy } from '@/lib/copy/az';
import { getPublishedLessons } from '@/server/queries/lessons';

export const dynamic = 'force-dynamic';

export default async function KnowledgePage() {
  const lessons = await getPublishedLessons();
  return (
    <>
      <PageHeading
        eyebrow={`${lessons.length} dərslik kurs`}
        title={siteCopy.knowledge.title}
        lede={siteCopy.knowledge.lede}
      />
      <section className='mx-auto max-w-5xl px-5 py-16 md:px-10'>
        <LessonLibrary lessons={lessons.map(({ id, number, slug, title, intro }) => ({ id, number, slug, title, intro: intro ?? '' }))} />
      </section>
    </>
  );
}
