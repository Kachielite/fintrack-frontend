import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS, CATEGORY_COLORS } from "@/core/common/constants/theme";
import { Budget } from "../budgets.interface";
import { CategoryPoint } from "@/features/insights/hooks/use-chart-data";
import { CATEGORY_LABELS } from "@/features/transactions/transactions.constants";
import { currencySymbol } from "@/core/common/utils/currency";

const CATEGORY_DISPLAY: Record<string, string> = {
  food: "Food & Dining",
  transit: "Transport",
  utility: "Utilities",
  subs: "Subscriptions",
  transfer: "Transfers",
  fun: "Entertainment",
  health: "Health",
  other: "Other",
};

function buildMessage(
  budgets: Budget[],
  categorySpend: CategoryPoint[],
  refCurrency: string,
): { title: string; body: string } {
  const sym = currencySymbol(refCurrency);
  const budgetedCats = new Set(budgets.map((b) => b.category));

  const unbudgeted = categorySpend
    .filter((c) => !budgetedCats.has(c.category as any) && c.total > 0)
    .slice(0, 3);

  if (unbudgeted.length >= 2) {
    const [top, second] = unbudgeted;
    const topLabel = CATEGORY_DISPLAY[top.category] ?? top.category;
    const secondLabel = CATEGORY_DISPLAY[second.category] ?? second.category;
    return {
      title: "Untracked spending areas",
      body: `${topLabel} (${sym}${Math.round(top.total)}) and ${secondLabel} (${sym}${Math.round(second.total)}) have no budget limits yet. Setting caps on these could give you a clearer picture of where your money goes.`,
    };
  }

  if (unbudgeted.length === 1) {
    const u = unbudgeted[0];
    const label = CATEGORY_DISPLAY[u.category] ?? u.category;
    return {
      title: "One area to consider",
      body: `You're spending ${sym}${Math.round(u.total)} on ${label} this month with no budget set. A small limit here could help you stay in control.`,
    };
  }

  const over = budgets.filter((b) => b.status === "over");
  if (over.length > 0) {
    const labels = over.map((b) => CATEGORY_DISPLAY[b.category] ?? b.category).join(" and ");
    return {
      title: "Budget exceeded",
      body: `You've gone over your ${labels} budget this month. Consider adjusting the limit or trimming back spending there for the rest of the period.`,
    };
  }

  const warning = budgets.filter((b) => b.status === "warning");
  if (warning.length > 0) {
    const first = warning[0];
    const label = CATEGORY_DISPLAY[first.category] ?? first.category;
    return {
      title: "Getting close",
      body: `Your ${label} budget is approaching its limit with ${first.daysRemaining} day${first.daysRemaining !== 1 ? "s" : ""} left this month. You're doing well — stay steady and you'll finish in the green.`,
    };
  }

  return {
    title: "All budgets healthy",
    body: "Every budget is within its limit this month. Staying consistent with these habits is the most reliable path to long-term financial progress.",
  };
}

interface Props {
  budgets: Budget[];
  categorySpend: CategoryPoint[];
  refCurrency: string;
}

export default function BudgetAdvisorCard({ budgets, categorySpend, refCurrency }: Props) {
  const colors = useThemeColors();
  const { title, body } = buildMessage(budgets, categorySpend, refCurrency);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.primaryLight,
          borderColor: colors.primary + "33",
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.avatarWrap, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.onPrimary }]}>I</Text>
        </View>
        <View>
          <Text style={[styles.name, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
            Iris
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
            Budget coach
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        {title}
      </Text>

      <Text style={[styles.message, { color: colors.textPrimary, fontFamily: FONTS.medium }]}>
        {body}
      </Text>

      <View style={styles.footer}>
        <Ionicons name="sparkles" size={11} color={colors.primary} />
        <Text style={[styles.footerLabel, { color: colors.primary, fontFamily: FONTS.bold }]}>
          BUDGET INSIGHT
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: 2,
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: FONT_SIZE.bodySmall, fontFamily: FONTS.bold },
  name: { fontSize: 13, letterSpacing: -0.1 },
  subtitle: { fontSize: 11 },
  title: { fontSize: 14, letterSpacing: -0.2 },
  message: {
    fontSize: FONT_SIZE.body,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  footerLabel: { fontSize: 10, letterSpacing: 0.8 },
});
