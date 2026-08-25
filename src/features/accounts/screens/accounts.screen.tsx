import React, { useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { useAccounts } from "../hooks/use-accounts";
import { useRescanTransfers } from "../hooks/use-rescan-transfers";
import { Account } from "../accounts.interface";
import AccountCard from "../components/account-card";
import AccountActionsSheet from "../components/account-actions-sheet";
import EmptyState from "@/core/common/components/EmptyState";
import SkeletonBox from "@/core/common/components/SkeletonBox";

export default function AccountsScreen() {
  const colors = useThemeColors();
  const { accounts, isLoading, refetch } = useAccounts();
  const { rescan, isRescanning } = useRescanTransfers();

  const [selected, setSelected] = useState<Account | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  async function handleRescan() {
    try {
      const result = await rescan();
      Toast.show({
        type: "success",
        text1:
          result.linked > 0
            ? `Found ${result.linked} transfer${result.linked === 1 ? "" : "s"}`
            : "No new transfers found",
        text2: `Checked ${result.scanned} transaction${result.scanned === 1 ? "" : "s"}`,
      });
    } catch {
      Toast.show({ type: "error", text1: "Could not re-scan transactions" });
    }
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
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
        <Pressable
          onPress={handleRescan}
          disabled={isRescanning}
          style={styles.rescanRow}
        >
          {isRescanning ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="sync-outline" size={16} color={colors.primary} />
          )}
          <Text
            style={[
              styles.rescanText,
              { color: colors.primary, fontFamily: FONTS.semiBold },
            ]}
          >
            Re-scan for transfers
          </Text>
        </Pressable>

        {isLoading ? (
          <View style={{ gap: SPACING.sm }}>
            {[0, 1, 2].map((i) => (
              <SkeletonBox
                key={i}
                width="100%"
                height={76}
                radius={RADIUS.xl}
              />
            ))}
          </View>
        ) : accounts.length === 0 ? (
          <EmptyState
            icon="wallet-outline"
            message="No accounts yet"
            subMessage="Accounts are created automatically as we recognise transactions from your bank alerts."
          />
        ) : (
          <View style={{ gap: SPACING.sm }}>
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onPress={() => setSelected(account)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {selected && (
        <AccountActionsSheet
          visible={!!selected}
          onClose={() => setSelected(null)}
          account={selected}
          otherAccounts={accounts.filter((a) => a.id !== selected.id)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.base,
  },
  rescanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    alignSelf: "flex-start",
    paddingVertical: SPACING.xs,
  },
  rescanText: { fontSize: 13 },
});
