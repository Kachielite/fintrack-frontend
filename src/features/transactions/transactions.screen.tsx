import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { useTransactionsInfinite } from "./hooks/use-transactions-infinite";
import { Transaction } from "./transactions.interface";
import TransactionsHeader from "./components/transactions-header";
import TransactionsSearchBar from "./components/transactions-search-bar";
import TransactionsFeed from "./components/transactions-feed";
import TransactionsFilterSheet, {
  TransactionFilters,
  BankOption,
} from "./components/transactions-filter-sheet";
import TransactionDetailSheet from "./components/transaction-detail-sheet";

export default function TransactionsScreen() {
  const colors = useThemeColors();

  // ── State ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>({
    categories: [],
    currencies: [],
    bankIds: [],
  });
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ── Data ─────────────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useTransactionsInfinite({ search });

  const allTransactions: Transaction[] =
    data?.pages.flatMap((p) => p.data) ?? [];

  const filteredTransactions = allTransactions.filter((tx) => {
    const categoryOk =
      filters.categories.length === 0 || filters.categories.includes(tx.category);
    const currencyOk =
      filters.currencies.length === 0 || filters.currencies.includes(tx.currency);
    const bankOk =
      filters.bankIds.length === 0 ||
      (tx.bankId !== null && tx.bankId !== undefined && filters.bankIds.includes(tx.bankId));
    return categoryOk && currencyOk && bankOk;
  });

  const availableCurrencies = useMemo(
    () => [...new Set(allTransactions.map((t) => t.currency))],
    [allTransactions],
  );

  const availableBanks = useMemo<BankOption[]>(() => {
    const bankMap = new Map<number, string>();
    allTransactions.forEach((t) => {
      if (t.bankId && t.bankName) bankMap.set(t.bankId, t.bankName);
    });
    return Array.from(bankMap.entries()).map(([id, name]) => ({ id, name }));
  }, [allTransactions]);

  const filterCount =
    filters.categories.length + filters.currencies.length + filters.bankIds.length;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleApplyFilters = useCallback((f: TransactionFilters) => {
    setFilters(f);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ categories: [], currencies: [], bankIds: [] });
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <TransactionsHeader />

      <TransactionsSearchBar
        value={search}
        onChangeText={setSearch}
        filterCount={filterCount}
        onFilterPress={() => setFilterSheetOpen(true)}
      />

      <TransactionsFeed
        transactions={filteredTransactions}
        isLoading={isLoading}
        isFetchingMore={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        onEndReached={handleEndReached}
        onPressTx={setSelectedTx}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <TransactionsFilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        currencies={availableCurrencies}
        banks={availableBanks}
        resultCount={filteredTransactions.length}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {selectedTx && (
        <TransactionDetailSheet
          visible={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          transaction={selectedTx}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
