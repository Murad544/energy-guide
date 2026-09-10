import Link from "next/link";
import { PageHeading } from "@/components/layout/page-heading";
import { siteCopy } from "@/lib/copy/az";
import { getPublishedNews } from "@/server/queries/news";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articles = await getPublishedNews();
  return (
    <>
      <PageHeading {...siteCopy.news} />
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-2 md:px-10">
        {articles.length ? (
          articles.map((article) => (
            <Link
              className="group border bg-paper p-6 transition-colors hover:bg-white"
              href={`/news/${article.slug}`}
              key={article.id}
            >
              <time className="text-sm uppercase tracking-[.15em] text-copper">
                {(article.publishedAt ?? article.createdAt).toLocaleDateString(
                  "az-AZ",
                )}
              </time>
              <h2 className="mt-4 font-serif text-3xl group-hover:underline">
                {article.title}
              </h2>
              {article.excerpt ? (
                <p className="mt-3 leading-7 text-ink-soft">
                  {article.excerpt}
                </p>
              ) : null}
              <span className="mt-8 inline-block text-sm font-semibold">
                Oxumağa davam et →
              </span>
            </Link>
          ))
        ) : (
          <p className="py-12 text-ink-soft">
            Hazırda nəşr edilmiş xəbər yoxdur.
          </p>
        )}
      </section>
    </>
  );
}
