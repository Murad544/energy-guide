import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteNewsAction } from "@/server/actions/editorial";
import { newsService } from "@/server/services/news.service";

export const dynamic = "force-dynamic";

export default async function NewsAdminPage() {
  const articles = await newsService.listAll();
  return (
    <>
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-sm uppercase tracking-[.2em] text-copper">
            Məzmun
          </p>
          <h1 className="mt-2 font-serif text-5xl">Xəbərlər</h1>
        </div>
        <Link
          className="bg-ink px-5 py-3 font-semibold text-paper"
          href="/dashboard/news/new"
        >
          Yeni xəbər
        </Link>
      </div>
      <div className="mt-10 overflow-hidden border bg-paper">
        {articles.length ? (
          articles.map((article) => (
            <div
              className="grid gap-3 border-b p-4 last:border-0 md:grid-cols-[1fr_120px_120px] md:items-center"
              key={article.id}
            >
              <div>
                <strong>{article.title}</strong>
                <span className="mt-1 block text-sm text-ink-soft">
                  /{article.slug} ·{" "}
                  {article.updatedAt.toLocaleDateString("az-AZ")}
                </span>
              </div>
              <span
                className={
                  article.published
                    ? "text-sm text-teal"
                    : "text-sm text-copper"
                }
              >
                {article.published ? "Nəşrdə" : "Qaralama"}
              </span>
              <div className="flex gap-4">
                <Link
                  className="text-sm font-semibold hover:underline"
                  href={`/dashboard/news/${article.id}/edit`}
                >
                  Redaktə
                </Link>
                <form>
                  <DeleteButton
                    action={deleteNewsAction.bind(null, article.id)}
                  />
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="p-8 text-ink-soft">Hələ xəbər yoxdur.</p>
        )}
      </div>
    </>
  );
}
