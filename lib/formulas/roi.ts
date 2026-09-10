export function calculateRoi(
  costUsd: number,
  monthlySavingsAzn: number,
  rateAznPerUsd: number,
) {
  const annualSavingsUsd = (monthlySavingsAzn / rateAznPerUsd) * 12;
  return {
    paybackYears: costUsd / annualSavingsUsd,
    savings25: (monthlySavingsAzn * 12 * 25) / rateAznPerUsd,
  };
}
