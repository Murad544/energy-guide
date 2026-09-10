import { siteCopy } from "@/lib/copy/az";

export function Lede() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <div className="grid border-y md:grid-cols-3">
        {siteCopy.home.principles.map((item) => (
          <article
            className="border-b py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            key={item.number}
          >
            <span className="font-serif text-2xl text-amber-dim">
              {item.number}
            </span>
            <h2 className="mt-8 font-serif text-3xl">{item.title}</h2>
            <p className="mt-4 max-w-sm leading-7 text-ink-soft">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
