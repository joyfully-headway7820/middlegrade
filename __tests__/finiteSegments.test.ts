import { describe, expect, it } from "vitest";
import { finiteSegments } from "@/utils/finiteSegments";

describe("finiteSegments", () => {
  it("splits a series on missing values", () => {
    const segments = finiteSegments([
      { label: "июнь", value: 5 },
      { label: "июль", value: null },
      { label: "авг", value: null },
      { label: "сент", value: 4.2 },
    ]);

    expect(segments.map((segment) => segment.map((item) => item.label))).toEqual([
      ["июнь"],
      ["сент"],
    ]);
  });

  it("keeps a contiguous run together", () => {
    expect(
      finiteSegments([
        { label: "а", value: 1 },
        { label: "б", value: 2 },
        { label: "в", value: 0 },
      ]),
    ).toHaveLength(1);
  });
});
