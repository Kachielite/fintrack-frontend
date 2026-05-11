import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, SPACING, RADIUS } from "@/core/common/constants/theme";
import NotificationBell from "@/features/notifications/components/notification-bell";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface HomeHeaderProps {
  firstName?: string | null;
}

export default function HomeHeader({ firstName }: HomeHeaderProps) {
  const colors = useThemeColors();
  const name = firstName ?? "there";
  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text
          style={[
            styles.initial,
            { color: colors.onPrimary, fontFamily: FONTS.bold },
          ]}
        >
          {initial}
        </Text>
      </View>

      <View style={styles.textBlock}>
        <Text
          style={[
            styles.salutation,
            { color: colors.textPrimary, fontFamily: FONTS.bold },
          ]}
        >
          {getGreeting()}, {name}
        </Text>
      </View>

      <NotificationBell />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.base,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  initial: { fontSize: 15 },
  textBlock: { flex: 1 },
  salutation: { fontSize: 18, letterSpacing: -0.3 },
});
