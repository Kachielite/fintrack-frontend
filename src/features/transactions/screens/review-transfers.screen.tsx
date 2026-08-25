import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { useTransfersToReview } from "../hooks/use-transfers-to-review";
import { Transaction } from "../transactions.interface";
import TransactionRow from "@/core/common/components/TransactionRow";
import GlassCard from "@/core/common/components/GlassCard";
import EmptyState from "@/core/common/components/EmptyState";
import SkeletonBox from "@/core/common/components/SkeletonBox";
import TransactionDetailSheet from "../components/transaction-detail-sheet";

export default function ReviewTransfersScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { transfers, isLoading, refetch } = useTransfersToReview();
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }

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

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Text
          style={[
            styles.intro,
            { color: colors.textSecondary, fontFamily: FONTS.regular },
          ]}
        >
          These transactions look like transfers or currency conversions between
          your own accounts, so they&apos;re not counted as spend or income. Tap
          any of them to confirm, or undo it if that&apos;s wrong.
        </Text>

        {isLoading ? (
          <View style={{ gap: SPACING.sm }}>
            {[0, 1, 2].map((i) => (
              <SkeletonBox
                key={i}
                width="100%"
                height={64}
                radius={RADIUS.lg}
              />
            ))}
          </View>
        ) : transfers.length === 0 ? (
          <EmptyState
            icon="swap-horizontal-outline"
            message="Nothing to review"
            subMessage="We haven't excluded any transactions from your totals yet."
          />
        ) : (
          <GlassCard>
            <View style={{ paddingHorizontal: SPACING.base }}>
              {transfers.map((tx, i) => (
                <View
                  key={tx.id}
                  style={
                    i < transfers.length - 1
                      ? [styles.separator, { borderBottomColor: colors.border }]
                      : undefined
                  }
                >
                  <TransactionRow
                    transaction={tx}
                    onPress={() => setSelected(tx)}
                  />
                </View>
              ))}
            </View>
          </GlassCard>
        )}
      </ScrollView>

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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.base,
  },
  intro: { fontSize: 13, lineHeight: 19 },
  separator: { borderBottomWidth: 1 },
});
