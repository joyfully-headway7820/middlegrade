import { describe, expect, it } from "vitest";
import { visibleLabelIndexes } from "@/utils/visibleLabelIndexes";

describe("visibleLabelIndexes", () => {
  it("keeps every label when the series is short", () => {
    expect(visibleLabelIndexes(4, 6)).toEqual(new Set([0, 1, 2, 3]));
  });

  it("always includes the first and last points", () => {
    const indexes = visibleLabelIndexes(12, 6);

    expect(indexes.has(0)).toBe(true);
    expect(indexes.has(11)).toBe(true);
    expect(indexes.size).toBeLessThanOrEqual(6);
  });

  it("keeps every month in a year-long series by default", () => {
    expect(visibleLabelIndexes(7)).toEqual(new Set([0, 1, 2, 3, 4, 5, 6]));
    expect(visibleLabelIndexes(12)).toEqual(
      new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    );
  });
});
