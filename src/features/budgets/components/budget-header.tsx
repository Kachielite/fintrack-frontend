import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";

interface Props {
  onAdd: () => void;
}

export default function BudgetHeader({ onAdd }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        Budget
      </Text>
      <Pressable
        onPress={onAdd}
        hitSlop={12}
        style={[styles.addBtn, { backgroundColor: colors.primary }]}
      >
        <Ionicons name="add" size={20} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.h1, letterSpacing: -0.6 },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
});

