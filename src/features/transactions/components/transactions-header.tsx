import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";

interface Props {
  onCalendarPress: () => void;
}

export default function TransactionsHeader({ onCalendarPress }: Props) {
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
      <Pressable
        onPress={onCalendarPress}
        hitSlop={12}
        accessibilityLabel="Calendar view"
        style={[styles.iconBtn, { backgroundColor: colors.surface }]}
      >
        <Ionicons
          name="calendar-outline"
          size={19}
          color={colors.textPrimary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.h1,
    letterSpacing: -0.6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
