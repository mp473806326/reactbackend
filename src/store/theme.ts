import { create } from "zustand";
import { Local } from "@/utils/storage";

interface ThemeStore {
  isDark: string;
  updateTheme: (isDark: string) => void;
}

export const useThemeStore = create<ThemeStore>(set => ({
  isDark: Local.get("isDark") || "light",
  updateTheme: (isDark: string) => {
    set({ isDark });
  },
}));
