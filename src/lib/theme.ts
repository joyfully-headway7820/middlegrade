export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "mg-theme";

export const THEME_COLORS: Record<Theme, string> = {
  light: "#e8eaf0",
  dark: "#080a12",
};

export const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark";

export const preferredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

export const readStoredTheme = (): Theme | null => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
};

export const resolveTheme = (
  stored: string | null,
  prefersLight: boolean,
): Theme => {
  if (isTheme(stored)) {
    return stored;
  }

  return prefersLight ? "light" : "dark";
};

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
};
