import { isFiniteChartValue } from "@/utils/isFiniteChartValue";

export const lastChartDatum = <T extends { value: number | null }>(
  items: T[],
): T | null => {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];

    if (item && isFiniteChartValue(item.value)) {
      return item;
    }
  }

  return null;
};
