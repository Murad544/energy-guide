export function calculateAnnualProduction(
  systemKw: number,
  peakSunHours: number,
  degradationPct: number,
  year: number,
) {
  const year1Kwh = systemKw * peakSunHours * 365;
  const yearNKwh = year1Kwh * (1 - degradationPct / 100) ** (year - 1);
  return { year1Kwh, yearNKwh };
}
