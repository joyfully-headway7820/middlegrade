import { describe, expect, it } from "vitest";
import { ratioPercent } from "@/utils/ratioPercent";

describe("ratioPercent", () => {
  it("returns the share of present lessons as a percent", () => {
    expect(ratioPercent(8387, 10000)).toBe(83.87);
  });

  it("returns zero when there is nothing to divide by", () => {
    expect(ratioPercent(0, 0)).toBe(0);
    expect(ratioPercent(5, 0)).toBe(0);
  });
});
