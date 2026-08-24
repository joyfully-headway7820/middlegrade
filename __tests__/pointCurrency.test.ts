import { describe, expect, it } from "vitest";
import { pointCurrency } from "@/utils/pointCurrency";

describe("pointCurrency", () => {
  it("maps Journal type 1 (DIAMOND) to topcoins", () => {
    expect(pointCurrency(1)).toBe("coins");
  });

  it("maps Journal type 2 (COIN) to topgems", () => {
    expect(pointCurrency(2)).toBe("gems");
  });
});
