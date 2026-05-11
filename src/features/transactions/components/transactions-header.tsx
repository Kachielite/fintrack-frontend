import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING } from "@/core/common/constants/theme";

export default function TransactionsHeader() {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: colors.textPrimary, fontFamily: FONTS.bold },
        ]}
      >
        Transactions
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZE.h1,
    letterSpacing: -0.6,
  },
});

