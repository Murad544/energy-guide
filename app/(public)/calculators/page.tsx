import { CalculatorWorkspace } from "@/components/calculators/calculator-workspace";
import { PageHeading } from "@/components/layout/page-heading";
import { siteCopy } from "@/lib/copy/az";
export default function CalculatorsPage() {
  return (
    <>
      <PageHeading {...siteCopy.calculators} />
      <CalculatorWorkspace />
    </>
  );
}
