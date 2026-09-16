"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, Sun, X } from "lucide-react";
import { siteCopy } from "@/lib/copy/az";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-paper/95 backdrop-blur-xl">
      <a href="#main-content" className="skip-link">
        Məzmuna keç
      </a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
        <Link
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
          href="/"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-amber">
            <Sun size={23} />
          </span>
          {siteCopy.brand}
          <span className="text-teal">.</span>
        </Link>
        <nav
          aria-label="Əsas naviqasiya"
          className="hidden items-center gap-1 md:flex"
        >
          {siteCopy.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${active ? "bg-paper-dim text-ink" : "text-ink-soft hover:bg-paper-dim"}`}
                aria-current={active ? "page" : undefined}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/calculators"
          className="hidden items-center gap-2 text-sm font-semibold lg:flex"
        >
          Hesablamağa başla <ArrowUpRight size={18} />
        </Link>
        <button
          type="button"
          aria-label={open ? "Menyunu bağla" : "Menyunu aç"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex h-11 w-11 items-center justify-center rounded-lg border md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobil naviqasiya"
          className="absolute left-0 right-0 border-b bg-paper p-5 shadow-lg md:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          {siteCopy.nav.map((item) => (
            <Link
              onClick={() => setOpen(false)}
              aria-current={
                (
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                )
                  ? "page"
                  : undefined
              }
              className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-paper-dim aria-[current=page]:bg-paper-dim"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
