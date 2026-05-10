import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  RADIUS,
  SPACING,
} from "@/core/common/constants/theme";

export default function AuthLogo() {
  return (
    <View style={styles.container}>
      {/* "F" mark — warm amber, deep shadow */}
      <View style={styles.mark}>
        <Text style={styles.markLetter}>F</Text>
      </View>

      <Text style={styles.title}>Welcome to FinTrack</Text>

      <Text style={styles.subtitle}>
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
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xl,
    // Deep amber glow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 12,
  },
  markLetter: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    color: COLORS.textInverse,
    lineHeight: 44,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.h1,
    color: COLORS.textPrimary,
    letterSpacing: -0.6,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280,
  },
});
