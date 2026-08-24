import { describe, expect, it } from "vitest";
import { resolveTheme } from "@/lib/theme";

describe("resolveTheme", () => {
  it("prefers the stored value over the system setting", () => {
    expect(resolveTheme("light", false)).toBe("light");
    expect(resolveTheme("dark", true)).toBe("dark");
  });

  it("falls back to prefers-color-scheme when nothing is stored", () => {
    expect(resolveTheme(null, true)).toBe("light");
    expect(resolveTheme(null, false)).toBe("dark");
  });

  it("ignores garbage in storage", () => {
    expect(resolveTheme("system", true)).toBe("light");
    expect(resolveTheme("{dark}", false)).toBe("dark");
  });
});
