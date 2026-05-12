import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useNotifications, useMarkRead, useMarkAllRead } from "../hooks/use-notifications";
import { AppNotification } from "../notifications.interface";

const ICON_MAP: Record<string, { name: string; color: string }> = {
  sync_complete: { name: "checkmark-circle", color: "#22c55e" },
  sync_skipped: { name: "ellipsis-horizontal-circle", color: "#94a3b8" },
  sync_failed: { name: "close-circle", color: "#ef4444" },
};

function NotificationRow({ item }: { item: AppNotification }) {
  const colors = useThemeColors();
  const { mutate: markRead } = useMarkRead();
  const icon = ICON_MAP[item.type] ?? { name: "notifications", color: colors.primary };
  const isUnread = item.readAt === null;

  return (
    <Pressable
      onPress={() => { if (isUnread) markRead(item.id); }}
      style={[
        styles.row,
        {
          backgroundColor: isUnread ? colors.primaryLight : colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.surface2 }]}>
        <Ionicons name={icon.name as any} size={22} color={icon.color} />
      </View>
      <View style={styles.rowText}>
        <View style={styles.rowHeader}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontFamily: isUnread ? FONTS.semiBold : FONTS.regular,
              },
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {isUnread && (
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          )}
        </View>
        <Text
          style={[styles.body, { color: colors.textSecondary, fontFamily: FONTS.regular }]}
          numberOfLines={2}
        >
          {item.body}
        </Text>
        <Text style={[styles.time, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
          {formatRelative(item.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { data, isLoading } = useNotifications();
  const { mutate: markAllRead } = useMarkAllRead();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.heading, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
          Notifications
        </Text>
        {(data?.some((n) => !n.readAt)) && (
          <Pressable onPress={() => markAllRead()} hitSlop={8}>
            <Text style={[styles.markAll, { color: colors.primary, fontFamily: FONTS.medium }]}>
              Mark all read
            </Text>
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : !data?.length ? (
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={48} color={colors.textSubtle} />
          <Text style={[styles.emptyText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
            No notifications yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <NotificationRow item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  heading: { fontSize: FONT_SIZE.h2, flex: 1 },
  markAll: { fontSize: 14 },
  loader: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: { fontSize: 15 },
  list: { paddingBottom: SPACING.xxl },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowText: { flex: 1 },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  title: { flex: 1, fontSize: 14 },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  body: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  time: { fontSize: 11 },
});
