export type PvSizeInput = {
  monthlyKwh: number;
  peakSunHours: number;
  panelW: number;
  tariff: number;
};

export function calculatePvSize(input: PvSizeInput) {
  const dailyKwh = input.monthlyKwh / 30;
  const systemKw = dailyKwh / input.peakSunHours / 0.8;
  const panels = Math.ceil((systemKw * 1000) / input.panelW);
  return {
    dailyKwh,
    systemKw,
    panels,
    roofArea: panels * 1.9,
    monthlySavings: input.monthlyKwh * input.tariff,
  };
}
