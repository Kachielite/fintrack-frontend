import React from "react";
import {
  View,
  Text,
  SectionList,
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
  insight_generated: { name: "sparkles", color: "#a78bfa" },
  budget_warning: { name: "warning", color: "#f59e0b" },
  budget_exceeded: { name: "alert-circle", color: "#ef4444" },
};

interface Section {
  title: string;
  data: AppNotification[];
}

function groupNotifications(items: AppNotification[]): Section[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6);

  const buckets: Record<string, AppNotification[]> = {
    Today: [],
    Yesterday: [],
    "This week": [],
    Earlier: [],
  };

  for (const item of items) {
    const d = new Date(item.createdAt);
    if (d >= startOfToday) {
      buckets["Today"].push(item);
    } else if (d >= startOfYesterday) {
      buckets["Yesterday"].push(item);
    } else if (d >= startOfWeek) {
      buckets["This week"].push(item);
    } else {
      buckets["Earlier"].push(item);
    }
  }

  return (Object.entries(buckets) as [string, AppNotification[]][])
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
}

function navigate(navigation: any, type: string) {
  switch (type) {
    case "insight_generated":
      navigation.navigate("Insights");
      break;
    case "budget_warning":
    case "budget_exceeded":
      // Budget is a tab inside "Tabs", not a root stack screen
      navigation.navigate("Tabs", { screen: "Budget" });
      break;
  }
}

function NotificationRow({ item }: { item: AppNotification }) {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { mutate: markRead } = useMarkRead();
  const icon = ICON_MAP[item.type] ?? { name: "notifications", color: colors.primary };
  const isUnread = item.readAt === null;
  const handlePress = () => {
    if (isUnread) markRead(item.id);
    navigate(navigation, item.type);
  };

  return (
    <Pressable
      onPress={handlePress}
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

function SectionHeader({ title }: { title: string }) {
  const colors = useThemeColors();
  return (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSubtle, fontFamily: FONTS.semiBold }]}>
        {title}
      </Text>
    </View>
  );
}

export default function NotificationsScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { data, isLoading } = useNotifications();
  const { mutate: markAllRead } = useMarkAllRead();

  const sections = React.useMemo(() => groupNotifications(data ?? []), [data]);

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
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <NotificationRow item={item} />}
          renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
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
  sectionHeader: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
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
