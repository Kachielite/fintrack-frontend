import React from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  ListRenderItem,
  RefreshControl,
} from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import { Transaction } from "../transactions.interface";
import { dateGroupLabel } from "@/core/common/utils/date";
import EmptyState from "@/core/common/components/EmptyState";
import TransactionsDateGroup from "./transactions-date-group";
import TransactionsSkeleton from "./transactions-skeleton";

interface DateGroup {
  dateKey: string; // YYYY-MM-DD — used as stable key and sort key
  label: string;
  data: Transaction[];
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function groupByDate(transactions: Transaction[]): DateGroup[] {
  const map = new Map<string, Transaction[]>();

  for (const tx of transactions) {
    const key = toDateKey(new Date(tx.transactionDate));
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // newest day first
    .map(([dateKey, txs]) => ({
      dateKey,
      label: dateGroupLabel(txs[0].transactionDate),
      data: txs.sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime(),
      ),
    }));
}

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasNextPage: boolean;
  onEndReached: () => void;
  onPressTx: (tx: Transaction) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function TransactionsFeed({
  transactions,
  isLoading,
  isFetchingMore,
  hasNextPage,
  onEndReached,
  onPressTx,
  refreshing,
  onRefresh,
}: Props) {
  const colors = useThemeColors();

  if (isLoading) {
    return <TransactionsSkeleton />;
  }

  const groups = groupByDate(transactions);

  const renderItem: ListRenderItem<DateGroup> = ({ item }) => (
    <TransactionsDateGroup
      label={item.label}
      transactions={item.data}
      onPress={onPressTx}
    />
  );

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.dateKey}
      renderItem={renderItem}
      contentContainerStyle={
        groups.length === 0 ? styles.centered : styles.list
      }
      onEndReached={hasNextPage ? onEndReached : undefined}
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={
        <EmptyState
          icon="search-outline"
          message="Nothing matches that"
          subMessage="Try a different search or clear a filter to see more."
        />
      }
      ListFooterComponent={
        isFetchingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 110,
  },
  centered: {
    flex: 1,
  },
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: "center",
  },
});

