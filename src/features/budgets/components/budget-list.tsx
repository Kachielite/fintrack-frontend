import React from "react";
import { View, StyleSheet } from "react-native";
import { SPACING } from "@/core/common/constants/theme";
import { Budget } from "../budgets.interface";
import SectionHeader from "@/core/common/components/SectionHeader";
import EmptyState from "@/core/common/components/EmptyState";
import GlassCard from "@/core/common/components/GlassCard";
import BudgetCard from "./budget-card";
import BudgetSkeleton from "./budget-skeleton";

interface Props {
  budgets: Budget[];
  isLoading: boolean;
  onPressBudget: (budget: Budget) => void;
}

export default function BudgetList({
  budgets,
  isLoading,
  onPressBudget,
}: Props) {
  return (
    <View style={budgets.length === 0 && !isLoading ? styles.flexContainer : undefined}>
      <SectionHeader title="How are my budgets doing?" />

      {isLoading ? (
        <BudgetSkeleton />
      ) : budgets.length === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <EmptyState
            icon="sparkles-outline"
            message="Iris is working on your budgets"
            subMessage="We'll automatically generate spending limits based on your transaction history. Check back shortly."
          />
        </GlassCard>
      ) : (
        <View style={styles.list}>
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onPress={() => onPressBudget(budget)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: { flex: 1 },
  list: { gap: SPACING.sm },
  emptyCard: { flex: 1, justifyContent: "center" },
});

