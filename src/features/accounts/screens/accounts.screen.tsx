import React, { useCallback, useState } from "react";
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
import { useAccounts } from "../hooks/use-accounts";
import { Account } from "../accounts.interface";
import AccountCard from "../components/account-card";
import AccountActionsSheet from "../components/account-actions-sheet";
import RescanTransfersSheet from "../components/rescan-transfers-sheet";
import EmptyState from "@/core/common/components/EmptyState";
import SkeletonBox from "@/core/common/components/SkeletonBox";

export default function AccountsScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const { accounts, isLoading, refetch } = useAccounts();

  const [selected, setSelected] = useState<Account | null>(null);
  const [rescanSheetOpen, setRescanSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
          Accounts
        </Text>
        <Pressable
          onPress={() => setRescanSheetOpen(true)}
          hitSlop={12}
          accessibilityLabel="Re-scan for transfers"
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="sync-outline" size={19} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("ReviewTransfers")}
          hitSlop={12}
          accessibilityLabel="Review transfers"
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={19}
            color={colors.textPrimary}
          />
        </Pressable>
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

      <RescanTransfersSheet
        visible={rescanSheetOpen}
        onClose={() => setRescanSheetOpen(false)}
      />
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
  },
  title: { flex: 1, fontSize: FONT_SIZE.h1, letterSpacing: -0.6 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.base,
  },
});
