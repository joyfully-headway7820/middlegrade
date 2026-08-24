import { describe, expect, it } from "vitest";
import { isRecent } from "@/utils/isRecent";

describe("isRecent", () => {
  const now = new Date("2026-02-10T12:00:00");

  it("accepts today and yesterday", () => {
    expect(isRecent("2026-02-10 09:00:00", 2, now)).toBe(true);
    expect(isRecent("2026-02-09 13:00:00", 2, now)).toBe(true);
  });

  it("rejects older assignments", () => {
    expect(isRecent("2026-02-05 09:00:00", 2, now)).toBe(false);
  });

  it("rejects unparsable dates", () => {
    expect(isRecent("", 2, now)).toBe(false);
  });
});
