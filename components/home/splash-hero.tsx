import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { SunMark } from "@/components/home/sun-mark";
import { siteCopy } from "@/lib/copy/az";

export function SplashHero() {
  const copy = siteCopy.home;
  return (
    <section className="editorial-grid border-b">
      <div className="mx-auto grid min-h-[76vh] max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-[1.3fr_0.7fr] md:px-10">
        <div>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-copper">
            {copy.eyebrow}
          </p>
          <h1 className="max-w-4xl font-serif text-5xl leading-[0.96] tracking-[-0.04em] md:text-7xl lg:text-8xl">
            {copy.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-soft">
            {copy.lede}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-3 bg-ink px-6 py-4 text-sm font-semibold text-paper"
              href="/calculators"
            >
              {copy.primaryAction}
              <ArrowDownRight size={18} />
            </Link>
            <Link
              className="inline-flex items-center border px-6 py-4 text-sm font-semibold"
              href="/knowledge"
            >
              {copy.secondaryAction}
            </Link>
          </div>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <SunMark />
          <p className="border-t pt-5 text-sm leading-6 text-ink-soft">
            {copy.note}
          </p>
        </div>
      </div>
    </section>
  );
}
