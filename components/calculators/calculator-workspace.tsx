"use client";

import * as Tabs from "@radix-ui/react-tabs";
import {
  Battery,
  ChartNoAxesCombined,
  CircleDollarSign,
  House,
  Info,
  Sun,
  Workflow,
} from "lucide-react";
import { AnnualCalculator } from "./calculators/annual-calculator";
import { BatteryCalculator } from "./calculators/battery-calculator";
import { PvSizeCalculator } from "./calculators/pv-size-calculator";
import { RoiCalculator } from "./calculators/roi-calculator";
import { RoofCalculator } from "./calculators/roof-calculator";
import { SolarSimulator } from "./simulator/solar-simulator";

const calculators = [
  { id: "pv", label: "Sistem ölçüsü", icon: Sun, component: PvSizeCalculator },
  {
    id: "annual",
    label: "İllik istehsal",
    icon: ChartNoAxesCombined,
    component: AnnualCalculator,
  },
  {
    id: "battery",
    label: "Batareya tutumu",
    icon: Battery,
    component: BatteryCalculator,
  },
  {
    id: "roi",
    label: "Geriödəmə",
    icon: CircleDollarSign,
    component: RoiCalculator,
  },
  {
    id: "roof",
    label: "Dam potensialı",
    icon: House,
    component: RoofCalculator,
  },
  {
    id: "flow",
    label: "Sistem simulyatoru",
    icon: Workflow,
    component: SolarSimulator,
  },
];
export function CalculatorWorkspace({
  initialTool = "pv",
}: {
  initialTool?: string;
}) {
  return (
    <Tabs.Root
      defaultValue={
        calculators.some(({ id }) => id === initialTool) ? initialTool : "pv"
      }
      orientation="vertical"
      className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:px-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-14"
    >
      <aside>
        <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-ink-soft">
          Alət seçin
        </p>
        <Tabs.List
          aria-label="Hesablayıcı seçimi"
          className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 lg:grid-cols-1"
        >
          {calculators.map(({ id, label, icon: Icon }) => (
            <Tabs.Trigger
              value={id}
              key={id}
              className="flex min-h-12 items-center gap-3 rounded-lg border border-transparent px-4 py-3 text-left text-sm font-medium text-ink-soft transition-colors hover:bg-paper-dim data-[state=active]:border-ink data-[state=active]:bg-ink data-[state=active]:text-white"
            >
              <Icon className="shrink-0" size={18} />
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </aside>
      <div className="min-w-0">
        {calculators.map(({ id, component: Component }) => (
          <Tabs.Content
            forceMount={id === "flow" ? undefined : true}
            value={id}
            key={id}
            className="animate-enter data-[state=inactive]:hidden"
          >
            <Component />
          </Tabs.Content>
        ))}
        <p className="mt-5 flex items-start gap-2 text-xs leading-6 text-ink-soft">
          <Info size={16} className="mt-1 shrink-0" />
          Nəticələr ilkin qiymətləndirmə üçündür. Dəqiq layihə üçün mütəxəssislə
          məsləhətləşin.
        </p>
      </div>
    </Tabs.Root>
  );
}
