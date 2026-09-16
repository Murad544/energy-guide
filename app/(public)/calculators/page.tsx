import { CalculatorWorkspace } from "@/components/calculators/calculator-workspace";
import { PageHeading } from "@/components/layout/page-heading";
import { siteCopy } from "@/lib/copy/az";
export default async function CalculatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string | string[] }>;
}) {
  const { tool } = await searchParams;
  return (
    <>
      <PageHeading {...siteCopy.calculators} />
      <CalculatorWorkspace
        key={typeof tool === "string" ? tool : "pv"}
        initialTool={typeof tool === "string" ? tool : "pv"}
      />
    </>
  );
}
