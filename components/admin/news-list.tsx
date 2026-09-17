"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  deleteNewsAction,
  deleteNewsBatchAction,
} from "@/server/actions/editorial";

type Article = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  updatedAt: string;
};

export function NewsList({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const selectedIds = articles
    .filter((article) => selected.includes(article.id))
    .map((article) => article.id);
  const allSelected =
    articles.length > 0 && selectedIds.length === articles.length;

  function deleteSelected() {
    if (!selectedIds.length || pending) return;
    if (
      !window.confirm(
        `${selectedIds.length} xəbəri silmək istədiyinizə əminsiniz?`,
      )
    )
      return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await deleteNewsBatchAction(selectedIds);
        if (!result.ok) {
          setError(result.error.message);
          return;
        }
        setSelected([]);
      } catch {
        setError("Xəbərlər silinmədi. Yenidən cəhd edin.");
      }
    });
  }

  return (
    <fieldset
      disabled={pending}
      aria-busy={pending}
      className="mt-10 min-w-0 overflow-hidden border bg-paper"
    >
      {articles.length ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(node) => {
                  if (node)
                    node.indeterminate = selectedIds.length > 0 && !allSelected;
                }}
                onChange={(event) =>
                  setSelected(
                    event.target.checked
                      ? articles.map((article) => article.id)
                      : [],
                  )
                }
              />
              Hamısını seç
            </label>
            <button
              type="button"
              disabled={!selectedIds.length || pending}
              onClick={deleteSelected}
              className="text-sm font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Silinir…" : `Seçilənləri sil (${selectedIds.length})`}
            </button>
          </div>
          {articles.map((article) => (
            <div
              className="flex items-start gap-3 border-b p-4 last:border-0"
              key={article.id}
            >
              <input
                type="checkbox"
                className="mt-1"
                aria-label={`${article.title} seç`}
                checked={selectedIds.includes(article.id)}
                onChange={(event) =>
                  setSelected(
                    event.target.checked
                      ? [...selectedIds, article.id]
                      : selectedIds.filter((id) => id !== article.id),
                  )
                }
              />
              <div className="grid min-w-0 flex-1 gap-3 md:grid-cols-[1fr_120px_120px] md:items-center">
                <div>
                  <strong>{article.title}</strong>
                  <span className="mt-1 block text-sm text-ink-soft">
                    /{article.slug} · {article.updatedAt}
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
            </div>
          ))}
        </>
      ) : (
        <p className="p-8 text-ink-soft">Hələ xəbər yoxdur.</p>
      )}
      {error && (
        <p role="alert" className="p-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
