import { Lede } from "@/components/home/lede";
import { SplashHero } from "@/components/home/splash-hero";
import { siteCopy } from "@/lib/copy/az";

export default function HomePage() {
  return (
    <>
      <SplashHero />
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-3 px-5 py-10 md:px-10">
          {siteCopy.home.stats.map((stat) => (
            <div
              className="border-r px-4 last:border-0 md:px-8"
              key={stat.label}
            >
              <strong className="block font-serif text-4xl text-amber md:text-6xl">
                {stat.value}
              </strong>
              <span className="mt-2 block text-xs text-paper/60 md:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
      <Lede />
    </>
  );
}
