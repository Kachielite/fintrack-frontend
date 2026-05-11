import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  CATEGORY_COLORS,
} from "@/core/common/constants/theme";
import {
  Transaction,
  CategoryType,
} from "@/features/transactions/transactions.interface";
import { formatTransactionAmount } from "@/core/common/utils/currency";
import { formatDate } from "@/core/common/utils/date";

const CATEGORY_ICONS: Record<
  CategoryType,
  React.ComponentProps<typeof Ionicons>["name"]
> = {
  food: "restaurant-outline",
  transit: "car-outline",
  utility: "flash-outline",
  subs: "tv-outline",
  transfer: "swap-horizontal-outline",
  fun: "game-controller-outline",
  health: "heart-outline",
  other: "ellipsis-horizontal-outline",
};

interface TransactionRowProps {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionRow({
  transaction,
  onPress,
}: TransactionRowProps) {
  const colors = useThemeColors();
  const iconName =
    CATEGORY_ICONS[transaction.category] ?? "ellipsis-horizontal-outline";
  const categoryColor =
    CATEGORY_COLORS[transaction.category] ?? colors.textSubtle;
  const isCredit = transaction.transactionType === "credit";
  const showRef = transaction.currency !== transaction.refCurrency;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View
        style={[styles.iconWrap, { backgroundColor: categoryColor + "22" }]}
      >
        <Ionicons name={iconName} size={18} color={categoryColor} />
      </View>

      <View style={styles.middle}>
        <Text
          style={[
            styles.merchant,
            { color: colors.textPrimary, fontFamily: FONTS.semiBold },
          ]}
          numberOfLines={1}
        >
          {transaction.merchant}
        </Text>
        <View style={styles.metaRow}>
          <Text
            style={[
              styles.meta,
              { color: colors.textSubtle, fontFamily: FONTS.regular },
            ]}
          >
            {formatDate(transaction.transactionDate)}
          </Text>
          {transaction.status === "unverified" && (
            <View
              style={[
                styles.reviewBadge,
                { backgroundColor: colors.warningLight },
              ]}
            >
              <Text
                style={[
                  styles.reviewText,
                  { color: colors.warning, fontFamily: FONTS.semiBold },
                ]}
              >
                review
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.amountWrap}>
        <Text
          style={[
            styles.amount,
            {
              color: isCredit ? colors.success : colors.textPrimary,
              fontFamily: FONTS.mono,
            },
          ]}
        >
          {formatTransactionAmount(transaction.amount, transaction.currency)}
        </Text>
        {showRef && (
          <Text
            style={[
              styles.refAmount,
              { color: colors.textSubtle, fontFamily: FONTS.mono },
            ]}
          >
            ≈{" "}
            {formatTransactionAmount(
              transaction.refAmount,
              transaction.refCurrency,
            )}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
  },
  pressed: { opacity: 0.65 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  middle: { flex: 1, minWidth: 0 },
  merchant: { fontSize: FONT_SIZE.bodySmall, letterSpacing: -0.2 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: 2,
  },
  meta: { fontSize: 11 },
  reviewBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  reviewText: { fontSize: 9 },
  amountWrap: { alignItems: "flex-end", flexShrink: 0 },
  amount: { fontSize: FONT_SIZE.bodySmall, letterSpacing: -0.2 },
  refAmount: { fontSize: 10, marginTop: 2 },
});
