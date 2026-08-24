import { create } from "zustand";
import {
  readStoredPreference,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/lib/theme";

type ThemeState = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  preference: readStoredPreference(),
  setPreference: (preference) => {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
    set({ preference });
  },
}));
