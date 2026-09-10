import Link from "next/link";
import { EditorialForm } from "@/components/admin/editorial-form";
import { EMPTY_TIPTAP_DOCUMENT } from "@/lib/content/tiptap";
import { createLessonAction } from "@/server/actions/editorial";

export default function NewLessonPage() {
  return (
    <>
      <Link
        className="text-sm text-ink-soft hover:underline"
        href="/dashboard/lessons"
      >
        ← Dərslərə qayıt
      </Link>
      <h1 className="mt-5 font-serif text-5xl">Yeni dərs</h1>
      <EditorialForm
        action={createLessonAction}
        initial={{
          title: "",
          slug: "",
          number: 1,
          category: "lesson",
          intro: "",
          published: false,
          contentJson: EMPTY_TIPTAP_DOCUMENT,
        }}
        kind="lesson"
        submitLabel="Dərsi yarat"
      />
    </>
  );
}
