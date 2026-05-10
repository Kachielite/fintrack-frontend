import { useColorScheme } from "react-native";
import {
  LIGHT_COLORS,
  DARK_COLORS,
  ThemeColors,
} from "@/core/common/constants/theme";
import { useThemeStore } from "@/core/common/state/theme.state";

export function useThemeColors(): ThemeColors {
  const preference = useThemeStore((s) => s.preference);
  const system = useColorScheme();
  const isDark =
    preference === "system" ? system === "dark" : preference === "dark";
  return isDark ? DARK_COLORS : LIGHT_COLORS;
}

export function useIsDark(): boolean {
  const preference = useThemeStore((s) => s.preference);
  const system = useColorScheme();
  return preference === "system" ? system === "dark" : preference === "dark";
}
