import { describe, expect, it } from "vitest";
import { lastChartDatum } from "@/utils/lastChartDatum";

describe("lastChartDatum", () => {
  it("returns the last month that has a value", () => {
    expect(
      lastChartDatum([
        { label: "март", value: 4 },
        { label: "июнь", value: 5 },
        { label: "авг", value: null },
      ]),
    ).toEqual({ label: "июнь", value: 5 });
  });

  it("returns null when the series has no values", () => {
    expect(lastChartDatum([{ label: "авг", value: null }])).toBeNull();
  });
});
