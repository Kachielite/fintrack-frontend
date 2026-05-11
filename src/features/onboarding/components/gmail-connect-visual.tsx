import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors, useIsDark } from "@/core/common/hooks/use-theme-colors";
import { FONTS } from "@/core/common/constants/theme";

const GOOGLE_BLUE = "#4285F4";
const GOOGLE_RED = "#EA4335";
const GOOGLE_YELLOW = "#FBBC05";
const GOOGLE_GREEN = "#34A853";

export default function GmailConnectVisual() {
  const colors = useThemeColors();
  const isDark = useIsDark();

  return (
    <View style={styles.container}>
      {/* Back card */}
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

      {/* Front card */}
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
        {/* Google G logo */}
        <View style={styles.logoRow}>
          <View style={styles.gLogo}>
            <View style={[styles.gSegment, { backgroundColor: GOOGLE_BLUE, top: 0, left: 0, right: 0, height: "50%" }]} />
            <View style={[styles.gSegment, { backgroundColor: GOOGLE_RED, bottom: 0, left: 0, width: "50%", height: "50%" }]} />
            <View style={[styles.gSegment, { backgroundColor: GOOGLE_YELLOW, bottom: 0, right: 0, width: "50%", height: "50%" }]} />
            <View style={[styles.gMask, { backgroundColor: colors.surface }]} />
            <View style={[styles.gBar, { backgroundColor: GOOGLE_BLUE }]} />
          </View>
          <View>
            <Text style={[styles.googleLabel, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              Google
            </Text>
            <Text style={[styles.googleSub, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
              Gmail read-only
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Permission rows */}
        {[
          { icon: "mail-outline" as const, color: GOOGLE_GREEN, label: "Bank Transactions label" },
          { icon: "lock-closed-outline" as const, color: GOOGLE_BLUE, label: "Read-only access" },
          { icon: "shield-checkmark-outline" as const, color: colors.primary, label: "Never shares your data" },
        ].map((row) => (
          <View key={row.label} style={styles.permRow}>
            <Ionicons name={row.icon} size={13} color={row.color} />
            <Text style={[styles.permText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
              {row.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const CARD_W = 240;
const CARD_H = 160;
const G_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 220,
    marginBottom: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: CARD_W,
    height: CARD_H,
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
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  gLogo: {
    width: G_SIZE,
    height: G_SIZE,
    borderRadius: G_SIZE / 2,
    overflow: "hidden",
    position: "relative",
  },
  gSegment: {
    position: "absolute",
  },
  gMask: {
    position: "absolute",
    top: "25%",
    left: "25%",
    right: "25%",
    bottom: "25%",
    borderRadius: 999,
  },
  gBar: {
    position: "absolute",
    top: "37%",
    right: 0,
    width: "50%",
    height: "26%",
    borderRadius: 2,
  },
  googleLabel: { fontSize: 13 },
  googleSub: { fontSize: 10, marginTop: 1 },
  divider: { height: 1 },
  permRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  permText: { fontSize: 11 },
});
