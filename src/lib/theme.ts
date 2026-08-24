export type Theme = "light" | "dark";

export type ThemePreference = "system" | Theme;

export const THEME_STORAGE_KEY = "mg-theme";

export const THEME_COLORS: Record<Theme, string> = {
  light: "#e8eaf0",
  dark: "#080a12",
};

export const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "Системная" },
  { value: "dark", label: "Тёмная" },
  { value: "light", label: "Светлая" },
];

export const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark";

export const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "system" || isTheme(value);

export const preferredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
};

export const readStoredPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : "system";
  } catch {
    return "system";
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
