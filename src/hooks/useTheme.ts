import { useEffect, useState } from "react";
import {
  applyTheme,
  resolveTheme,
} from "@/lib/theme";
import { useThemeStore } from "@/store/theme";

const prefersLightScheme = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: light)").matches;

export const useTheme = () => {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const [prefersLight, setPrefersLight] = useState(prefersLightScheme);

  const theme = resolveTheme(preference, prefersLight);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => setPrefersLight(media.matches);

    onChange();
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return { theme, preference, setPreference };
};
