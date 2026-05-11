import React from "react";
import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { RADIUS } from "@/core/common/constants/theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function GlassCard({ children, style }: GlassCardProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#231C13",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
});
