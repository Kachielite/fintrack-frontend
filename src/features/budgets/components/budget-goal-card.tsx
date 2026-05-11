import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { Goal } from "@/features/goals/goals.interface";
import { formatCurrency } from "@/core/common/utils/currency";
import { formatDate } from "@/core/common/utils/date";
import GlassCard from "@/core/common/components/GlassCard";
import SectionHeader from "@/core/common/components/SectionHeader";

interface Props {
  goal: Goal;
}

export default function BudgetGoalCard({ goal }: Props) {
  const colors = useThemeColors();

  const pct = goal.progressPct ?? 0;
  const clampedPct = Math.min(Math.max(pct, 0), 100);
  const currency = goal.currency ?? "NGN";

  return (
    <View>
      <SectionHeader title="Am I getting closer to my goal?" />
      <GlassCard>
        <View style={styles.body}>
          {/* Name + percentage pill */}
          <View style={styles.topRow}>
            <View style={styles.nameWrap}>
              <Text
                style={[
                  styles.label,
                  { color: colors.textSubtle, fontFamily: FONTS.semiBold },
                ]}
              >
                Saving toward
              </Text>
              <Text
                style={[
                  styles.name,
                  { color: colors.textPrimary, fontFamily: FONTS.bold },
                ]}
                numberOfLines={2}
              >
                {goal.name}
              </Text>
            </View>
            <View
              style={[
                styles.pill,
                { backgroundColor: colors.primaryMid },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: colors.primary, fontFamily: FONTS.bold },
                ]}
              >
                {Math.round(clampedPct)}%
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View
            style={[styles.track, { backgroundColor: colors.surface2 }]}
          >
            <View
              style={[
                styles.fill,
                {
                  backgroundColor: colors.primary,
                  width: `${clampedPct}%`,
                },
              ]}
            />
          </View>

          {/* Amounts row */}
          <View style={styles.amountsRow}>
            <View>
              <Text
                style={[
                  styles.savedAmount,
                  { color: colors.textPrimary, fontFamily: FONTS.bold },
                ]}
              >
                {formatCurrency(goal.savedAmount, currency)}
              </Text>
              <Text
                style={[
                  styles.savedLabel,
                  { color: colors.textSubtle, fontFamily: FONTS.regular },
                ]}
              >
                saved
              </Text>
            </View>
            {goal.targetAmount != null && (
              <Text
                style={[
                  styles.target,
                  { color: colors.textSubtle, fontFamily: FONTS.regular },
                ]}
              >
                of{" "}
                <Text style={{ fontFamily: FONTS.mono, color: colors.textPrimary }}>
                  {formatCurrency(goal.targetAmount, currency)}
                </Text>
              </Text>
            )}
          </View>

          {/* Target date note */}
          {goal.targetDate && (
            <View
              style={[
                styles.note,
                { backgroundColor: colors.surface2 },
              ]}
            >
              <Text
                style={[
                  styles.noteText,
                  { color: colors.textSubtle, fontFamily: FONTS.regular },
                ]}
              >
                Target date:{" "}
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  }}
                >
                  {formatDate(goal.targetDate)}
                </Text>
              </Text>
            </View>
          )}
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: SPACING.lg,
    gap: SPACING.base,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  nameWrap: { flex: 1, gap: 2 },
  label: { fontSize: 12 },
  name: { fontSize: FONT_SIZE.body + 1, letterSpacing: -0.3, lineHeight: 24 },
  pill: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    flexShrink: 0,
  },
  pillText: { fontSize: 13 },
  track: {
    height: 10,
    borderRadius: 99,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 99 },
  amountsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  savedAmount: { fontSize: FONT_SIZE.h3 },
  savedLabel: { fontSize: 13 },
  target: { fontSize: 13 },
  note: {
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
  },
  noteText: { fontSize: 12, lineHeight: 18 },
});

