import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { useTransactionsInfinite } from "./hooks/use-transactions-infinite";
import { Transaction, CategoryType } from "./transactions.interface";
import TransactionsHeader from "./components/transactions-header";
import TransactionsSearchBar from "./components/transactions-search-bar";
import TransactionsFeed from "./components/transactions-feed";
import TransactionsFilterSheet, {
  TransactionFilters,
} from "./components/transactions-filter-sheet";
import TransactionDetailSheet from "./components/transaction-detail-sheet";

export default function TransactionsScreen() {
  const colors = useThemeColors();

  // ── State ────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>({
    categories: [],
    currencies: [],
  });
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // ── Data ─────────────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useTransactionsInfinite({ search });

  /** All loaded transaction items flattened across pages */
  const allTransactions: Transaction[] =
    data?.pages.flatMap((p) => p.data) ?? [];

  /** Client-side filter by category and/or currency */
  const filteredTransactions = allTransactions.filter((tx) => {
    const categoryOk =
      filters.categories.length === 0 ||
      filters.categories.includes(tx.category as CategoryType);
    const currencyOk =
      filters.currencies.length === 0 ||
      filters.currencies.includes(tx.currency);
    return categoryOk && currencyOk;
  });

  /** Unique currency codes available in the currently loaded data */
  const availableCurrencies = [
    ...new Set(allTransactions.map((t) => t.currency)),
  ];

  const filterCount = filters.categories.length + filters.currencies.length;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleApplyFilters = useCallback((f: TransactionFilters) => {
    setFilters(f);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ categories: [], currencies: [] });
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
      />

      {/* Filter sheet */}
      <TransactionsFilterSheet
        visible={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        currencies={availableCurrencies}
        resultCount={filteredTransactions.length}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Transaction detail sheet */}
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

