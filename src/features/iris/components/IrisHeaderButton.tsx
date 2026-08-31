import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { RADIUS } from "@/core/common/constants/theme";
import { useIrisStore } from "../iris.state";

// Header-icon entry point into Iris chat — sized to match NotificationBell
// so the two sit as a matched pair in a screen header, but kept on a solid
// primary-color background (rather than the theme's surface color) so the
// Iris branding stays visible against either theme.
export default function IrisHeaderButton() {
  const colors = useThemeColors();
  const open = useIrisStore((s) => s.open);

  return (
    <Pressable
      onPress={open}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Ask Iris"
      style={[styles.wrap, { backgroundColor: colors.primary }]}
    >
      <Ionicons name="sparkles" size={20} color="#FFFFFF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
