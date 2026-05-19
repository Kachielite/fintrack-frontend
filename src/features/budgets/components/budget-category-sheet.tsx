import React, { useState } from "react";
import DraggableSheet from "@/core/common/components/DraggableSheet";
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
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  CATEGORY_COLORS,
} from "@/core/common/constants/theme";
import {
  CATEGORY_LABELS,
  CATEGORY_ICON_NAMES,
} from "@/features/transactions/transactions.constants";
import { formatCurrency } from "@/core/common/utils/currency";
import { Budget } from "../budgets.interface";
import { useBudgetDetail } from "../hooks/use-budget-detail";
import BudgetProgressBar from "./budget-progress-bar";
import EditBudgetSheet from "./edit-budget-sheet";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const STATUS_LABELS: Record<Budget["status"], string> = {
  healthy: "On track",
  warning: "Heads up",
  over: "Over budget",
};

interface Props {
  visible: boolean;
  onClose: () => void;
  budget: Budget;
}

export default function BudgetCategorySheet({
  visible,
  onClose,
  budget,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [editVisible, setEditVisible] = useState(false);
  const { budget: detail, isLoading } = useBudgetDetail(budget.id);

  const catColor = CATEGORY_COLORS[budget.category] ?? colors.textSubtle;
  const iconName = (CATEGORY_ICON_NAMES[budget.category] ??
    "ellipsis-horizontal-outline") as React.ComponentProps<
    typeof Ionicons
  >["name"];

  const statusColor =
    budget.status === "over"
      ? colors.error
      : budget.status === "warning"
        ? colors.warning
        : colors.success;

  const remaining = budget.remaining;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <DraggableSheet
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + SPACING.lg,
            },
          ]}
          onClose={onClose}
          handleColor={colors.borderStrong}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.headerIcon,
                  { backgroundColor: catColor + "22" },
                ]}
              >
                <Ionicons name={iconName} size={18} color={catColor} />
              </View>
              <Text
                style={[
                  styles.headerTitle,
                  { color: colors.textPrimary, fontFamily: FONTS.bold },
                ]}
              >
                {CATEGORY_LABELS[budget.category]}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => setEditVisible(true)}
                hitSlop={12}
                style={[styles.editBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={onClose}
                hitSlop={12}
                style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.body}
              showsVerticalScrollIndicator={false}
            >
              {/* ── Hero summary card ── */}
              <View
                style={[
                  styles.heroCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Status + count */}
                <View style={styles.heroTop}>
                  <Text
                    style={[
                      styles.statusLabel,
                      { color: statusColor, fontFamily: FONTS.bold },
                    ]}
                  >
                    {STATUS_LABELS[budget.status].toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.txCount,
                      { color: colors.textSubtle, fontFamily: FONTS.regular },
                    ]}
                  >
                    {detail?.transactionCount ?? 0}{" "}
                    {(detail?.transactionCount ?? 0) === 1
                      ? "expense"
                      : "expenses"}{" "}
                    · {budget.daysRemaining}d left
                  </Text>
                </View>

                {/* Spent amount */}
                <Text
                  style={[
                    styles.heroAmount,
                    {
                      color:
                        budget.status === "over"
                          ? statusColor
                          : colors.textPrimary,
                      fontFamily: FONTS.bold,
                    },
                  ]}
                >
                  {formatCurrency(budget.spent, budget.currency)}
                </Text>
                <Text
                  style={[
                    styles.heroSub,
                    { color: colors.textSubtle, fontFamily: FONTS.regular },
                  ]}
                >
                  spent of{" "}
                  <Text style={{ fontFamily: FONTS.mono, color: colors.textPrimary }}>
                    {formatCurrency(budget.limitAmount, budget.currency)}
                  </Text>{" "}
                  budget
                </Text>

                {/* Progress bar */}
                <View style={styles.progressWrap}>
                  <BudgetProgressBar
                    percentage={budget.percentage}
                    status={budget.status}
                    height={8}
                  />
                </View>

                {/* % used / remaining row */}
                <View style={styles.statsRow}>
                  <Text
                    style={[
                      styles.statText,
                      { color: colors.textSubtle, fontFamily: FONTS.regular },
                    ]}
                  >
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontFamily: FONTS.semiBold,
                      }}
                    >
                      {Math.round(budget.percentage)}%
                    </Text>{" "}
                    used
                  </Text>
                  <Text
                    style={[
                      styles.statText,
                      { color: colors.textSubtle, fontFamily: FONTS.regular },
                    ]}
                  >
                    {remaining >= 0 ? (
                      <>
                        <Text
                          style={{
                            color: colors.textPrimary,
                            fontFamily: FONTS.mono,
                          }}
                        >
                          {formatCurrency(remaining, budget.currency)}
                        </Text>{" "}
                        left
                      </>
                    ) : (
                      <Text style={{ color: statusColor, fontFamily: FONTS.semiBold }}>
                        {formatCurrency(Math.abs(remaining), budget.currency)}{" "}
                        over
                      </Text>
                    )}
                  </Text>
                </View>
              </View>

              {/* ── Merchant breakdown ── */}
              {detail && detail.merchantBreakdown.length > 0 && (
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color: colors.textSecondary,
                        fontFamily: FONTS.bold,
                      },
                    ]}
                  >
                    WHERE IT&apos;S GOING
                  </Text>
                  <View
                    style={[
                      styles.merchantCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    {detail.merchantBreakdown
                      .slice(0, 3)
                      .map((m, i, arr) => (
                        <View
                          key={m.merchant}
                          style={[
                            styles.merchantRow,
                            i < arr.length - 1 && {
                              borderBottomWidth: StyleSheet.hairlineWidth,
                              borderBottomColor: colors.border,
                            },
                          ]}
                        >
                          <View style={styles.merchantInfo}>
                            <Text
                              style={[
                                styles.merchantName,
                                {
                                  color: colors.textPrimary,
                                  fontFamily: FONTS.semiBold,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {m.merchant}
                            </Text>
                            {/* Mini progress bar */}
                            <View
                              style={[
                                styles.miniTrack,
                                { backgroundColor: colors.surface2 },
                              ]}
                            >
                              <View
                                style={[
                                  styles.miniFill,
                                  {
                                    backgroundColor: catColor,
                                    width: `${Math.min(m.percentageOfBudget, 100)}%`,
                                  },
                                ]}
                              />
                            </View>
                          </View>
                          <View style={styles.merchantMeta}>
                            <Text
                              style={[
                                styles.merchantAmount,
                                {
                                  color: colors.textPrimary,
                                  fontFamily: FONTS.semiBold,
                                },
                              ]}
                            >
                              {formatCurrency(m.total, budget.currency)}
                            </Text>
                            <Text
                              style={[
                                styles.merchantShare,
                                {
                                  color: colors.textSubtle,
                                  fontFamily: FONTS.mono,
                                },
                              ]}
                            >
                              {Math.round(m.percentageOfBudget)}% ·{" "}
                              {m.transactionCount}×
                            </Text>
                          </View>
                        </View>
                      ))}
                  </View>
                </View>
              )}

              {/* ── Transaction list ── */}
              {detail && (
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color: colors.textSecondary,
                        fontFamily: FONTS.bold,
                      },
                    ]}
                  >
                    ALL EXPENSES ({detail.transactionCount})
                  </Text>

                  {detail.transactions.length === 0 ? (
                    <Text
                      style={[
                        styles.emptyText,
                        {
                          color: colors.textSubtle,
                          fontFamily: FONTS.regular,
                        },
                      ]}
                    >
                      No expenses in this category yet.
                    </Text>
                  ) : (
                    <View
                      style={[
                        styles.txCard,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      {detail.transactions.map((group) => (
                        <View key={group.dateGroup}>
                          {/* Date group label */}
                          <Text
                            style={[
                              styles.dateGroup,
                              {
                                color: colors.textSecondary,
                                fontFamily: FONTS.bold,
                              },
                            ]}
                          >
                            {group.dateGroup.toUpperCase()}
                          </Text>
                          {group.items.map((item, i, arr) => (
                            <View
                              key={item.id}
                              style={[
                                styles.txRow,
                                i < arr.length - 1 && {
                                  borderBottomWidth:
                                    StyleSheet.hairlineWidth,
                                  borderBottomColor: colors.border,
                                },
                              ]}
                            >
                              <View style={styles.txInfo}>
                                <Text
                                  style={[
                                    styles.txMerchant,
                                    {
                                      color: colors.textPrimary,
                                      fontFamily: FONTS.semiBold,
                                    },
                                  ]}
                                  numberOfLines={1}
                                >
                                  {item.merchant}
                                </Text>
                                <Text
                                  style={[
                                    styles.txMeta,
                                    {
                                      color: colors.textSubtle,
                                      fontFamily: FONTS.regular,
                                    },
                                  ]}
                                >
                                  {item.bank} · {item.time}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.txAmount,
                                  {
                                    color: colors.textPrimary,
                                    fontFamily: FONTS.mono,
                                  },
                                ]}
                              >
                                {formatCurrency(
                                  Math.abs(item.amount),
                                  item.currency,
                                )}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          )}
        </DraggableSheet>
      </View>

      <EditBudgetSheet
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        budget={budget}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.9,
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
    paddingVertical: SPACING.md,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.sm, flex: 1 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingWrap: {
    paddingVertical: SPACING.xxxl,
    alignItems: "center",
  },
  body: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.lg,
    gap: SPACING.base,
  },
  // Hero
  heroCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  heroTop: { gap: 2 },
  statusLabel: { fontSize: 11, letterSpacing: 0.6 },
  txCount: { fontSize: 12 },
  heroAmount: { fontSize: 30, letterSpacing: -1, lineHeight: 36 },
  heroSub: { fontSize: 13 },
  progressWrap: { marginVertical: SPACING.xs },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statText: { fontSize: 12 },
  // Section
  section: { gap: SPACING.sm },
  sectionLabel: { fontSize: 11, letterSpacing: 0.6, paddingHorizontal: 4 },
  // Merchant breakdown
  merchantCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  merchantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.base,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.base,
  },
  merchantInfo: { flex: 1, gap: 6 },
  merchantName: { fontSize: 14, letterSpacing: -0.2 },
  miniTrack: { height: 4, borderRadius: 99, overflow: "hidden" },
  miniFill: { height: "100%", borderRadius: 99 },
  merchantMeta: { alignItems: "flex-end", flexShrink: 0 },
  merchantAmount: { fontSize: 13, letterSpacing: -0.2 },
  merchantShare: { fontSize: 11, marginTop: 1 },
  // Transactions
  txCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: SPACING.base,
  },
  dateGroup: {
    fontSize: 11,
    letterSpacing: 0.6,
    paddingTop: SPACING.sm + 2,
    paddingBottom: SPACING.xs,
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  txInfo: { flex: 1 },
  txMerchant: { fontSize: 14, letterSpacing: -0.2 },
  txMeta: { fontSize: 11, marginTop: 2 },
  txAmount: { fontSize: 13, flexShrink: 0 },
  emptyText: { fontSize: 14, textAlign: "center", paddingVertical: SPACING.lg },
});

