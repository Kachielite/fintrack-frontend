import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import { useBudgets } from "./hooks/use-budgets";
import { useGoals } from "@/features/goals/hooks/use-goals";
import { useChartData } from "@/features/insights/hooks/use-chart-data";
import { useBudgetSuggestions } from "./hooks/use-budget-suggestions";
import { Budget, BudgetSuggestion } from "./budgets.interface";
import { useProfile } from "@/features/user/hooks/use-profile";
import BudgetHeader from "./components/budget-header";
import BudgetAdvisorCard from "./components/budget-advisor-card";
import BudgetList from "./components/budget-list";
import BudgetSuggestionCard from "./components/budget-suggestion-card";
import BudgetGoalCard from "./components/budget-goal-card";
import BudgetAIGoalCard from "./components/budget-ai-goal-card";
import BudgetCategorySheet from "./components/budget-category-sheet";
import AddBudgetSheet from "./components/add-budget-sheet";
import SectionHeader from "@/core/common/components/SectionHeader";

export default function BudgetsScreen() {
  const colors = useThemeColors();

  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissedCategories, setDismissedCategories] = useState<Set<string>>(
    new Set(),
  );

  // ── Data ─────────────────────────────────────────────────────────────────
  const {
    budgets,
    isLoading: budgetsLoading,
    refetch: refetchBudgets,
  } = useBudgets();

  const selectedBudget =
    selectedBudgetId != null
      ? (budgets.find((b) => b.id === selectedBudgetId) ?? null)
      : null;
  const { goals, refetch: refetchGoals } = useGoals();
  const { chartData, refetch: refetchChart } = useChartData("1m");
  const {
    suggestions,
    isLoading: suggestionsLoading,
    refetch: refetchSuggestions,
  } = useBudgetSuggestions();
  const { profile } = useProfile();

  /** First active goal with a target amount */
  const primaryGoal =
    goals.find((g) => g.isActive && g.targetAmount != null) ?? goals[0];

  // Only relevant while the user has no budgets yet — once they accept one
  // (or add one manually), budgets.length > 0 and this list stops mattering.
  const visibleSuggestions = suggestions.filter(
    (s) => !dismissedCategories.has(s.category),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchBudgets(),
        refetchGoals(),
        refetchChart(),
        refetchSuggestions(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBudgets, refetchGoals, refetchChart, refetchSuggestions]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <BudgetHeader onAdd={() => setAddSheetOpen(true)} />

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

        {/* Budget category cards — while the user has none yet, offer
            AI-suggested budgets to accept or dismiss instead of silently
            creating them. */}
        {budgets.length === 0 &&
        !budgetsLoading &&
        visibleSuggestions.length > 0 ? (
          <SuggestionsSection
            suggestions={visibleSuggestions}
            onDismiss={(category) =>
              setDismissedCategories((prev) => new Set(prev).add(category))
            }
          />
        ) : (
          <BudgetList
            budgets={budgets}
            isLoading={budgetsLoading || suggestionsLoading}
            onPressBudget={(b) => setSelectedBudgetId(b.id)}
          />
        )}

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
          onClose={() => setSelectedBudgetId(null)}
          budget={selectedBudget}
        />
      )}

      <AddBudgetSheet
        visible={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

function SuggestionsSection({
  suggestions,
  onDismiss,
}: {
  suggestions: BudgetSuggestion[];
  onDismiss: (category: string) => void;
}) {
  return (
    <View style={styles.suggestions}>
      <SectionHeader title="How are my budgets doing?" />
      {suggestions.map((s) => (
        <BudgetSuggestionCard
          key={s.category}
          suggestion={s}
          onDismiss={() => onDismiss(s.category)}
        />
      ))}
    </View>
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
  suggestions: { gap: SPACING.sm },
});
