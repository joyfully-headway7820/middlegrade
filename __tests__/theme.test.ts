import { describe, expect, it } from "vitest";
import { isThemePreference, resolveTheme } from "@/lib/theme";

describe("resolveTheme", () => {
  it("prefers the stored light or dark value over the system setting", () => {
    expect(resolveTheme("light", false)).toBe("light");
    expect(resolveTheme("dark", true)).toBe("dark");
  });

  it("follows the system for system, empty, or unknown storage", () => {
    expect(resolveTheme("system", true)).toBe("light");
    expect(resolveTheme("system", false)).toBe("dark");
    expect(resolveTheme(null, true)).toBe("light");
    expect(resolveTheme(null, false)).toBe("dark");
    expect(resolveTheme("{dark}", false)).toBe("dark");
  });
});

describe("isThemePreference", () => {
  it("accepts system, light, and dark", () => {
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
  });

  it("rejects garbage", () => {
    expect(isThemePreference("auto")).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });
});
