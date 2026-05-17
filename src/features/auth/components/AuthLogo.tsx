import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS, FONT_SIZE, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import VelaIcon from "@/core/common/components/VelaIcon";

export default function AuthLogo() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconShadow, { shadowColor: "#3F5538" }]}>
        <VelaIcon size={72} variant="auto" />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Welcome to Vela
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
  iconShadow: {
    borderRadius: 16,
    marginBottom: SPACING.xl,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 12,
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
