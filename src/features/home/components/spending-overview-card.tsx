import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import CurrencyBreakdownSheet from "./currency-breakdown-sheet";
import { FONTS, FONT_SIZE, SPACING } from "@/core/common/constants/theme";
import { TransactionSummary } from "@/features/transactions/transactions.interface";
import { formatCurrency } from "@/core/common/utils/currency";
import GlassCard from "@/core/common/components/GlassCard";
import SkeletonBox from "@/core/common/components/SkeletonBox";
import EmptyState from "@/core/common/components/EmptyState";

interface SpendingOverviewCardProps {
  summary: TransactionSummary | undefined;
  isLoading: boolean;
}

export default function SpendingOverviewCard({
  summary,
  isLoading,
}: SpendingOverviewCardProps) {
  const colors = useThemeColors();
  const [sheetOpen, setSheetOpen] = useState(false);

  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const daysLeft = daysInMonth - dayOfMonth;
  const progressPct = (dayOfMonth / daysInMonth) * 100;
  const monthName = now.toLocaleString("default", { month: "long" });

  const delta = summary?.vsLastPeriodPct;
  const isDown = delta !== null && delta !== undefined && delta < 0;

  return (
    <GlassCard>
      <View style={styles.questionWrap}>
        <Text
          style={[
            styles.question,
            { color: colors.textPrimary, fontFamily: FONTS.semiBold },
          ]}
        >
          How am I doing this month?
        </Text>
      </View>

      {isLoading ? (
        <View style={[styles.body, { gap: SPACING.sm }]}>
          <SkeletonBox width={160} height={36} radius={8} />
          <SkeletonBox width={140} height={12} radius={6} />
          <SkeletonBox width="100%" height={6} radius={3} />
        </View>
      ) : !summary ? (
        <EmptyState
          icon="calendar-outline"
          message="No spending data yet"
          subMessage="Transactions for this month will appear here once your emails are synced."
        />
      ) : (
        <>
          <View style={[styles.body, { gap: SPACING.xs }]}>
            <Text
              style={[
                styles.amount,
                { color: colors.textPrimary, fontFamily: FONTS.bold },
              ]}
            >
              {formatCurrency(summary.totalSpend, summary.refCurrency)}
            </Text>
            <Text
              style={[
                styles.sub,
                { color: colors.textSubtle, fontFamily: FONTS.regular },
              ]}
            >
              spent so far in {monthName} · {daysLeft} day
              {daysLeft !== 1 ? "s" : ""} left
            </Text>

            <View style={styles.progressWrap}>
              <View
                style={[
                  styles.progressTrack,
                  { backgroundColor: colors.surface2 },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.primary,
                      width: `${progressPct}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  { color: colors.textSubtle, fontFamily: FONTS.mono },
                ]}
              >
                day {dayOfMonth}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.footer,
              {
                borderTopColor: colors.border,
                backgroundColor: colors.surface2,
              },
            ]}
          >
            {delta !== null && delta !== undefined && (
              <View style={styles.deltaRow}>
                <Text
                  style={[
                    styles.deltaText,
                    { color: colors.textSubtle, fontFamily: FONTS.regular },
                  ]}
                >
                  Compared to your last 3-month average
                </Text>
                <Text
                  style={[
                    styles.deltaPct,
                    {
                      color: isDown ? colors.success : colors.warning,
                      fontFamily: FONTS.semiBold,
                    },
                  ]}
                >
                  {isDown ? "↓" : "↑"} {Math.abs(Math.round(delta))}%
                </Text>
              </View>
            )}
            <Pressable
              onPress={() => setSheetOpen(true)}
              style={styles.currencyLink}
            >
              <Text
                style={[
                  styles.currencyLinkText,
                  { color: colors.primary, fontFamily: FONTS.semiBold },
                ]}
              >
                See spending across currencies
              </Text>
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.primary}
              />
            </Pressable>
          </View>
        </>
      )}

      {summary && (
        <CurrencyBreakdownSheet
          visible={sheetOpen}
          onClose={() => setSheetOpen(false)}
          summary={summary}
        />
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  questionWrap: { padding: SPACING.lg, paddingBottom: SPACING.xs },
  question: { fontSize: FONT_SIZE.body, letterSpacing: -0.2, lineHeight: 22 },
  body: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  amount: { fontSize: 34, letterSpacing: -1, lineHeight: 40 },
  sub: { fontSize: 12 },
  progressWrap: { marginTop: SPACING.xs, gap: 4 },
  progressTrack: { height: 6, borderRadius: 99, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 99 },
  dayLabel: { fontSize: 10, alignSelf: "flex-end" },
  footer: { borderTopWidth: 1, padding: SPACING.base, gap: SPACING.sm },
  deltaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deltaText: { fontSize: 12, flex: 1 },
  deltaPct: { fontSize: 13 },
  currencyLink: { flexDirection: "row", alignItems: "center", gap: 4 },
  currencyLinkText: { fontSize: 13 },
});
