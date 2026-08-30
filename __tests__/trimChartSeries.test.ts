import { describe, expect, it } from "vitest";
import { trimChartSeries } from "@/utils/trimChartSeries";

describe("trimChartSeries", () => {
  it("drops empty months at both ends and keeps the filled span", () => {
    const series = trimChartSeries([
      { label: "февр", value: null },
      { label: "март", value: 5 },
      { label: "апр", value: 5 },
      { label: "май", value: 5 },
      { label: "июнь", value: 5 },
      { label: "июль", value: null },
      { label: "авг", value: null },
    ]);

    expect(series.map((item) => item.label)).toEqual([
      "март",
      "апр",
      "май",
      "июнь",
    ]);
  });

  it("keeps a gap in the middle of the series", () => {
    expect(
      trimChartSeries([
        { label: "март", value: 5 },
        { label: "апр", value: null },
        { label: "июнь", value: 5 },
      ]).map((item) => item.label),
    ).toEqual(["март", "апр", "июнь"]);
  });

  it("returns an empty list when every value is missing", () => {
    expect(
      trimChartSeries([
        { label: "июль", value: null },
        { label: "авг", value: null },
      ]),
    ).toEqual([]);
  });
});
