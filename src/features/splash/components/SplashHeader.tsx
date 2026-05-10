import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FONTS, FONT_SIZE, RADIUS, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface SplashHeaderProps {
  onSkip: () => void;
}

export default function SplashHeader({ onSkip }: SplashHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View style={[styles.mark, { backgroundColor: colors.primary }]}>
          <Text style={[styles.markLetter, { color: colors.onPrimary }]}>F</Text>
        </View>
        <Text style={[styles.wordmark, { color: colors.textPrimary }]}>
          FinTrack
        </Text>
      </View>

      <Pressable onPress={onSkip} hitSlop={12}>
        <Text style={[styles.skip, { color: colors.textSecondary }]}>Skip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  mark: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  markLetter: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  wordmark: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.body,
    letterSpacing: -0.3,
  },
  skip: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.bodySmall,
  },
});
