import Link from "next/link";
import { ArrowUpRight, BookOpen, Calculator, Newspaper } from "lucide-react";
import { siteCopy } from "@/lib/copy/az";

const destinations = [
  { href: "/knowledge", icon: BookOpen, action: "Dərsləri kəşf et" },
  { href: "/calculators", icon: Calculator, action: "Hesablamaya keç" },
  { href: "/news", icon: Newspaper, action: "Yenilikləri izlə" },
];
export function Lede() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">ADDIM-ADDIM İRƏLİLƏYİN</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Haradan başlamaq istəyirsiniz?
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-6 text-ink-soft">
          İlk sualdan əsaslandırılmış qərara qədər yanınızdayıq.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {siteCopy.home.principles.map((item, index) => {
          const { href, icon: Icon, action } = destinations[index];
          return (
            <Link
              className="feature-card home-depth-card group flex flex-col rounded-xl border bg-white p-7"
              href={href}
              key={item.number}
            >
              <div className="flex items-center justify-between">
                <span className="home-depth-icon flex h-12 w-12 items-center justify-center rounded-xl bg-paper-dim text-teal">
                  <Icon size={23} />
                </span>
                <span className="text-xs font-medium text-ink-soft">
                  / {item.number}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mb-8 mt-3 text-sm leading-7 text-ink-soft">
                {item.text}
              </p>
              <span className="mt-auto flex items-center justify-between border-t pt-5 text-sm font-semibold">
                {action}
                <ArrowUpRight
                  size={19}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
