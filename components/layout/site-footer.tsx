import Link from "next/link";
import { siteCopy } from "@/lib/copy/az";

export function SiteFooter() {
  return (
    <footer className="border-t bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-10 text-sm md:flex-row md:px-10">
        <div>
          <p className="font-serif text-xl">{siteCopy.brand}</p>
          <p className="mt-2 text-paper/60">{siteCopy.footer.note}</p>
        </div>
        <Link
          className="self-start border-b border-paper/40 pb-1"
          href="/login"
        >
          {siteCopy.footer.admin}
        </Link>
      </div>
    </footer>
  );
}
