import Link from "next/link";
import { NewsList } from "@/components/admin/news-list";
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
      <NewsList
        articles={articles.map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          published: article.published,
          updatedAt: new Date(article.updatedAt).toLocaleDateString("az-AZ"),
        }))}
      />
    </>
  );
}
