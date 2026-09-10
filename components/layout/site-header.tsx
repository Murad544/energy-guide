import Link from "next/link";
import { Menu } from "lucide-react";
import { siteCopy } from "@/lib/copy/az";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link className="font-serif text-xl font-semibold" href="/">
          {siteCopy.brand}
        </Link>
        <nav
          aria-label="Əsas naviqasiya"
          className="hidden items-center gap-8 md:flex"
        >
          {siteCopy.nav.map((item) => (
            <Link
              className="text-sm text-ink-soft transition-colors hover:text-ink"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="relative md:hidden">
          <summary
            aria-label="Menyunu aç"
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center border"
          >
            <Menu size={20} />
          </summary>
          <nav
            aria-label="Mobil naviqasiya"
            className="absolute right-0 top-12 flex w-64 flex-col border bg-paper p-3"
          >
            {siteCopy.nav.map((item) => (
              <Link
                className="border-b px-3 py-4 text-sm last:border-0"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
