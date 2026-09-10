export function calculateRoof(
  area: number,
  panelW: number,
  orientationFactor: number,
) {
  const maxPanels = Math.floor(area / 1.9);
  return {
    maxPanels,
    effectiveKw: (maxPanels * panelW * orientationFactor) / 1000,
  };
}
