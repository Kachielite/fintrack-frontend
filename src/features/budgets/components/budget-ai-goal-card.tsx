import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { currencySymbol } from "@/core/common/utils/currency";
import GlassCard from "@/core/common/components/GlassCard";
import SectionHeader from "@/core/common/components/SectionHeader";
import { Budget } from "../budgets.interface";
import { MonthlyPoint } from "@/features/insights/hooks/use-chart-data";

const GOAL_LABELS: Record<string, string> = {
  save: "Save more money",
  debt: "Pay off debt",
  daily: "Manage daily spending",
  specific: "Reach a specific goal",
};

interface Assessment {
  onTrack: boolean;
  headline: string;
  message: string;
}

function buildAssessment(
  goalType: string | null,
  budgets: Budget[],
  monthlyTrend: MonthlyPoint[],
  refCurrency: string,
): Assessment {
  const sym = currencySymbol(refCurrency);
  const overBudget = budgets.filter((b) => b.status === "over").length;
  const warningBudget = budgets.filter((b) => b.status === "warning").length;
  const totalBudgets = budgets.length;

  const recentMonths = monthlyTrend.slice(-3).filter((m) => m.income > 0 || m.spend > 0);
  const avgNet =
    recentMonths.length > 0
      ? recentMonths.reduce((s, m) => s + (m.income - m.spend), 0) / recentMonths.length
      : 0;
  const isNetPositive = avgNet > 0;

  if (goalType === "save") {
    if (overBudget > 0) {
      return {
        onTrack: false,
        headline: "Needs attention",
        message: `You're over budget in ${overBudget} categor${overBudget > 1 ? "ies" : "y"} this month, which is working against your savings goal. Cutting back there could free up meaningful money each month.`,
      };
    }
    if (isNetPositive) {
      return {
        onTrack: true,
        headline: "On track",
        message: `You're spending less than you earn — averaging ${sym}${Math.round(avgNet)} net positive per month. Keep it up and consider moving any surplus straight into savings.`,
      };
    }
    return {
      onTrack: false,
      headline: "Needs attention",
      message: `Your spending is close to or exceeding your income. To build savings, tighten spending in your highest categories and set a budget limit for each.`,
    };
  }

  if (goalType === "debt") {
    if (overBudget > 1) {
      return {
        onTrack: false,
        headline: "Needs attention",
        message: `Overspending in ${overBudget} areas makes it harder to direct money toward debt. Focus on your highest-cost categories first to free up cash flow.`,
      };
    }
    if (isNetPositive) {
      return {
        onTrack: true,
        headline: "On track",
        message: `You have a positive net position each month. If you can consistently keep ${sym}${Math.round(avgNet)} free, direct it toward your highest-interest obligation first.`,
      };
    }
    return {
      onTrack: false,
      headline: "Needs attention",
      message: `Your spending patterns leave limited room for debt payments. Reducing non-essential spending and setting tighter budgets will help you make faster progress.`,
    };
  }

  if (goalType === "daily") {
    if (overBudget === 0 && warningBudget === 0) {
      return {
        onTrack: true,
        headline: "On track",
        message:
          totalBudgets === 0
            ? "You haven't set any budgets yet. Add limits to your main spending categories so Iris can track your day-to-day progress."
            : "All your budgets are within healthy limits. You're managing your daily spending well — consistency is what makes this stick.",
      };
    }
    if (overBudget > 0) {
      return {
        onTrack: false,
        headline: "Needs attention",
        message: `${overBudget} of your budget${overBudget > 1 ? "s have" : " has"} gone over the limit this month. Review those categories to understand where the overspend is happening and adjust accordingly.`,
      };
    }
    return {
      onTrack: true,
      headline: "Almost there",
      message: `${warningBudget} budget${warningBudget > 1 ? "s are" : " is"} approaching the limit with days still left. You're doing well — stay steady for the rest of the period.`,
    };
  }

  // "specific" or unknown
  if (isNetPositive && overBudget === 0) {
    return {
      onTrack: true,
      headline: "On track",
      message: `You're running a positive monthly net and staying within your budget limits — a solid foundation for reaching your financial goal.`,
    };
  }
  return {
    onTrack: false,
    headline: "Needs attention",
    message: `Some spending categories are exceeding their limits, which may slow progress toward your goal. Review your highest-spend areas and adjust limits where needed.`,
  };
}

interface Props {
  goalType: string | null;
  budgets: Budget[];
  monthlyTrend: MonthlyPoint[];
  refCurrency: string;
}

export default function BudgetAIGoalCard({ goalType, budgets, monthlyTrend, refCurrency }: Props) {
  const colors = useThemeColors();
  const { onTrack, headline, message } = buildAssessment(goalType, budgets, monthlyTrend, refCurrency);

  const statusColor = onTrack ? colors.success : colors.warning;
  const statusIcon: React.ComponentProps<typeof Ionicons>["name"] = onTrack
    ? "checkmark-circle"
    : "alert-circle";
  const goalLabel = GOAL_LABELS[goalType ?? ""] ?? "Your financial goal";

  return (
    <View>
      <SectionHeader title="Am I on track with my goal?" />
      <GlassCard>
        <View style={styles.body}>
          {/* Goal label row */}
          <View style={styles.goalRow}>
            <Ionicons name="flag-outline" size={13} color={colors.textSubtle} />
            <Text style={[styles.goalLabel, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
              {goalLabel}
            </Text>
          </View>

          {/* Status headline */}
          <View style={styles.statusRow}>
            <Ionicons name={statusIcon} size={20} color={statusColor} />
            <Text style={[styles.headline, { color: statusColor, fontFamily: FONTS.bold }]}>
              {headline}
            </Text>
          </View>

          {/* AI message */}
          <Text style={[styles.message, { color: colors.textPrimary, fontFamily: FONTS.regular }]}>
            {message}
          </Text>

          {/* Iris badge */}
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={11} color={colors.primary} />
            <Text style={[styles.badgeLabel, { color: colors.primary, fontFamily: FONTS.bold }]}>
              IRIS AI
            </Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  goalLabel: { fontSize: 12 },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: 2,
  },
  headline: { fontSize: FONT_SIZE.h3, letterSpacing: -0.3 },
  message: {
    fontSize: FONT_SIZE.body,
    lineHeight: 24,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: SPACING.xs,
  },
  badgeLabel: { fontSize: 10, letterSpacing: 0.8 },
});
