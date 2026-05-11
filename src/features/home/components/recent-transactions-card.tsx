import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import { RootStackParamList } from "@/core/navigation/root-navigator";
import { PaginatedResponse } from "@/core/common/interface/pagination.interface";
import { Transaction } from "@/features/transactions/transactions.interface";
import SectionHeader from "@/core/common/components/SectionHeader";
import TransactionRow from "@/core/common/components/TransactionRow";
import GlassCard from "@/core/common/components/GlassCard";
import SkeletonBox from "@/core/common/components/SkeletonBox";
import EmptyState from "@/core/common/components/EmptyState";

interface RecentTransactionsCardProps {
  transactions: PaginatedResponse<Transaction> | undefined;
  isLoading: boolean;
}

export default function RecentTransactionsCard({
  transactions,
  isLoading,
}: RecentTransactionsCardProps) {
  const colors = useThemeColors();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = transactions?.data.slice(0, 4) ?? [];

  return (
    <View>
      <SectionHeader title="Recent" />
      <GlassCard>
        {isLoading ? (
          <View style={{ gap: SPACING.sm, padding: SPACING.base }}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonRow}>
                <SkeletonBox width={40} height={40} radius={12} />
                <View style={{ flex: 1, gap: 6 }}>
                  <SkeletonBox width="70%" height={13} radius={6} />
                  <SkeletonBox width="45%" height={10} radius={5} />
                </View>
                <SkeletonBox width={70} height={13} radius={6} />
              </View>
            ))}
          </View>
        ) : items.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            message="No transactions yet"
            subMessage="Connect your Gmail and sync bank emails to see your transactions here."
          />
        ) : (
          <View style={{ paddingHorizontal: SPACING.base }}>
            {items.map((tx, i) => (
              <View
                key={tx.id}
                style={
                  i < items.length - 1
                    ? [
                        styles.separator,
                        { borderBottomColor: colors.border },
                      ]
                    : undefined
                }
              >
                <TransactionRow
                  transaction={tx}
                  onPress={() =>
                    navigation.navigate("TransactionDetail", {
                      transactionId: tx.id,
                    })
                  }
                />
              </View>
            ))}
          </View>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: 6,
  },
  separator: { borderBottomWidth: 1 },
});
