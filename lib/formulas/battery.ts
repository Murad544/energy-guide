export function calculateBattery(
  dailyLoadKwh: number,
  autonomyDays: number,
  dod: number,
) {
  const capacityKwh = (dailyLoadKwh * autonomyDays) / dod;
  return { capacityKwh, priceUsd: capacityKwh * 200 };
}
