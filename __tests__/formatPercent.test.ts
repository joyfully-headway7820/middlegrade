import { describe, expect, it } from "vitest";
import { formatPercent } from "@/lib/format";

describe("formatPercent", () => {
  it("keeps two decimal places", () => {
    expect(formatPercent(83.87)).toBe("83,87%");
  });

  it("does not drop a trailing tenth to a whole percent", () => {
    expect(formatPercent(83)).toBe("83,00%");
  });
});
