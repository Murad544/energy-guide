"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Battery, House, Sun, Workflow } from "lucide-react";

const goals = [
  {
    id: "pv",
    label: "Sistem seçmək",
    icon: Sun,
    title: "Evinizə hansı gücdə sistem lazımdır?",
    text: "Elektrik sərfiyyatınıza əsasən günəş paneli sisteminin ilkin ölçüsünü hesablayın.",
    action: "Sistem ölçüsünü hesabla",
  },
  {
    id: "roof",
    label: "Damı qiymətləndirmək",
    icon: House,
    title: "Damınızın potensialını kəşf edin",
    text: "Damın sahəsi və panel ölçüləri ilə neçə panel yerləşdirə biləcəyinizi araşdırın.",
    action: "Dam potensialını hesabla",
  },
  {
    id: "battery",
    label: "Ehtiyat enerji",
    icon: Battery,
    title: "Enerjini sonraya saxlayın",
    text: "Enerji ehtiyacınıza və ehtiyat müddətinə uyğun batareya tutumunu hesablayın.",
    action: "Batareya tutumunu hesabla",
  },
  {
    id: "flow",
    label: "Sistemi anlamaq",
    icon: Workflow,
    title: "Enerjinin yolunu izləyin",
    text: "Şəbəkəyə bağlı, müstəqil və hibrid sistemlər arasında keçid edərək enerji axınını araşdırın.",
    action: "Simulyatoru aç",
  },
];

export function GoalSelector() {
  const [selected, setSelected] = useState(goals[0]);
  const Icon = selected.icon;

  return (
    <section
      className="mx-auto max-w-7xl px-5 pt-16 md:px-10 md:pt-24"
      aria-labelledby="goal-heading"
    >
      <div className="rounded-2xl border bg-paper-dim/60 p-6 md:p-10">
        <p className="eyebrow">SİZƏ UYĞUN BAŞLANĞIC</p>
        <h2
          id="goal-heading"
          className="mt-4 text-3xl font-semibold tracking-tight"
        >
          Nə etmək istəyirsiniz?
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          Məqsədinizi seçin, uyğun alətlə davam edin.
        </p>
        <div
          className="mt-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Məqsəd seçimi"
        >
          {goals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              aria-pressed={selected.id === goal.id}
              aria-controls="goal-result"
              onClick={() => setSelected(goal)}
              className="min-h-12 rounded-full border bg-white px-5 py-3 text-sm font-medium transition-colors hover:border-teal aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
            >
              {goal.label}
            </button>
          ))}
        </div>
        <div
          id="goal-result"
          className="mt-6 rounded-xl border bg-white p-6 md:p-8"
        >
          <div
            aria-live="polite"
            aria-atomic="true"
            className="flex items-start gap-4"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber text-ink">
              <Icon size={24} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-xl font-semibold">{selected.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-soft">
                {selected.text}
              </p>
            </div>
          </div>
          <Link
            href={`/calculators?tool=${selected.id}`}
            className="button-primary mt-6"
          >
            {selected.action}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
