import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";
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
  isSameDay,
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
import { useProfile } from "@/features/user/hooks/use-profile";
import DayTransactionsSheet from "./day-transactions-sheet";
import SkeletonBox from "@/core/common/components/SkeletonBox";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const CELL_MIN_ALPHA = 20; // 0x14 — faintest visible tint
const CELL_MAX_ALPHA = 170; // 0xAA — strong but keeps cell text legible

/** Compact form for cell display — "820", "12.5k" — full amounts show in the summary card. */
function compactAmount(n: number): string {
  if (n <= 0) return "";
  if (n < 1000) return Math.round(n).toString();
  const k = n / 1000;
  return `${Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)}k`;
}

function toHexAlpha(value: number): string {
  return Math.round(value).toString(16).padStart(2, "0");
}

/** Tints the cell by whichever of spend/income dominates that day, scaled by its share of the month's peak. */
function cellTint(
  spend: number,
  income: number,
  maxSpend: number,
  maxIncome: number,
  errorColor: string,
  successColor: string,
): string | undefined {
  if (spend <= 0 && income <= 0) return undefined;
  if (spend >= income) {
    if (maxSpend <= 0) return undefined;
    const alpha =
      CELL_MIN_ALPHA + (spend / maxSpend) * (CELL_MAX_ALPHA - CELL_MIN_ALPHA);
    return errorColor + toHexAlpha(alpha);
  }
  if (maxIncome <= 0) return undefined;
  const alpha =
    CELL_MIN_ALPHA + (income / maxIncome) * (CELL_MAX_ALPHA - CELL_MIN_ALPHA);
  return successColor + toHexAlpha(alpha);
}

export default function CalendarView() {
  const colors = useThemeColors();
  const { profile } = useProfile();
  const refCurrency = profile?.refCurrency ?? "NGN";

  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const year = cursor.getFullYear();
  const month = cursor.getMonth() + 1;
  const { dailySpend, monthTotals, isLoading, refetch } = useDailySpend(
    year,
    month,
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const dataByDate = useMemo(() => {
    const map = new Map<
      string,
      { spend: number; income: number; net: number }
    >();
    for (const p of dailySpend)
      map.set(p.date, { spend: p.spend, income: p.income, net: p.net });
    return map;
  }, [dailySpend]);

  const maxSpend = useMemo(
    () => dailySpend.reduce((max, p) => Math.max(max, p.spend), 0),
    [dailySpend],
  );
  const maxIncome = useMemo(
    () => dailySpend.reduce((max, p) => Math.max(max, p.income), 0),
    [dailySpend],
  );

  const gridDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  function dayData(day: Date): { spend: number; income: number; net: number } {
    return (
      dataByDate.get(format(day, "yyyy-MM-dd")) ?? {
        spend: 0,
        income: 0,
        net: 0,
      }
    );
  }

  function selectDay(day: Date) {
    setSelectedDay(day);
    setDetailOpen(false);
  }

  const selected = selectedDay ? dayData(selectedDay) : null;
  const selectedNet = selected?.net ?? 0;

  return (
    <>
      <View style={styles.monthNav}>
        <Pressable
          onPress={() => {
            setCursor((c) => subMonths(c, 1));
            setSelectedDay(null);
          }}
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
          onPress={() => {
            setCursor((c) => addMonths(c, 1));
            setSelectedDay(null);
          }}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {isLoading ? (
          <SkeletonBox width="100%" height={340} radius={RADIUS.lg} />
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
                const isSelected = !!selectedDay && isSameDay(day, selectedDay);
                const { spend, income } = inMonth
                  ? dayData(day)
                  : { spend: 0, income: 0 };

                const tint = inMonth
                  ? cellTint(
                      spend,
                      income,
                      maxSpend,
                      maxIncome,
                      colors.error,
                      colors.success,
                    )
                  : undefined;

                return (
                  <View key={day.toISOString()} style={styles.cellWrap}>
                    <Pressable
                      onPress={() => inMonth && selectDay(day)}
                      disabled={!inMonth}
                      style={[
                        styles.cell,
                        { backgroundColor: tint ?? "transparent" },
                        today && {
                          borderWidth: 1.5,
                          borderColor: colors.textSecondary,
                        },
                        isSelected && {
                          borderWidth: 2,
                          borderColor: colors.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          {
                            color: !inMonth
                              ? colors.textSubtle
                              : today
                                ? colors.primary
                                : colors.textPrimary,
                            fontFamily:
                              today || isSelected ? FONTS.bold : FONTS.semiBold,
                            opacity: inMonth ? 1 : 0.3,
                          },
                        ]}
                      >
                        {format(day, "d")}
                      </Text>
                      <Text
                        style={[
                          styles.cellAmount,
                          { color: colors.error, fontFamily: FONTS.mono },
                        ]}
                      >
                        {compactAmount(spend)}
                      </Text>
                      <Text
                        style={[
                          styles.cellAmount,
                          { color: colors.success, fontFamily: FONTS.mono },
                        ]}
                      >
                        {compactAmount(income)}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {selectedDay && selected && (
              <View
                style={[
                  styles.daySummaryCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.daySummaryHeader}>
                  <Text
                    style={[
                      styles.daySummaryDate,
                      { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    {format(selectedDay, "EEEE, d MMMM")}
                  </Text>
                  <Pressable
                    onPress={() => setSelectedDay(null)}
                    hitSlop={12}
                    style={[
                      styles.closeBtn,
                      { backgroundColor: colors.surface2 },
                    ]}
                  >
                    <Ionicons
                      name="close"
                      size={16}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>

                <View style={styles.daySummaryStatsRow}>
                  <View style={styles.daySummaryStat}>
                    <Text
                      style={[
                        styles.statLabel,
                        {
                          color: colors.textSubtle,
                          fontFamily: FONTS.semiBold,
                        },
                      ]}
                    >
                      SPEND
                    </Text>
                    <Text
                      style={[
                        styles.statValue,
                        { color: colors.error, fontFamily: FONTS.mono },
                      ]}
                    >
                      {formatCurrency(selected.spend, refCurrency)}
                    </Text>
                  </View>
                  <View style={styles.daySummaryStat}>
                    <Text
                      style={[
                        styles.statLabel,
                        {
                          color: colors.textSubtle,
                          fontFamily: FONTS.semiBold,
                        },
                      ]}
                    >
                      INCOME
                    </Text>
                    <Text
                      style={[
                        styles.statValue,
                        { color: colors.success, fontFamily: FONTS.mono },
                      ]}
                    >
                      {formatCurrency(selected.income, refCurrency)}
                    </Text>
                  </View>
                  <View style={styles.daySummaryStat}>
                    <Text
                      style={[
                        styles.statLabel,
                        {
                          color: colors.textSubtle,
                          fontFamily: FONTS.semiBold,
                        },
                      ]}
                    >
                      NET
                    </Text>
                    <Text
                      style={[
                        styles.statValue,
                        {
                          color:
                            selectedNet >= 0 ? colors.success : colors.error,
                          fontFamily: FONTS.mono,
                        },
                      ]}
                    >
                      {selectedNet >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(selectedNet), refCurrency)}
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => setDetailOpen(true)}
                  style={[
                    styles.viewDetailsBtn,
                    { borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.viewDetailsText,
                      { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    View transactions
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={15}
                    color={colors.textSubtle}
                  />
                </Pressable>
              </View>
            )}

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
                TOTAL — {format(cursor, "MMMM")}
              </Text>
              <View style={styles.totalRow}>
                <View style={styles.totalStat}>
                  <Text
                    style={[
                      styles.totalStatLabel,
                      { color: colors.textSubtle, fontFamily: FONTS.regular },
                    ]}
                  >
                    Spend
                  </Text>
                  <Text
                    style={[
                      styles.totalValue,
                      { color: colors.error, fontFamily: FONTS.mono },
                    ]}
                  >
                    {formatCurrency(monthTotals.spend, refCurrency)}
                  </Text>
                </View>
                <View style={styles.totalStat}>
                  <Text
                    style={[
                      styles.totalStatLabel,
                      { color: colors.textSubtle, fontFamily: FONTS.regular },
                    ]}
                  >
                    Income
                  </Text>
                  <Text
                    style={[
                      styles.totalValue,
                      { color: colors.success, fontFamily: FONTS.mono },
                    ]}
                  >
                    {formatCurrency(monthTotals.income, refCurrency)}
                  </Text>
                </View>
                <View style={styles.totalStat}>
                  <Text
                    style={[
                      styles.totalStatLabel,
                      { color: colors.textSubtle, fontFamily: FONTS.regular },
                    ]}
                  >
                    Net
                  </Text>
                  <Text
                    style={[
                      styles.totalValue,
                      {
                        color:
                          monthTotals.net >= 0 ? colors.success : colors.error,
                        fontFamily: FONTS.mono,
                      },
                    ]}
                  >
                    {monthTotals.net >= 0 ? "+" : "-"}
                    {formatCurrency(Math.abs(monthTotals.net), refCurrency)}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {detailOpen && selectedDay && (
        <DayTransactionsSheet
          date={selectedDay}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
  weekdayLabel: { fontSize: 11 },
  cell: {
    width: "100%",
    minHeight: 56,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    gap: 1,
  },
  dayNumber: { fontSize: 13 },
  cellAmount: { fontSize: 9, lineHeight: 11 },
  daySummaryCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  daySummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  daySummaryDate: { fontSize: FONT_SIZE.bodySmall, letterSpacing: -0.2 },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  daySummaryStatsRow: { flexDirection: "row" },
  daySummaryStat: { flex: 1, gap: 2 },
  statLabel: { fontSize: 10, letterSpacing: 0.4 },
  statValue: { fontSize: 14, letterSpacing: -0.2 },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: SPACING.sm,
  },
  viewDetailsText: { fontSize: 13 },
  totalCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  totalLabel: { fontSize: 11, letterSpacing: 0.6 },
  totalRow: { flexDirection: "row", gap: SPACING.lg },
  totalStat: { gap: 2 },
  totalStatLabel: { fontSize: 12 },
  totalValue: { fontSize: FONT_SIZE.h3, letterSpacing: -0.3 },
});
