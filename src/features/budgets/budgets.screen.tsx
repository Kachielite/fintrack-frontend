import React, { useState, useCallback, useEffect } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import { useBudgets } from "./hooks/use-budgets";
import { useGoals } from "@/features/goals/hooks/use-goals";
import { useChartData } from "@/features/insights/hooks/use-chart-data";
import { useAutoGenerateBudgets } from "./hooks/use-auto-generate-budgets";
import { Budget } from "./budgets.interface";
import { useUserStore } from "@/features/user/user.state";
import BudgetHeader from "./components/budget-header";
import BudgetAdvisorCard from "./components/budget-advisor-card";
import BudgetList from "./components/budget-list";
import BudgetGoalCard from "./components/budget-goal-card";
import BudgetAIGoalCard from "./components/budget-ai-goal-card";
import BudgetCategorySheet from "./components/budget-category-sheet";

export default function BudgetsScreen() {
  const colors = useThemeColors();

  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoGenerateFired, setAutoGenerateFired] = useState(false);

  // ── Data ─────────────────────────────────────────────────────────────────
  const { budgets, isLoading: budgetsLoading, refetch: refetchBudgets } = useBudgets();
  const { goals, refetch: refetchGoals } = useGoals();
  const { chartData, refetch: refetchChart } = useChartData("1m");
  const { autoGenerate, isGenerating } = useAutoGenerateBudgets();
  const profile = useUserStore((s) => s.profile);

  /** First active goal with a target amount */
  const primaryGoal =
    goals.find((g) => g.isActive && g.targetAmount != null) ?? goals[0];

  // Auto-generate budgets on first load when none exist
  useEffect(() => {
    if (!budgetsLoading && budgets.length === 0 && !autoGenerateFired) {
      setAutoGenerateFired(true);
      autoGenerate();
    }
  }, [budgetsLoading, budgets.length, autoGenerateFired, autoGenerate]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchBudgets(), refetchGoals(), refetchChart()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBudgets, refetchGoals, refetchChart]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <BudgetHeader />

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
        {/* Budget-specific Iris coach card — shown once we have spending data */}
        {chartData && (
          <BudgetAdvisorCard
            budgets={budgets}
            categorySpend={chartData.by_category}
            refCurrency={chartData.ref_currency}
          />
        )}

        {/* Budget category cards */}
        <BudgetList
          budgets={budgets}
          isLoading={budgetsLoading || isGenerating}
          onPressBudget={setSelectedBudget}
        />

        {/* AI goal progress assessment */}
        {chartData && (
          <BudgetAIGoalCard
            goalType={profile?.goalType ?? null}
            budgets={budgets}
            monthlyTrend={chartData.monthly_trend}
            refCurrency={chartData.ref_currency}
          />
        )}

        {/* Goal progress */}
        {primaryGoal && <BudgetGoalCard goal={primaryGoal} />}
      </ScrollView>

      {/* Category detail bottom sheet */}
      {selectedBudget && (
        <BudgetCategorySheet
          visible={!!selectedBudget}
          onClose={() => setSelectedBudget(null)}
          budget={selectedBudget}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xs,
    paddingBottom: 110,
    gap: SPACING.lg,
  },
});

