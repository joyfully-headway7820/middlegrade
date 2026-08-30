import { isFiniteChartValue } from "@/utils/isFiniteChartValue";

export const trimChartSeries = <T extends { value: number | null }>(
  items: T[],
): T[] => {
  let start = 0;
  let end = items.length - 1;

  while (start <= end && !isFiniteChartValue(items[start]?.value ?? null)) {
    start += 1;
  }

  while (end >= start && !isFiniteChartValue(items[end]?.value ?? null)) {
    end -= 1;
  }

  return items.slice(start, end + 1);
};
