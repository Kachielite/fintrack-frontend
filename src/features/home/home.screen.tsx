import React, { useState, useCallback } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import { useProfile } from "@/features/user/hooks/use-profile";
import { useTransactionSummary } from "@/features/transactions/hooks/use-transaction-summary";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { useInsights } from "@/features/insights/hooks/use-insights";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { useAuthStore } from "@/features/auth/auth.state";
import ImportCsvSheet from "@/features/transactions/components/import-csv-sheet";
import HomeHeader from "./components/home-header";
import SpendingOverviewCard from "./components/spending-overview-card";
import AccountsSummaryCard from "./components/accounts-summary-card";
import CategoryBreakdownCard from "./components/category-breakdown-card";
import IrisInsightCard from "./components/iris-insight-card";
import RecentTransactionsCard from "./components/recent-transactions-card";
import ConnectSourceBanner from "./components/connect-source-banner";

export default function HomeScreen() {
  const colors = useThemeColors();
  const dataSourceSkipped = useAuthStore((s) => s.dataSourceSkipped);
  const setDataSourceSkipped = useAuthStore((s) => s.setDataSourceSkipped);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [importSheetVisible, setImportSheetVisible] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { profile } = useProfile();
  const { summary, isLoading: summaryLoading, refetch: refetchSummary } = useTransactionSummary(year, month);
  const { transactions, isLoading: txLoading, refetch: refetchTx } = useTransactions({ limit: 8 });
  const { insights, isLoading: insightsLoading, refetch: refetchInsights } = useInsights();
  const { accounts, isLoading: accountsLoading, refetch: refetchAccounts } = useAccounts();

  const latestInsight = insights.find((i) => !i.isRead) ?? insights[0];

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchSummary(), refetchTx(), refetchInsights(), refetchAccounts()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchSummary, refetchTx, refetchInsights, refetchAccounts]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <HomeHeader firstName={profile?.firstName} />

      <ScrollView
        style={{ flex: 1 }}
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
        <View style={styles.content}>
          {dataSourceSkipped && !bannerDismissed && (
            <ConnectSourceBanner
              onDismiss={() => setBannerDismissed(true)}
              onImportPress={() => setImportSheetVisible(true)}
            />
          )}
          <SpendingOverviewCard summary={summary} isLoading={summaryLoading} />
          <CategoryBreakdownCard summary={summary} isLoading={summaryLoading} />
          <IrisInsightCard
            insight={latestInsight}
            isLoading={insightsLoading}
          />
          <AccountsSummaryCard accounts={accounts} isLoading={accountsLoading} />
          <RecentTransactionsCard
            transactions={transactions}
            isLoading={txLoading}
          />
        </View>
      </ScrollView>

      <ImportCsvSheet
        visible={importSheetVisible}
        onClose={() => setImportSheetVisible(false)}
        onAccepted={() => setDataSourceSkipped(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 100, paddingTop: SPACING.sm },
  content: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.base,
  },
});
