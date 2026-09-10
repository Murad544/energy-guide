import { notFound } from "next/navigation";
import { RichText } from "@/components/content/rich-text";
import { getNewsBySlug } from "@/server/queries/news";

export const dynamic = "force-dynamic";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <time className="text-sm font-semibold uppercase tracking-[.2em] text-copper">
        {new Date(article.publishedAt ?? article.createdAt).toLocaleDateString(
          "az-AZ",
        )}
      </time>
      <h1 className="mt-5 font-serif text-5xl tracking-[-0.03em] md:text-7xl">
        {article.title}
      </h1>
      {article.excerpt ? (
        <p className="mt-6 text-xl leading-8 text-ink-soft">
          {article.excerpt}
        </p>
      ) : null}
      <div className="mt-12">
        <RichText content={article.contentJson} />
      </div>
    </article>
  );
}
