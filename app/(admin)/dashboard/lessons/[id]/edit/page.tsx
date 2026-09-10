import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialForm } from "@/components/admin/editorial-form";
import { normalizeTiptapContent } from "@/lib/content/tiptap";
import { updateLessonAction } from "@/server/actions/editorial";
import { lessonsService } from "@/server/services/lessons.service";

export const dynamic = "force-dynamic";

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await lessonsService.findById(id);
  if (!lesson) notFound();
  return (
    <>
      <Link
        className="text-sm text-ink-soft hover:underline"
        href="/dashboard/lessons"
      >
        ← Dərslərə qayıt
      </Link>
      <h1 className="mt-5 font-serif text-5xl">Dərsi redaktə et</h1>
      <EditorialForm
        action={updateLessonAction.bind(null, lesson.id)}
        initial={{
          ...lesson,
          contentJson: normalizeTiptapContent(lesson.contentJson),
        }}
        kind="lesson"
        submitLabel="Dəyişiklikləri saxla"
      />
    </>
  );
}
