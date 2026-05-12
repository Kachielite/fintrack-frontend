import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  CATEGORY_COLORS,
} from "@/core/common/constants/theme";
import {
  CATEGORY_LABELS,
  CATEGORY_ICON_NAMES,
} from "@/features/transactions/transactions.constants";
import { formatCurrency } from "@/core/common/utils/currency";
import { Budget } from "../budgets.interface";
import BudgetProgressBar from "./budget-progress-bar";
import GlassCard from "@/core/common/components/GlassCard";

const STATUS_LABELS: Record<Budget["status"], string> = {
  healthy: "On track",
  warning: "Heads up",
  over: "Over budget",
};

interface Props {
  budget: Budget;
  onPress: () => void;
}

export default function BudgetCard({ budget, onPress }: Props) {
  const colors = useThemeColors();

  const catColor = CATEGORY_COLORS[budget.category] ?? colors.textSubtle;
  const iconName = (CATEGORY_ICON_NAMES[budget.category] ??
    "ellipsis-horizontal-outline") as React.ComponentProps<
    typeof Ionicons
  >["name"];

  const statusColor =
    budget.status === "over"
      ? colors.error
      : budget.status === "warning"
        ? colors.warning
        : colors.success;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      <GlassCard style={styles.card}>
        <View style={styles.top}>
          {/* Category icon */}
          <View
            style={[styles.iconWrap, { backgroundColor: catColor + "22" }]}
          >
            <Ionicons name={iconName} size={20} color={catColor} />
          </View>

          {/* Name + status */}
          <View style={styles.info}>
            <Text
              style={[
                styles.name,
                { color: colors.textPrimary, fontFamily: FONTS.semiBold },
              ]}
            >
              {CATEGORY_LABELS[budget.category]}
            </Text>
            <Text
              style={[
                styles.statusText,
                { color: statusColor, fontFamily: FONTS.semiBold },
              ]}
            >
              {STATUS_LABELS[budget.status]} · {budget.daysRemaining}d left
            </Text>
          </View>

          {/* Amounts */}
          <View style={styles.amounts}>
            <Text
              style={[
                styles.spent,
                {
                  color:
                    budget.status === "over"
                      ? statusColor
                      : colors.textPrimary,
                  fontFamily: FONTS.semiBold,
                },
              ]}
            >
              {formatCurrency(budget.spent, budget.currency)}
            </Text>
            <Text
              style={[
                styles.limit,
                { color: colors.textSubtle, fontFamily: FONTS.mono },
              ]}
            >
              of {formatCurrency(budget.limitAmount, budget.currency)}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={14}
            color={colors.textSubtle}
          />
        </View>

        <BudgetProgressBar
          percentage={budget.percentage}
          status={budget.status}
        />

        {budget.habitDescription && (
          <Text
            style={[
              styles.habitNote,
              { color: colors.textSubtle, fontFamily: FONTS.regular },
            ]}
            numberOfLines={2}
          >
            {budget.habitDescription}
          </Text>
        )}
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: SPACING.base, gap: SPACING.sm },
  pressed: { opacity: 0.7 },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: { flex: 1 },
  name: { fontSize: FONT_SIZE.bodySmall, letterSpacing: -0.2 },
  statusText: { fontSize: 11, marginTop: 2 },
  amounts: { alignItems: "flex-end", flexShrink: 0 },
  spent: { fontSize: FONT_SIZE.bodySmall, letterSpacing: -0.2 },
  limit: { fontSize: 10, marginTop: 1 },
  habitNote: { fontSize: 11, lineHeight: 16, marginTop: 2 },
});

