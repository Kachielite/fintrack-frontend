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

export type TransactionsViewMode = "list" | "calendar";

interface Props {
  viewMode: TransactionsViewMode;
  onViewModeChange: (mode: TransactionsViewMode) => void;
  onAdd?: () => void;
}

export default function TransactionsHeader({
  viewMode,
  onViewModeChange,
  onAdd,
}: Props) {
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

      {onAdd && (
        <Pressable
          onPress={onAdd}
          hitSlop={8}
          accessibilityLabel="Add transaction"
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={20} color={colors.onPrimary} />
        </Pressable>
      )}

      <View
        style={[
          styles.toggle,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ToggleButton
          icon="list-outline"
          active={viewMode === "list"}
          onPress={() => onViewModeChange("list")}
          accessibilityLabel="List view"
        />
        <ToggleButton
          icon="calendar-outline"
          active={viewMode === "calendar"}
          onPress={() => onViewModeChange("calendar")}
          accessibilityLabel="Calendar view"
        />
      </View>
    </View>
  );
}

function ToggleButton({
  icon,
  active,
  onPress,
  accessibilityLabel,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.toggleBtn,
        { backgroundColor: active ? colors.primary : "transparent" },
      ]}
    >
      <Ionicons
        name={icon}
        size={17}
        color={active ? colors.onPrimary : colors.textSecondary}
      />
    </Pressable>
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
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  toggle: {
    flexDirection: "row",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: 2,
    gap: 2,
  },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
