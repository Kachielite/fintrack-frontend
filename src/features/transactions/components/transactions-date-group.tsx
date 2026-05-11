import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";
import { Transaction } from "../transactions.interface";
import GlassCard from "@/core/common/components/GlassCard";
import SectionHeader from "@/core/common/components/SectionHeader";
import TransactionRow from "@/core/common/components/TransactionRow";

interface Props {
  label: string;
  transactions: Transaction[];
  onPress: (tx: Transaction) => void;
}

export default function TransactionsDateGroup({
  label,
  transactions,
  onPress,
}: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <SectionHeader title={label} />
      <GlassCard>
        <View style={styles.list}>
          {transactions.map((tx, i) => (
            <View
              key={tx.id}
              style={
                i < transactions.length - 1
                  ? [
                      styles.separator,
                      { borderBottomColor: colors.border },
                    ]
                  : undefined
              }
            >
              <TransactionRow
                transaction={tx}
                onPress={() => onPress(tx)}
              />
            </View>
          ))}
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  list: {
    paddingHorizontal: SPACING.base,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

