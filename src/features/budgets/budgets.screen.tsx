import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import { useBudgets } from "./hooks/use-budgets";
import { useBudgetSuggestions } from "./hooks/use-budget-suggestions";
import { useGoals } from "@/features/goals/hooks/use-goals";
import { useInsights } from "@/features/insights/hooks/use-insights";
import { Budget } from "./budgets.interface";
import BudgetHeader from "./components/budget-header";
import BudgetAdvisorCard from "./components/budget-advisor-card";
import BudgetList from "./components/budget-list";
import BudgetSuggestionCard from "./components/budget-suggestion-card";
import BudgetGoalCard from "./components/budget-goal-card";
import BudgetCategorySheet from "./components/budget-category-sheet";

export default function BudgetsScreen() {
  const colors = useThemeColors();

  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [dismissedCategories, setDismissedCategories] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // ── Data ─────────────────────────────────────────────────────────────────
  const { budgets, isLoading: budgetsLoading, refetch: refetchBudgets } = useBudgets();
  const { suggestions, refetch: refetchSuggestions } = useBudgetSuggestions();
  const { goals, refetch: refetchGoals } = useGoals();
  const { insights, refetch: refetchInsights } = useInsights();

  /** Use a budget-relevant insight if available, otherwise fall back to latest */
  const budgetInsight =
    insights.find(
      (i) =>
        i.type === "budget_warning" || i.type === "spending_pattern",
    ) ?? insights[0];

  /** First active goal with a target amount */
  const primaryGoal =
    goals.find((g) => g.isActive && g.targetAmount != null) ?? goals[0];

  /** First suggestion not already dismissed in this session */
  const visibleSuggestion = suggestions.find(
    (s) => !dismissedCategories.includes(s.category),
  );

  function dismissSuggestion(category: string) {
    setDismissedCategories((prev) => [...prev, category]);
  }

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchBudgets(),
        refetchSuggestions(),
        refetchGoals(),
        refetchInsights(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBudgets, refetchSuggestions, refetchGoals, refetchInsights]);

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
        {/* Iris advisor card — shown when there is a relevant insight */}
        {budgetInsight && <BudgetAdvisorCard insight={budgetInsight} />}

        {/* Budget category cards */}
        <BudgetList
          budgets={budgets}
          isLoading={budgetsLoading}
          onPressBudget={setSelectedBudget}
        />

        {/* AI-suggested budget */}
        {visibleSuggestion && (
          <BudgetSuggestionCard
            suggestion={visibleSuggestion}
            onDismiss={() => dismissSuggestion(visibleSuggestion.category)}
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

