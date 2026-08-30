export const isFiniteChartValue = (
  value: number | null,
): value is number => typeof value === "number" && Number.isFinite(value);
