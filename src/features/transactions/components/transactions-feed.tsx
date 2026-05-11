import React from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import { Transaction } from "../transactions.interface";
import { isToday, isYesterday } from "@/core/common/utils/date";
import EmptyState from "@/core/common/components/EmptyState";
import TransactionsDateGroup from "./transactions-date-group";
import TransactionsSkeleton from "./transactions-skeleton";

interface DateGroup {
  label: "Today" | "Yesterday" | "Earlier";
  data: Transaction[];
}

function bucketLabel(date: Date): "Today" | "Yesterday" | "Earlier" {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return "Earlier";
}

const BUCKET_ORDER: DateGroup["label"][] = ["Today", "Yesterday", "Earlier"];

function groupByDate(transactions: Transaction[]): DateGroup[] {
  const map = new Map<DateGroup["label"], Transaction[]>([
    ["Today", []],
    ["Yesterday", []],
    ["Earlier", []],
  ]);

  for (const tx of transactions) {
    const label = bucketLabel(tx.transactionDate);
    map.get(label)!.push(tx);
  }

  return BUCKET_ORDER.map((label) => ({ label, data: map.get(label)! })).filter(
    (g) => g.data.length > 0,
  );
}

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasNextPage: boolean;
  onEndReached: () => void;
  onPressTx: (tx: Transaction) => void;
}

export default function TransactionsFeed({
  transactions,
  isLoading,
  isFetchingMore,
  hasNextPage,
  onEndReached,
  onPressTx,
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
      keyExtractor={(item) => item.label}
      renderItem={renderItem}
      contentContainerStyle={
        groups.length === 0 ? styles.centered : styles.list
      }
      onEndReached={hasNextPage ? onEndReached : undefined}
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
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

