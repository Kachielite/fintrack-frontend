import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { Insight } from "@/features/insights/insights.interface";

interface Props {
  insight: Insight;
}

export default function BudgetAdvisorCard({ insight }: Props) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.primaryLight,
          borderColor: colors.primary + "33",
        },
      ]}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View
          style={[styles.avatarWrap, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.avatarText, { color: colors.onPrimary }]}>I</Text>
        </View>
        <View>
          <Text
            style={[
              styles.name,
              { color: colors.textPrimary, fontFamily: FONTS.bold },
            ]}
          >
            Iris
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSubtle, fontFamily: FONTS.regular },
            ]}
          >
            Reflecting on your month
          </Text>
        </View>
      </View>

      {/* Message */}
      <Text
        style={[
          styles.message,
          { color: colors.textPrimary, fontFamily: FONTS.medium },
        ]}
      >
        {insight.message}
      </Text>

      {/* Sparkle label */}
      <View style={styles.footer}>
        <Ionicons name="sparkles" size={11} color={colors.primary} />
        <Text
          style={[
            styles.footerLabel,
            { color: colors.primary, fontFamily: FONTS.bold },
          ]}
        >
          AI INSIGHT
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: 4,
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: FONT_SIZE.bodySmall, fontFamily: FONTS.bold },
  name: { fontSize: 13, letterSpacing: -0.1 },
  subtitle: { fontSize: 11 },
  message: {
    fontSize: FONT_SIZE.body,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  footerLabel: { fontSize: 10, letterSpacing: 0.8 },
});

