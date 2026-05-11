import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING } from "@/core/common/constants/theme";

export default function BudgetHeader() {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: colors.textPrimary, fontFamily: FONTS.bold },
        ]}
      >
        Budget
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.h1,
    letterSpacing: -0.6,
  },
});

