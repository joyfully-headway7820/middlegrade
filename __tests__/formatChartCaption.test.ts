import { describe, expect, it } from "vitest";
import { formatChartCaption } from "@/lib/format";

describe("formatChartCaption", () => {
  it("renders a numeric value with a unit", () => {
    expect(formatChartCaption("июнь", 5, "балл")).toBe("июнь: 5 балл");
  });

  it("does not stringify null as a grade", () => {
    expect(formatChartCaption("авг", null, "балл")).toBe("авг: нет данных");
  });
});
