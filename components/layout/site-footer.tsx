import Link from "next/link";
import { ArrowUpRight, Sun } from "lucide-react";
import { siteCopy } from "@/lib/copy/az";
export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <Link
              href="/"
              className="flex items-center gap-3 text-lg font-semibold"
            >
              <Sun className="text-amber" size={23} />
              {siteCopy.brand}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-paper/60">
              {siteCopy.footer.note}
            </p>
          </div>
          <nav
            aria-label="Alt naviqasiya"
            className="flex flex-wrap items-start gap-x-8 gap-y-4"
          >
            {siteCopy.nav.slice(1).map((item) => (
              <Link
                className="text-sm text-paper/75 transition-colors hover:text-amber"
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-paper/50">
          <span>Günəş enerjisi haqqında. Azərbaycan dilində.</span>
          <Link
            className="flex items-center gap-2 hover:text-paper"
            href="/login"
          >
            {siteCopy.footer.admin}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
