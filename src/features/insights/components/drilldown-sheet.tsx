import React, { useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { TransactionService } from "@/features/transactions/transactions.service";
import { TransactionQueryParams } from "@/features/transactions/transactions.dto";
import { Transaction } from "@/features/transactions/transactions.interface";
import TransactionRow from "@/core/common/components/TransactionRow";
import { formatTransactionAmount } from "@/core/common/utils/currency";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface DrilldownSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  iconColor: string;
  params: TransactionQueryParams;
  refCurrency: string;
  onTransactionPress: (tx: Transaction) => void;
}

export default function DrilldownSheet({
  visible,
  onClose,
  title,
  icon,
  iconColor,
  params,
  refCurrency,
  onTransactionPress,
}: DrilldownSheetProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ["insights-drilldown", params],
    queryFn: () => TransactionService.listTransactions({ ...params, limit: 100 }),
    enabled: visible,
  });

  const transactions = data?.data ?? [];
  const spendTransactions = transactions.filter((t) => t.transactionType === "debit");
  const totalSpend = spendTransactions.reduce((s, t) => s + t.refAmount, 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + SPACING.lg,
            },
          ]}
        >
          {/* Drag handle */}
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconWrap, { backgroundColor: iconColor + "22" }]}>
              <Ionicons name={icon as any} size={18} color={iconColor} />
            </View>
            <Text
              style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Summary */}
          {!isLoading && spendTransactions.length > 0 && (
            <View style={[styles.summary, { borderBottomColor: colors.border }]}>
              <Text style={[styles.summaryCount, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                {spendTransactions.length} transaction{spendTransactions.length !== 1 ? "s" : ""}
              </Text>
              <Text style={[styles.summaryTotal, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                {formatTransactionAmount(totalSpend, refCurrency)}
              </Text>
            </View>
          )}

          {/* Transaction list */}
          {isLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.loader}>
              <Text style={[styles.emptyText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                No transactions found
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ flexShrink: 1 }}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {transactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  onPress={() => onTransactionPress(tx)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 99,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.body,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.xs,
  },
  summaryCount: { fontSize: 13 },
  summaryTotal: { fontSize: 15, letterSpacing: -0.3 },
  loader: { height: 120, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 14 },
  listContent: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.base },
});
