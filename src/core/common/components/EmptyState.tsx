import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, SPACING, RADIUS } from "@/core/common/constants/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface EmptyStateProps {
  icon?: IconName;
  message: string;
  subMessage?: string;
  action?: { label: string; onPress: () => void };
}

export default function EmptyState({
  icon = "file-tray-outline",
  message,
  subMessage,
  action,
}: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surface2 }]}>
        <Ionicons name={icon} size={28} color={colors.textSubtle} />
      </View>
      <Text
        style={[
          styles.message,
          { color: colors.textPrimary, fontFamily: FONTS.semiBold },
        ]}
      >
        {message}
      </Text>
      {subMessage && (
        <Text
          style={[
            styles.sub,
            { color: colors.textSubtle, fontFamily: FONTS.regular },
          ]}
        >
          {subMessage}
        </Text>
      )}
      {action && (
        <Pressable
          onPress={action.onPress}
          style={[styles.actionBtn, { backgroundColor: colors.primaryMid }]}
        >
          <Text
            style={[
              styles.actionLabel,
              { color: colors.primary, fontFamily: FONTS.semiBold },
            ]}
          >
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  message: { fontSize: 15, letterSpacing: -0.2, textAlign: "center" },
  sub: { fontSize: 13, textAlign: "center", lineHeight: 19 },
  actionBtn: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  actionLabel: { fontSize: 14 },
});
