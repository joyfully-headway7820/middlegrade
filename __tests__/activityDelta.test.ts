import { describe, expect, it } from "vitest";
import { activityDelta } from "@/utils/activityDelta";

describe("activityDelta", () => {
  it("keeps accruals positive when Journal sent a truthy action", () => {
    expect(activityDelta(1, 1)).toBe(1);
  });

  it("turns a market purchase into a debit when action is 0", () => {
    expect(activityDelta(0, 473)).toBe(-473);
    expect(activityDelta(0, 490)).toBe(-490);
  });
});
