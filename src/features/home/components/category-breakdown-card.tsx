import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  CATEGORY_COLORS,
} from "@/core/common/constants/theme";
import {
  TransactionSummary,
  CategoryType,
} from "@/features/transactions/transactions.interface";
import { CATEGORY_LABELS } from "@/features/transactions/transactions.constants";
import GlassCard from "@/core/common/components/GlassCard";
import DonutChart from "@/core/common/components/DonutChart";
import SkeletonBox from "@/core/common/components/SkeletonBox";
import EmptyState from "@/core/common/components/EmptyState";

interface CategoryBreakdownCardProps {
  summary: TransactionSummary | undefined;
  isLoading: boolean;
}

export default function CategoryBreakdownCard({
  summary,
  isLoading,
}: CategoryBreakdownCardProps) {
  const colors = useThemeColors();

  const top5 = (summary?.byCategory ?? [])
    .slice()
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((c) => ({
      category: c.category,
      total: c.total,
      percentage: c.percentage,
      color:
        CATEGORY_COLORS[c.category as CategoryType] ?? colors.textSubtle,
    }));

  const totalTopPct = Math.round(top5.reduce((s, c) => s + c.percentage, 0));
  const hasData = top5.length > 0;

  return (
    <GlassCard>
      <View style={styles.questionWrap}>
        <Text
          style={[
            styles.question,
            { color: colors.textPrimary, fontFamily: FONTS.semiBold },
          ]}
        >
          Where is my money going?
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.skeleton}>
          <SkeletonBox width={130} height={130} radius={65} />
          <View style={{ flex: 1, gap: SPACING.sm }}>
            {[100, 80, 90, 70, 60].map((w, i) => (
              <SkeletonBox key={i} width={w} height={11} radius={5} />
            ))}
          </View>
        </View>
      ) : !hasData ? (
        <EmptyState
          icon="pie-chart-outline"
          message="No category data yet"
          subMessage="Your spending breakdown will appear once transactions are synced."
        />
      ) : (
        <View style={styles.content}>
          <DonutChart
            data={top5.map((c) => ({ value: c.total, color: c.color }))}
            size={130}
            thickness={20}
          >
            <Text
              style={[
                styles.donutTop,
                { color: colors.textSubtle, fontFamily: FONTS.semiBold },
              ]}
            >
              top 5
            </Text>
            <Text
              style={[
                styles.donutPct,
                { color: colors.textPrimary, fontFamily: FONTS.bold },
              ]}
            >
              {totalTopPct}%
            </Text>
            <Text
              style={[
                styles.donutSub,
                { color: colors.textSubtle, fontFamily: FONTS.regular },
              ]}
            >
              of spend
            </Text>
          </DonutChart>

          <View style={styles.legend}>
            {top5.map((c) => (
              <View key={c.category} style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: c.color }]} />
                <Text
                  style={[
                    styles.legendLabel,
                    { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                  ]}
                  numberOfLines={1}
                >
                  {CATEGORY_LABELS[c.category] ?? c.category}
                </Text>
                <Text
                  style={[
                    styles.legendPct,
                    { color: colors.textSubtle, fontFamily: FONTS.mono },
                  ]}
                >
                  {Math.round(c.percentage)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  questionWrap: { padding: SPACING.lg, paddingBottom: SPACING.xs },
  question: { fontSize: FONT_SIZE.body, letterSpacing: -0.2, lineHeight: 22 },
  skeleton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  donutTop: { fontSize: 10 },
  donutPct: { fontSize: 20, letterSpacing: -0.5, lineHeight: 24 },
  donutSub: { fontSize: 9 },
  legend: { flex: 1, gap: SPACING.sm },
  legendRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  legendLabel: { flex: 1, fontSize: 12, letterSpacing: -0.1 },
  legendPct: { fontSize: 11 },
});
