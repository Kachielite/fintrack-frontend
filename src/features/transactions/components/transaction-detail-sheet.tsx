import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  CATEGORY_COLORS,
} from "@/core/common/constants/theme";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { Transaction, CategoryType } from "../transactions.interface";
import { TransactionService } from "../transactions.service";
import { CATEGORY_LABELS, CATEGORY_ICON_NAMES, ALL_CATEGORIES } from "../transactions.constants";
import { formatTransactionAmount } from "@/core/common/utils/currency";
import { formatDate, formatTime } from "@/core/common/utils/date";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface Props {
  visible: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export default function TransactionDetailSheet({
  visible,
  onClose,
  transaction,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const isReview = transaction.status === "unverified";
  const [pickedCat, setPickedCat] = useState<CategoryType>(
    transaction.category,
  );
  const [reviewDone, setReviewDone] = useState(false);

  const showReviewBanner = isReview && !reviewDone;

  const mutation = useMutation({
    mutationFn: (category: CategoryType) =>
      TransactionService.correctTransaction(transaction.id, { category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      setReviewDone(true);
    },
  });

  const isCredit = transaction.transactionType === "credit";
  const showRef = transaction.currency !== transaction.refCurrency;

  const catColor = CATEGORY_COLORS[pickedCat] ?? colors.textSubtle;
  const iconName =
    (CATEGORY_ICON_NAMES[pickedCat] as React.ComponentProps<
      typeof Ionicons
    >["name"]) ?? "ellipsis-horizontal-outline";

  const detailRows: [string, string][] = [
    [
      "Category",
      CATEGORY_LABELS[transaction.category] ?? transaction.category,
    ],
    ["Currency", transaction.currency],
    ["Date", formatDate(transaction.transactionDate)],
    ["Time", formatTime(transaction.transactionDate)],
  ];

  if (transaction.reference) {
    detailRows.push(["Reference", transaction.reference]);
  }

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
          <View
            style={[styles.handle, { backgroundColor: colors.borderStrong }]}
          />

          {/* Header row */}
          <View style={styles.header}>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.textPrimary, fontFamily: FONTS.bold },
              ]}
            >
              Transaction
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons
                name="close"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={[
              styles.body,
              { paddingBottom: SPACING.lg },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Icon + amount hero */}
            <View style={styles.headerCenter}>
              <View
                style={[styles.iconWrap, { backgroundColor: catColor + "22" }]}
              >
                <Ionicons name={iconName} size={28} color={catColor} />
              </View>

              <Text
                style={[
                  styles.amount,
                  {
                    color: isCredit ? colors.success : colors.textPrimary,
                    fontFamily: FONTS.mono,
                  },
                ]}
              >
                {formatTransactionAmount(
                  transaction.amount,
                  transaction.currency,
                )}
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

              <Text
                style={[
                  styles.merchant,
                  {
                    color: colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
              >
                {transaction.merchant}
              </Text>

              <Text
                style={[
                  styles.dateLine,
                  { color: colors.textSubtle, fontFamily: FONTS.regular },
                ]}
              >
                {formatDate(transaction.transactionDate)} ·{" "}
                {formatTime(transaction.transactionDate)}
              </Text>
            </View>

            {/* Review banner */}
            {showReviewBanner && (
              <View
                style={[
                  styles.reviewCard,
                  {
                    backgroundColor: colors.warningLight,
                    borderColor: colors.warning + "55",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.reviewLabel,
                    { color: colors.warning, fontFamily: FONTS.bold },
                  ]}
                >
                  NEEDS A QUICK LOOK
                </Text>
                <Text
                  style={[
                    styles.reviewBody,
                    {
                      color: colors.textPrimary,
                      fontFamily: FONTS.regular,
                    },
                  ]}
                >
                  We weren&apos;t sure how to categorise this one. Pick the
                  closest fit:
                </Text>

                <View style={styles.categoryGrid}>
                  {ALL_CATEGORIES.map((cat) => {
                    const active = pickedCat === cat;
                    const catColor = CATEGORY_COLORS[cat] ?? colors.textSubtle;
                    const catIcon = (CATEGORY_ICON_NAMES[cat] as React.ComponentProps<typeof Ionicons>["name"]) ?? "ellipsis-horizontal-outline";
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setPickedCat(cat)}
                        style={[
                          styles.categoryTile,
                          {
                            backgroundColor: active ? catColor + "18" : colors.surface,
                            borderColor: active ? catColor : colors.border,
                          },
                        ]}
                      >
                        <Ionicons name={catIcon} size={18} color={active ? catColor : colors.textSubtle} />
                        <Text
                          style={[
                            styles.categoryTileLabel,
                            {
                              color: active ? catColor : colors.textSecondary,
                              fontFamily: active ? FONTS.semiBold : FONTS.regular,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {CATEGORY_LABELS[cat]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  onPress={() => mutation.mutate(pickedCat)}
                  disabled={mutation.isPending}
                  style={[
                    styles.confirmBtn,
                    {
                      backgroundColor: colors.warning,
                      opacity: mutation.isPending ? 0.7 : 1,
                    },
                  ]}
                >
                  {mutation.isPending ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <Text
                      style={[
                        styles.confirmText,
                        {
                          color: colors.surface,
                          fontFamily: FONTS.semiBold,
                        },
                      ]}
                    >
                      Confirm category
                    </Text>
                  )}
                </Pressable>
              </View>
            )}

            {/* Detail rows */}
            <View
              style={[
                styles.detailCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {detailRows.map(([label, value], i) => (
                <View
                  key={label}
                  style={[
                    styles.detailRow,
                    i < detailRows.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.detailLabel,
                      {
                        color: colors.textSubtle,
                        fontFamily: FONTS.semiBold,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color: colors.textPrimary,
                        fontFamily: FONTS.semiBold,
                      },
                    ]}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Close CTA */}
            <Pressable
              onPress={onClose}
              style={[
                styles.cta,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.ctaText,
                  {
                    color: colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
              >
                Close
              </Text>
            </Pressable>
          </ScrollView>
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
    maxHeight: SCREEN_HEIGHT * 0.88,
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
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerTitle: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  headerCenter: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
    gap: 6,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  amount: { fontSize: 36, letterSpacing: -1 },
  refAmount: { fontSize: 13 },
  merchant: { fontSize: 16, letterSpacing: -0.3, marginTop: 4 },
  dateLine: { fontSize: 13, marginTop: 2 },
  reviewCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  reviewLabel: { fontSize: 11, letterSpacing: 0.6 },
  reviewBody: { fontSize: 14, lineHeight: 20 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryTile: {
    width: "22%",
    flex: 1,
    alignItems: "center",
    gap: 5,
    paddingVertical: SPACING.sm,
    paddingHorizontal: 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    minWidth: 64,
  },
  categoryTileLabel: { fontSize: 10, textAlign: "center" },
  confirmBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm + 2,
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  confirmText: { fontSize: 14 },
  detailCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
  },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14 },
  cta: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
    borderWidth: 1,
  },
  ctaText: { fontSize: FONT_SIZE.body, letterSpacing: -0.2 },
});

