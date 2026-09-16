import { Lede } from "@/components/home/lede";
import { SplashHero } from "@/components/home/splash-hero";
import { BookOpen, Calculator, Workflow } from "lucide-react";

const highlights = [
  {
    icon: BookOpen,
    title: "Sadə dildə bilik",
    text: "Təməldən praktik seçimə",
  },
  {
    icon: Calculator,
    title: "5 praktik hesablayıcı",
    text: "Evinizə uyğun ilkin hesab",
  },
  {
    icon: Workflow,
    title: "İnteraktiv sistem xəritəsi",
    text: "Enerjinin yolunu izləyin",
  },
];
export default function HomePage() {
  return (
    <>
      <SplashHero />
      <section className="border-b bg-paper-dim/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 md:px-10">
          {highlights.map(({ icon: Icon, title, text }) => (
            <div
              className="flex items-center gap-4 sm:justify-center"
              key={title}
            >
              <Icon
                size={23}
                strokeWidth={1.5}
                className="shrink-0 text-teal"
              />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs text-ink-soft">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Lede />
    </>
  );
}
