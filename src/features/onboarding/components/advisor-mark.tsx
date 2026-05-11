import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS } from "@/core/common/constants/theme";

export default function AdvisorMark() {
  const colors = useThemeColors();
  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
        <Text style={[styles.initial, { color: colors.primary, fontFamily: FONTS.bold }]}>
          I
        </Text>
      </View>
      <Text style={[styles.name, { color: colors.textSecondary, fontFamily: FONTS.semiBold }]}>
        Iris, your advisor
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { fontSize: 15 },
  name: { fontSize: 13 },
});
