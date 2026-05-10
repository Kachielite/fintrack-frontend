import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS, FONT_SIZE, RADIUS, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

export default function AuthLogo() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.mark,
          { backgroundColor: colors.primary, shadowColor: colors.primary },
        ]}
      >
        <Text style={[styles.markLetter, { color: colors.onPrimary }]}>F</Text>
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Welcome to FinTrack
      </Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Sign in to connect your bank emails and meet Iris.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: SPACING.xxxl + SPACING.sm,
  },
  mark: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 12,
  },
  markLetter: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    lineHeight: 44,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.h1,
    letterSpacing: -0.6,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280,
  },
});
