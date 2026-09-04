import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { useTransactionsInfinite } from "./hooks/use-transactions-infinite";
import { Transaction } from "./transactions.interface";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { resolveDateRange, DEFAULT_DATE_FILTER } from "./utils/date-filter";
import TransactionsHeader, {
  TransactionsViewMode,
} from "./components/transactions-header";
import TransactionsSearchBar from "./components/transactions-search-bar";
import TransactionsFeed from "./components/transactions-feed";
import CalendarView from "./components/calendar-view";
import TransactionsFilterSheet, {
  TransactionFilters,
  BankOption,
  AccountOption,
} from "./components/transactions-filter-sheet";
import TransactionDetailSheet from "./components/transaction-detail-sheet";

const EMPTY_FILTERS: TransactionFilters = {
  categories: [],
  currencies: [],
  bankIds: [],
  accountIds: [],
  dateFilter: DEFAULT_DATE_FILTER,
};

export default function TransactionsScreen() {
  const colors = useThemeColors();

  // ── State ────────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<TransactionsViewMode>("list");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ── Data ─────────────────────────────────────────────────────────────────
  const { accounts } = useAccounts();

  const dateRange = useMemo(
    () => resolveDateRange(filters.dateFilter),
    [filters.dateFilter],
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useTransactionsInfinite({
    search,
    date_from: dateRange.from?.toISOString(),
    date_to: dateRange.to?.toISOString(),
    // Forwarded server-side (fintrack-backend#138) instead of filtered
    // client-side over whatever's already loaded - filtering against a
    // partially-fetched infinite-scroll cache silently missed matches
    // outside the loaded pages (fintrack-frontend#65). `queryKey` already
    // includes these params, so changing a filter naturally refetches.
    category: filters.categories.length ? filters.categories.join(",") : undefined,
    currency: filters.currencies.length ? filters.currencies.join(",") : undefined,
    bank_id: filters.bankIds.length ? filters.bankIds.join(",") : undefined,
    account_id: filters.accountIds.length ? filters.accountIds.join(",") : undefined,
  });

  const allTransactions: Transaction[] =
    data?.pages.flatMap((p) => p.data) ?? [];

  // The server has already applied every active filter above - this is now
  // just a harmless no-op safety net, not the primary filtering mechanism.
  const filteredTransactions = allTransactions.filter((tx) => {
    const categoryOk =
      filters.categories.length === 0 ||
      filters.categories.includes(tx.category);
    const currencyOk =
      filters.currencies.length === 0 ||
      filters.currencies.includes(tx.currency);
    const bankOk =
      filters.bankIds.length === 0 ||
      (tx.bankId !== null &&
        tx.bankId !== undefined &&
        filters.bankIds.includes(tx.bankId));
    const accountOk =
      filters.accountIds.length === 0 ||
      (tx.accountId !== null &&
        tx.accountId !== undefined &&
        filters.accountIds.includes(tx.accountId));
    return categoryOk && currencyOk && bankOk && accountOk;
  });

  // Sourced from the unfiltered `accounts` list (like availableAccounts
  // below), not from allTransactions - once filtering happens server-side,
  // allTransactions only reflects the currently-filtered subset, which would
  // otherwise make these dropdowns shrink to match whatever's already
  // selected instead of showing every option the user could pick.
  const availableCurrencies = useMemo(
    () => [...new Set(accounts.map((a) => a.currency))],
    [accounts],
  );

  const availableBanks = useMemo<BankOption[]>(() => {
    const bankMap = new Map<number, string>();
    accounts.forEach((a) => {
      if (a.bankId && a.bankName) bankMap.set(a.bankId, a.bankName);
    });
    return Array.from(bankMap.entries()).map(([id, name]) => ({ id, name }));
  }, [accounts]);

  const availableAccounts = useMemo<AccountOption[]>(
    () =>
      accounts.map((a) => ({
        id: a.id,
        label: a.label,
        accountNumberMask: a.accountNumberMask,
        currency: a.currency,
      })),
    [accounts],
  );

  const isDateFiltered = !(
    filters.dateFilter.kind === "preset" && filters.dateFilter.preset === "all"
  );
  const filterCount =
    filters.categories.length +
    filters.currencies.length +
    filters.bankIds.length +
    filters.accountIds.length +
    (isDateFiltered ? 1 : 0);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleApplyFilters = useCallback((f: TransactionFilters) => {
    setFilters(f);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
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
      <TransactionsHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "calendar" ? (
        <CalendarView />
      ) : (
        <>
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
            accounts={availableAccounts}
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
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
