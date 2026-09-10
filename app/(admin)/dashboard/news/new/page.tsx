import Link from "next/link";
import { EditorialForm } from "@/components/admin/editorial-form";
import { EMPTY_TIPTAP_DOCUMENT } from "@/lib/content/tiptap";
import { createNewsAction } from "@/server/actions/editorial";

export default function NewNewsPage() {
  return (
    <>
      <Link
        className="text-sm text-ink-soft hover:underline"
        href="/dashboard/news"
      >
        ← Xəbərlərə qayıt
      </Link>
      <h1 className="mt-5 font-serif text-5xl">Yeni xəbər</h1>
      <EditorialForm
        action={createNewsAction}
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          published: false,
          contentJson: EMPTY_TIPTAP_DOCUMENT,
        }}
        kind="news"
        submitLabel="Xəbəri yarat"
      />
    </>
  );
}
