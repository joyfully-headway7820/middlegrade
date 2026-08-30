import { describe, expect, it } from "vitest";
import { formatDateTime } from "@/lib/format";

describe("formatDateTime", () => {
  it("shows the clock when Journal sends a timestamp", () => {
    expect(formatDateTime("2026-07-02 09:15:00")).toBe("2 июля, 09:15");
    expect(formatDateTime("2026-06-30 18:40:12")).toBe("30 июня, 18:40");
  });

  it("keeps a date-only value without midnight", () => {
    expect(formatDateTime("2026-07-02")).toBe("2 июля");
  });
});
