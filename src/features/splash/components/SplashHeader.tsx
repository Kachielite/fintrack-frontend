import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  RADIUS,
  SPACING,
} from "@/core/common/constants/theme";

interface SplashHeaderProps {
  onSkip: () => void;
}

export default function SplashHeader({ onSkip }: SplashHeaderProps) {
  return (
    <View style={styles.row}>
      {/* Logo mark + wordmark */}
      <View style={styles.brand}>
        <View style={styles.mark}>
          <Text style={styles.markLetter}>F</Text>
        </View>
        <Text style={styles.wordmark}>FinTrack</Text>
      </View>

      <Pressable onPress={onSkip} hitSlop={12}>
        <Text style={styles.skip}>Skip</Text>
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
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  markLetter: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textInverse,
    lineHeight: 18,
  },
  wordmark: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  skip: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.bodySmall,
    color: COLORS.textSecondary,
  },
});
