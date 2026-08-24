import { memo } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle = memo(() => {
  const { theme, toggleTheme } = useTheme();
  const light = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={light ? "Включить тёмную тему" : "Включить светлую тему"}
      aria-pressed={light}
      className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-overlay hover:text-heading"
    >
      {light ? (
        <Moon className="size-4.5" aria-hidden />
      ) : (
        <Sun className="size-4.5" aria-hidden />
      )}
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";
