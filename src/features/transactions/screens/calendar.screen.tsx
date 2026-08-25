import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isToday as isTodayFn,
  format,
} from "date-fns";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { formatCurrency } from "@/core/common/utils/currency";
import { useDailySpend } from "../hooks/use-daily-spend";
import { useUserStore } from "@/features/user/user.state";
import DayTransactionsSheet from "../components/day-transactions-sheet";
import SkeletonBox from "@/core/common/components/SkeletonBox";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const CELL_MIN_ALPHA = 24; // 0x18 — faintest visible tint
const CELL_MAX_ALPHA = 224; // 0xE0 — near-solid

function toHexAlpha(value: number): string {
  return Math.round(value).toString(16).padStart(2, "0");
}

export default function CalendarScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const refCurrency = useUserStore((s) => s.profile?.refCurrency ?? "NGN");

  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth() + 1;
  const { dailySpend, isLoading } = useDailySpend(year, month);

  const spendByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of dailySpend) map.set(p.date, p.spend);
    return map;
  }, [dailySpend]);

  const maxSpend = useMemo(
    () => dailySpend.reduce((max, p) => Math.max(max, p.spend), 0),
    [dailySpend],
  );

  const monthTotal = useMemo(
    () => dailySpend.reduce((sum, p) => sum + p.spend, 0),
    [dailySpend],
  );

  const gridDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  function cellColor(day: Date): string | undefined {
    const key = format(day, "yyyy-MM-dd");
    const spend = spendByDate.get(key);
    if (!spend || spend <= 0 || maxSpend <= 0) return undefined;
    const alpha =
      CELL_MIN_ALPHA + (spend / maxSpend) * (CELL_MAX_ALPHA - CELL_MIN_ALPHA);
    return colors.primary + toHexAlpha(alpha);
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={[styles.iconBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontFamily: FONTS.bold },
          ]}
        >
          Calendar
        </Text>
      </View>

      <View style={styles.monthNav}>
        <Pressable
          onPress={() => setCursor((c) => subMonths(c, 1))}
          hitSlop={12}
          style={[styles.iconBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons
            name="chevron-back-outline"
            size={18}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text
          style={[
            styles.monthLabel,
            { color: colors.textPrimary, fontFamily: FONTS.semiBold },
          ]}
        >
          {format(cursor, "MMMM yyyy")}
        </Text>
        <Pressable
          onPress={() => setCursor((c) => addMonths(c, 1))}
          hitSlop={12}
          style={[styles.iconBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons
            name="chevron-forward-outline"
            size={18}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <SkeletonBox width="100%" height={280} radius={RADIUS.lg} />
        ) : (
          <>
            <View style={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((label, i) => (
                <View key={i} style={styles.cellWrap}>
                  <Text
                    style={[
                      styles.weekdayLabel,
                      { color: colors.textSubtle, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.grid}>
              {gridDays.map((day) => {
                const inMonth = isSameMonth(day, cursor);
                const today = isTodayFn(day);
                const bg = inMonth ? cellColor(day) : undefined;
                return (
                  <View key={day.toISOString()} style={styles.cellWrap}>
                    <Pressable
                      onPress={() => inMonth && setSelectedDay(day)}
                      disabled={!inMonth}
                      style={[
                        styles.cell,
                        { backgroundColor: bg ?? "transparent" },
                        today && {
                          borderWidth: 1.5,
                          borderColor: colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cellText,
                          {
                            color: !inMonth
                              ? colors.textSubtle
                              : today
                                ? colors.primary
                                : colors.textPrimary,
                            fontFamily: today ? FONTS.bold : FONTS.regular,
                            opacity: inMonth ? 1 : 0.3,
                          },
                        ]}
                      >
                        {format(day, "d")}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <View
              style={[
                styles.totalCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.totalLabel,
                  { color: colors.textSubtle, fontFamily: FONTS.semiBold },
                ]}
              >
                TOTAL SPEND — {format(cursor, "MMMM")}
              </Text>
              <Text
                style={[
                  styles.totalValue,
                  { color: colors.textPrimary, fontFamily: FONTS.mono },
                ]}
              >
                {formatCurrency(monthTotal, refCurrency)}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {selectedDay && (
        <DayTransactionsSheet
          date={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    gap: SPACING.xs,
  },
  title: { fontSize: FONT_SIZE.h1, letterSpacing: -0.6 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.md,
  },
  monthLabel: { fontSize: FONT_SIZE.h3, letterSpacing: -0.3 },
  scroll: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.xxl,
    gap: SPACING.base,
  },
  weekdayRow: { flexDirection: "row", flexWrap: "wrap" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cellWrap: {
    width: "14.2857%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  weekdayLabel: { fontSize: 11 },
  cell: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: { fontSize: 13 },
  totalCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
    gap: 4,
  },
  totalLabel: { fontSize: 11, letterSpacing: 0.6 },
  totalValue: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
});
