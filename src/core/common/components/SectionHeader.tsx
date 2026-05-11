import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS } from "@/core/common/constants/theme";

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
        {title.toUpperCase()}
      </Text>
      {action && (
        <Pressable onPress={action.onPress} hitSlop={8}>
          <Text style={[styles.action, { color: colors.primary, fontFamily: FONTS.semiBold }]}>
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  title: { fontSize: 11, letterSpacing: 0.6 },
  action: { fontSize: 13 },
});
