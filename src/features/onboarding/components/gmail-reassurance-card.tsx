import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS } from "@/core/common/constants/theme";

export default function GmailReassuranceCard() {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.iconBadge, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
          Just this label. Nothing else.
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
          We can't see your inbox, drafts, or other folders — only the bank emails you route to this label.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: { flex: 1 },
  title: { fontSize: 14, marginBottom: 4 },
  body: { fontSize: 13, lineHeight: 19 },
});
