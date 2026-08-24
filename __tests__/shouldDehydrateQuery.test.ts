import { describe, expect, it } from "vitest";
import { shouldDehydrateQuery } from "@/utils/shouldDehydrateQuery";

describe("shouldDehydrateQuery", () => {
  it("keeps any query that already has data, even after a failed refetch", () => {
    expect(
      shouldDehydrateQuery({ state: { data: { full_name: "Иванов" } } }),
    ).toBe(true);
  });

  it("skips queries that never loaded", () => {
    expect(shouldDehydrateQuery({ state: { data: undefined } })).toBe(false);
  });
});
