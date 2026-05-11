import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors, useIsDark } from "@/core/common/hooks/use-theme-colors";
import { FONTS } from "@/core/common/constants/theme";

const EMAILS = ["GTBank · Debit alert", "Kuda · Transfer", "Wise · Card payment"];

export default function GmailVisual() {
  const colors = useThemeColors();
  const isDark = useIsDark();

  return (
    <View style={styles.container}>
      {/* Back envelope */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface2,
            borderColor: colors.border,
            transform: [{ rotate: "-8deg" }, { translateY: 8 }],
          },
        ]}
      />
      {/* Front envelope */}
      <View
        style={[
          styles.card,
          styles.front,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: isDark ? "transparent" : "#231C13",
            transform: [{ rotate: "4deg" }],
          },
        ]}
      >
        <View style={styles.labelRow}>
          <View style={[styles.iconBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="pricetag" size={14} color={colors.primary} />
          </View>
          <Text style={[styles.labelTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
            Bank Transactions
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        {EMAILS.map((email) => (
          <View key={email} style={styles.emailRow}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.emailText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
              {email}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginBottom: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: 240,
    height: 160,
    borderRadius: 16,
    borderWidth: 1,
  },
  front: {
    padding: 20,
    gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  labelTitle: { fontSize: 13 },
  divider: { height: 1 },
  emailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 99 },
  emailText: { fontSize: 11 },
});
