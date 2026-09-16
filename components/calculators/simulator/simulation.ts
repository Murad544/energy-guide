export type Mode = "onGrid" | "offGrid" | "hybrid";
export type Part = "panel" | "inverter" | "house" | "battery" | "grid";

// Instantaneous, lossless teaching model: 5 kW PV and up to 2 kW battery power.
// Battery availability is a scenario switch, not a time-based charge simulation.
export function simulate(
  mode: Mode,
  sunlight: number,
  demand: number,
  batteryAvailable: boolean,
) {
  const solar = (5 * Math.max(0, Math.min(100, sunlight))) / 100;
  const load = Math.max(0, demand);
  const hasBattery = mode !== "onGrid";
  const hasGrid = mode !== "offGrid";
  const deficit = Math.max(0, load - solar);
  const surplus = Math.max(0, solar - load);
  const discharge = hasBattery && batteryAvailable ? Math.min(2, deficit) : 0;
  const charge = hasBattery ? Math.min(2, surplus) : 0;
  const imported = hasGrid ? deficit - discharge : 0;
  const exported = hasGrid ? surplus - charge : 0;
  const unmet = hasGrid ? 0 : deficit - discharge;
  const curtailed = hasGrid ? 0 : surplus - charge;
  return {
    solar,
    load,
    discharge,
    charge,
    imported,
    exported,
    unmet,
    curtailed,
    supplied: load - unmet,
  };
}
export type Energy = ReturnType<typeof simulate>;
export const parts: Record<Part, { label: string; text: string }> = {
  panel: {
    label: "Panel",
    text: "Günəş işığını elektrik enerjisinə çevirir. İşığı azaltdıqda istehsal da azalır.",
  },
  inverter: {
    label: "İnverter",
    text: "Panellərin sabit cərəyanını evdə istifadə edilən dəyişən cərəyana çevirir və enerji axınını idarə edir.",
  },
  house: {
    label: "Ev",
    text: "Evin enerji tələbatını artıraraq panel, batareya və şəbəkənin yükü necə paylaşdığını izləyin.",
  },
  battery: {
    label: "Batareya",
    text: "Artıq günəş enerjisini saxlayır, istehsal az olduqda evi dəstəkləyir. Bu modeldə doldurma və boşaltma gücü 2 kVt ilə məhduddur.",
  },
  grid: {
    label: "Şəbəkə",
    text: "Çatışmayan enerjini təmin edir. Bu tədris modelində artıq enerjinin şəbəkəyə ötürülməsinə icazə verildiyi fərz olunur.",
  },
};
