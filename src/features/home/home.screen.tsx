import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import { useProfile } from "@/features/user/hooks/use-profile";
import { useTransactionSummary } from "@/features/transactions/hooks/use-transaction-summary";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { useInsights } from "@/features/insights/hooks/use-insights";
import HomeHeader from "./components/home-header";
import SpendingOverviewCard from "./components/spending-overview-card";
import CategoryBreakdownCard from "./components/category-breakdown-card";
import IrisInsightCard from "./components/iris-insight-card";
import RecentTransactionsCard from "./components/recent-transactions-card";

export default function HomeScreen() {
  const colors = useThemeColors();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { profile } = useProfile();
  const { summary, isLoading: summaryLoading } = useTransactionSummary(
    year,
    month,
  );
  const { transactions, isLoading: txLoading } = useTransactions({ limit: 4 });
  const { insights, isLoading: insightsLoading } = useInsights();

  const latestInsight = insights.find((i) => !i.isRead) ?? insights[0];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader firstName={profile?.firstName} />

        <View style={styles.content}>
          <SpendingOverviewCard summary={summary} isLoading={summaryLoading} />
          <CategoryBreakdownCard summary={summary} isLoading={summaryLoading} />
          <IrisInsightCard
            insight={latestInsight}
            isLoading={insightsLoading}
          />
          <RecentTransactionsCard
            transactions={transactions}
            isLoading={txLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 100 },
  content: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.base,
  },
});
