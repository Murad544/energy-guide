"use client";

import { useActionState } from "react";
import type { JSONContent } from "@tiptap/react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { ActionResult } from "@/types/api";

type FormAction = (
  previous: ActionResult | null,
  formData: FormData,
) => Promise<ActionResult>;

type InitialContent = {
  title: string;
  slug: string;
  published: boolean;
  contentJson: JSONContent;
  number?: number;
  category?: string | null;
  intro?: string | null;
  excerpt?: string | null;
};

const inputClass = "mt-2 h-11 w-full border bg-white px-3 font-normal";

export function EditorialForm({
  kind,
  initial,
  action,
  submitLabel,
}: {
  kind: "lesson" | "news";
  initial: InitialContent;
  action: FormAction;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-10 grid gap-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold">
          Başlıq
          <input
            className={inputClass}
            defaultValue={initial.title}
            maxLength={180}
            name="title"
            required
          />
        </label>
        <label className="text-sm font-semibold">
          Slug
          <input
            className={inputClass}
            defaultValue={initial.slug}
            maxLength={120}
            name="slug"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            placeholder="meselen-yeni-xeber"
            required
          />
        </label>
        {kind === "lesson" ? (
          <>
            <label className="text-sm font-semibold">
              Dərs nömrəsi
              <input
                className={inputClass}
                defaultValue={initial.number}
                min={1}
                name="number"
                required
                type="number"
              />
            </label>
            <label className="text-sm font-semibold">
              Kateqoriya
              <input
                className={inputClass}
                defaultValue={initial.category ?? ""}
                maxLength={80}
                name="category"
              />
            </label>
          </>
        ) : null}
      </div>
      <label className="text-sm font-semibold">
        {kind === "lesson" ? "Qısa giriş" : "Qısa təsvir"}
        <textarea
          className="mt-2 min-h-24 w-full border bg-white p-3 font-normal"
          defaultValue={
            kind === "lesson" ? (initial.intro ?? "") : (initial.excerpt ?? "")
          }
          maxLength={500}
          name={kind === "lesson" ? "intro" : "excerpt"}
        />
      </label>
      <label className="text-sm font-semibold">Məzmun</label>
      <RichTextEditor initialContent={initial.contentJson} />
      <label className="flex items-center gap-3 border bg-white p-4 text-sm font-semibold">
        <input
          defaultChecked={initial.published}
          name="published"
          type="checkbox"
        />{" "}
        Nəşr et
      </label>
      {state && !state.ok ? (
        <p className="border border-copper bg-white p-4 text-sm text-copper">
          {state.error.message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <button
          className="bg-ink px-6 py-3 font-semibold text-paper disabled:opacity-50"
          disabled={pending}
          type="submit"
        >
          {pending ? "Saxlanılır…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
