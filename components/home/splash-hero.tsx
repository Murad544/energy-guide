import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sun, Zap } from "lucide-react";

export function SplashHero() {
  return (
    <section className="overflow-hidden border-b">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="animate-enter">
          <p className="eyebrow">
            <span className="h-2 w-2 rounded-full bg-teal" /> DAHA AYDIN ENERJİ
            QƏRARLARI
          </p>
          <h1 className="mt-7 text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl xl:text-7xl">
            Günəşdən başlayan
            <br />
            <span className="text-teal">yeni imkanlar.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-ink-soft md:text-lg md:leading-8">
            Günəş enerjisini anlayın, evinizin potensialını hesablayın və
            növbəti addımı əminliklə atın.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="button-primary" href="/calculators">
              Sistemi hesabla <ArrowUpRight size={19} />
            </Link>
            <Link className="button-secondary" href="/knowledge">
              Bilik mərkəzi <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-xs leading-5 text-ink-soft">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
              <Sun size={17} />
            </span>
            Azərbaycan şəraiti üçün praktik bələdçi
          </div>
        </div>
        <div className="solar-scene animate-enter relative isolate overflow-hidden rounded-2xl bg-ink p-6 text-white sm:p-8">
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-medium tracking-[.14em] text-white/70">
              GÜNƏŞDƏN EVİNİZƏ
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-[10px] tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" /> ENERJİ
              AXINI
            </span>
          </div>
          <svg
            viewBox="0 0 480 345"
            className="solar-illustration relative z-10 my-4 w-full"
            role="img"
            aria-label="Günəş işığı panellərə düşür, istehsal olunan elektrik evə ötürülür"
          >
            <defs>
              <pattern
                id="panel-grid"
                width="28"
                height="23"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M28 0H0V23"
                  fill="none"
                  stroke="#85b7a5"
                  strokeWidth=".8"
                />
              </pattern>
              <radialGradient id="sun-glow">
                <stop stopColor="#d9f279" stopOpacity=".23" />
                <stop offset="1" stopColor="#d9f279" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="355" cy="85" r="100" fill="url(#sun-glow)" />
            <g
              className="solar-rays"
              style={{ transformOrigin: "355px 85px" }}
              stroke="#d9f279"
              strokeWidth="2"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <path
                  key={i}
                  d="M355 37V27"
                  transform={`rotate(${i * 30} 355 85)`}
                />
              ))}
            </g>
            <circle cx="355" cy="85" r="28" fill="#d9f279" />
            <path
              d="M325 125L258 185M340 139L285 194"
              stroke="#d9f279"
              opacity=".5"
              strokeDasharray="4 9"
              className="flow-line"
            />
            <path
              d="M30 276L232 167L456 268L254 337Z"
              fill="#25473d"
              stroke="#436457"
            />
            <path
              d="M296 229V164L354 134L408 167V235L353 265Z"
              fill="#dce7de"
            />
            <path d="M354 191L408 167V235L354 265Z" fill="#aabfb2" />
            <path
              d="M281 173L349 120L424 164L356 202Z"
              fill="#426355"
              stroke="#8faa9b"
            />
            <path
              d="M304 163L350 133L404 165L357 190Z"
              fill="#173c32"
              stroke="#9abc9f"
            />
            <path
              d="M320 153L374 179M335 143L389 172M329 177L374 147M345 185L389 156"
              stroke="#729d87"
            />
            <path d="M317 204V230L337 241V215Z" fill="#183e32" />
            <path d="M370 210L391 200V220L370 231Z" fill="#e0ee94" />
            <path
              d="M95 263V225M225 284V244"
              stroke="#94afa0"
              strokeWidth="5"
            />
            <path
              d="M65 223L118 149L265 203L229 284Z"
              fill="#12372d"
              stroke="#a5c7af"
              strokeWidth="2"
            />
            <path
              d="M65 223L118 149L265 203L229 284Z"
              fill="url(#panel-grid)"
            />
            <path
              d="M238 271L275 289L333 258"
              fill="none"
              stroke="#d9f279"
              strokeWidth="2"
              className="flow-line"
            />
            <circle cx="333" cy="258" r="4" fill="#d9f279" />
          </svg>
          <div className="relative z-10 flex items-center gap-3 border-t border-white/15 pt-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber text-ink">
              <Zap size={20} />
            </span>
            <div>
              <p className="text-sm font-medium">Təmiz enerji. Ağıllı seçim.</p>
              <p className="mt-1 text-xs text-white/60">
                Panel → inverter → ev
              </p>
            </div>
            <ArrowUpRight className="ml-auto text-amber" size={22} />
          </div>
        </div>
      </div>
    </section>
  );
}
