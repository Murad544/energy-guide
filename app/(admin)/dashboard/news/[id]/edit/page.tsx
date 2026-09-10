import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialForm } from "@/components/admin/editorial-form";
import { normalizeTiptapContent } from "@/lib/content/tiptap";
import { updateNewsAction } from "@/server/actions/editorial";
import { newsService } from "@/server/services/news.service";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await newsService.findById(id);
  if (!article) notFound();
  return (
    <>
      <Link
        className="text-sm text-ink-soft hover:underline"
        href="/dashboard/news"
      >
        ← Xəbərlərə qayıt
      </Link>
      <h1 className="mt-5 font-serif text-5xl">Xəbəri redaktə et</h1>
      <EditorialForm
        action={updateNewsAction.bind(null, article.id)}
        initial={{
          ...article,
          contentJson: normalizeTiptapContent(article.contentJson),
        }}
        kind="news"
        submitLabel="Dəyişiklikləri saxla"
      />
    </>
  );
}
