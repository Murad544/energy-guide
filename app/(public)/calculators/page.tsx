import { AnnualCalculator } from "@/components/calculators/calculators/annual-calculator";
import { BatteryCalculator } from "@/components/calculators/calculators/battery-calculator";
import { PvSizeCalculator } from "@/components/calculators/calculators/pv-size-calculator";
import { RoiCalculator } from "@/components/calculators/calculators/roi-calculator";
import { RoofCalculator } from "@/components/calculators/calculators/roof-calculator";
import { SolarSimulator } from "@/components/calculators/simulator/solar-simulator";
import { PageHeading } from "@/components/layout/page-heading";
import { siteCopy } from "@/lib/copy/az";

export default function CalculatorsPage() {
  const copy = siteCopy.calculators;
  return (
    <>
      <PageHeading {...copy} />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:px-10">
        <PvSizeCalculator />
        <AnnualCalculator />
        <BatteryCalculator />
        <RoiCalculator />
        <RoofCalculator />
        <SolarSimulator />
      </div>
    </>
  );
}
