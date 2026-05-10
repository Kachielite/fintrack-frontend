import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/core/common/constants/storage-keys";

type ThemePreference = "light" | "dark" | "system";

interface ThemeState {
  preference: ThemePreference;
  setPreference(p: ThemePreference): void;
  loadSaved(): Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: "system",
  setPreference: (preference) => {
    set({ preference });
    AsyncStorage.setItem(STORAGE_KEYS.COLOR_SCHEME, preference).catch(() => {});
  },
  loadSaved: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.COLOR_SCHEME);
      if (saved === "light" || saved === "dark" || saved === "system") {
        set({ preference: saved });
      }
    } catch {}
  },
}));
