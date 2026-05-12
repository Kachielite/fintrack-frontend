import React, { useState, useMemo, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { TransactionSummary } from "@/features/transactions/transactions.interface";
import { currencySymbol } from "@/core/common/utils/currency";
import { useTransactionsInfinite } from "@/features/transactions/hooks/use-transactions-infinite";
import TransactionRow from "@/core/common/components/TransactionRow";
import EmptyState from "@/core/common/components/EmptyState";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface Props {
  visible: boolean;
  onClose: () => void;
  summary: TransactionSummary;
}

export default function CurrencyBreakdownSheet({ visible, onClose, summary }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState(
    summary.byCurrency[0]?.currency ?? summary.refCurrency,
  );

  const row = summary.byCurrency.find((r) => r.currency === active);
  const spend = row?.spend ?? 0;
  const income = row?.income ?? 0;
  const net = row?.net ?? 0;
  const total = spend + income;
  const inPct = total > 0 ? (income / total) * 100 : 50;
  const sym = currencySymbol(active);
  const fmt = (n: number) =>
    sym + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useTransactionsInfinite({ currency: active });

  const transactions = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
      const nearBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 300;
      if (nearBottom && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

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
              backgroundColor: colors.background,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {/* Drag handle */}
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

          {/* Header row */}
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}
            >
              Currencies
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Currency tabs — fixed height so they never stretch */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContent}
          >
            {summary.byCurrency.map((r) => {
              const isSel = r.currency === active;
              return (
                <Pressable
                  key={r.currency}
                  onPress={() => setActive(r.currency)}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: isSel ? colors.textPrimary : colors.surface2,
                      borderColor: isSel ? colors.textPrimary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: isSel ? colors.background : colors.textSecondary, fontFamily: FONTS.bold },
                    ]}
                  >
                    {currencySymbol(r.currency)}
                  </Text>
                  <Text
                    style={[
                      styles.tabText,
                      { color: isSel ? colors.background : colors.textPrimary, fontFamily: FONTS.bold },
                    ]}
                  >
                    {r.currency}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Body */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={400}
          >
            {/* Flow card */}
            <View
              style={[styles.flowCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text
                style={[styles.flowQ, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}
              >
                How did my {active} flow this month?
              </Text>

              {/* Bar: green (In) left, amber (Out) right */}
              <View style={[styles.bar, { backgroundColor: colors.border }]}>
                <View
                  style={[styles.barSeg, { width: `${inPct}%`, backgroundColor: colors.success }]}
                />
                <View
                  style={[styles.barSeg, { flex: 1, backgroundColor: colors.warning }]}
                />
              </View>

              {/* In / Out labels + amounts */}
              <View style={styles.inOutRow}>
                <View>
                  <View style={styles.dotRow}>
                    <View style={[styles.dot, { backgroundColor: colors.success }]} />
                    <Text style={[styles.dotLabel, { color: colors.textSubtle, fontFamily: FONTS.semiBold }]}>
                      In
                    </Text>
                  </View>
                  <Text style={[styles.flowAmt, { color: colors.success, fontFamily: FONTS.bold }]}>
                    {fmt(income)}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <View style={[styles.dotRow, { justifyContent: "flex-end" }]}>
                    <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                    <Text style={[styles.dotLabel, { color: colors.textSubtle, fontFamily: FONTS.semiBold }]}>
                      Out
                    </Text>
                  </View>
                  <Text style={[styles.flowAmt, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                    {fmt(spend)}
                  </Text>
                </View>
              </View>

              {/* Net */}
              <View style={[styles.netRow, { backgroundColor: colors.surface2 }]}>
                <Text style={[styles.netLabel, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                  Net change
                </Text>
                <Text
                  style={[
                    styles.netAmt,
                    { color: net >= 0 ? colors.success : colors.warning, fontFamily: FONTS.bold },
                  ]}
                >
                  {net >= 0 ? "+" : ""}{sym}
                  {Math.abs(net).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </Text>
              </View>
            </View>

            {/* Transactions section */}
            <Text
              style={[styles.sectionLabel, { color: colors.textSubtle, fontFamily: FONTS.semiBold }]}
            >
              {active} TRANSACTIONS
            </Text>

            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ paddingVertical: SPACING.xl }}
              />
            ) : transactions.length === 0 ? (
              <View style={[styles.txCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <EmptyState
                  icon="card-outline"
                  message={`No ${active} transactions`}
                  subMessage="Transactions in this currency will appear here once synced."
                />
              </View>
            ) : (
              <View
                style={[styles.txCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                {transactions.map((tx, i) => (
                  <View
                    key={tx.reference ?? String(tx.id)}
                    style={[
                      styles.txRow,
                      i < transactions.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <TransactionRow transaction={tx} />
                  </View>
                ))}
                {isFetchingNextPage && (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={{ paddingVertical: SPACING.md }}
                  />
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  backdrop: { flex: 1 },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    height: SCREEN_HEIGHT * 0.88,
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
  title: { fontSize: FONT_SIZE.h2, letterSpacing: -0.5 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  // Tabs — fixed height prevents vertical stretch
  tabsScroll: { height: 52, flexGrow: 0 },
  tabsContent: {
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
    borderWidth: 1,
  },
  tabText: { fontSize: 14, letterSpacing: -0.1 },
  // Body
  body: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: 80,
    gap: SPACING.md,
  },
  // Flow card
  flowCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
    gap: SPACING.md,
  },
  flowQ: { fontSize: 14, lineHeight: 20 },
  bar: { flexDirection: "row", height: 12, borderRadius: 99, overflow: "hidden" },
  barSeg: { height: "100%" },
  inOutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dotRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 99 },
  dotLabel: { fontSize: 12 },
  flowAmt: { fontSize: 18, letterSpacing: -0.5 },
  netRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  netLabel: { fontSize: 13 },
  netAmt: { fontSize: 18, letterSpacing: -0.5 },
  // Transactions
  sectionLabel: { fontSize: 11, letterSpacing: 0.6 },
  txCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  txRow: { paddingHorizontal: SPACING.base },
});
