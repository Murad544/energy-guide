"use client";

import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { LessonSection } from "./lesson-section";

type Lesson = {
  id: string;
  number: number;
  slug: string;
  title: string;
  intro: string;
};

export function LessonLibrary({ lessons }: { lessons: Lesson[] }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const terms = query.trim().toLocaleLowerCase("az").split(/\s+/).filter(Boolean);
  const filtered = lessons.filter((lesson) => {
    const text = `${lesson.title} ${lesson.intro} ${lesson.number}`.toLocaleLowerCase("az");
    return terms.every((term) => text.includes(term));
  });

  if (!lessons.length) {
    return <p className="py-12 text-center text-ink-soft">Hazırda nəşr edilmiş dərs yoxdur.</p>;
  }

  return (
    <>
      <label htmlFor="lesson-search" className="mb-2 block text-sm font-semibold">Dərslərdə axtar</label>
      <div className="relative">
        <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-4 text-ink-soft" />
        <input
          ref={input}
          id="lesson-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Məsələn: panel, batareya…"
          className="min-h-12 w-full rounded-xl border bg-white py-3 pl-12 pr-4 text-base"
          aria-describedby="lesson-count"
        />
      </div>
      <div className="mb-6 mt-3 flex min-h-11 items-center justify-between gap-4">
        <p id="lesson-count" role="status" className="text-sm text-ink-soft">{filtered.length} dərs tapıldı</p>
        {query && (
          <button type="button" className="min-h-11 rounded-lg px-3 text-sm font-semibold text-teal hover:bg-paper-dim" onClick={() => { setQuery(""); input.current?.focus(); }}>Axtarışı təmizlə</button>
        )}
      </div>
      {filtered.length ? filtered.map((lesson) => (
        <LessonSection key={lesson.id} {...lesson} />
      )) : (
        <div className="rounded-xl border bg-white p-8 text-center">
          <h2 className="text-lg font-semibold">Uyğun dərs tapılmadı</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">Başqa açar söz sınayın və ya axtarışı təmizləyin.</p>
        </div>
      )}
    </>
  );
}
