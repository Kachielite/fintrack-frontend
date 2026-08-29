import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useTransactionsInfinite } from "../hooks/use-transactions-infinite";
import { Transaction } from "../transactions.interface";
import TransactionsFeed from "../components/transactions-feed";
import TransactionDetailSheet from "../components/transaction-detail-sheet";

export default function ReviewTransfersScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useTransactionsInfinite({ exclude_from_totals: true });

  const transfers: Transaction[] = data?.pages.flatMap((p) => p.data) ?? [];

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

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontFamily: FONTS.bold },
          ]}
        >
          Review Transfers
        </Text>
      </View>

      <View
        style={[
          styles.explainer,
          { backgroundColor: colors.surface2, borderColor: colors.border },
        ]}
      >
        <Ionicons name="swap-horizontal" size={16} color={colors.textSecondary} />
        <Text
          style={[
            styles.explainerText,
            { color: colors.textSecondary, fontFamily: FONTS.regular },
          ]}
        >
          Money moving between your own accounts is never counted as spend
          or income. Tap any of these to confirm it, or undo it if
          that&apos;s wrong.
        </Text>
      </View>

      <TransactionsFeed
        transactions={transfers}
        isLoading={isLoading}
        isFetchingMore={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        onEndReached={handleEndReached}
        onPressTx={setSelected}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        emptyIcon="swap-horizontal-outline"
        emptyMessage="Nothing to review"
        emptySubMessage="We haven't excluded any transactions from your totals yet."
      />

      {selected && (
        <TransactionDetailSheet
          visible={!!selected}
          onClose={() => setSelected(null)}
          transaction={selected}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    gap: SPACING.xs,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  title: { fontSize: FONT_SIZE.h1, letterSpacing: -0.6 },
  explainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  explainerText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
