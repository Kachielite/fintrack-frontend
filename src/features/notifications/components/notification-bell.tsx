import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, RADIUS } from "@/core/common/constants/theme";
import { useUnreadCount } from "../hooks/use-notifications";

export default function NotificationBell() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { data } = useUnreadCount();
  const count = data?.count ?? 0;

  return (
    <Pressable
      onPress={() => navigation.navigate("Notifications" as never)}
      hitSlop={12}
      style={[styles.wrap, { backgroundColor: colors.surface }]}
    >
      <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.badgeText, { color: colors.onPrimary, fontFamily: FONTS.bold }]}>
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, lineHeight: 12 },
});
