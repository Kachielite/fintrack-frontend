import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { formatCurrency } from "@/core/common/utils/currency";
import { formatRelative } from "@/core/common/utils/date";
import { Account } from "../accounts.interface";
import GlassCard from "@/core/common/components/GlassCard";

interface Props {
  account: Account;
  onPress: () => void;
}

export default function AccountCard({ account, onPress }: Props) {
  const colors = useThemeColors();
  const initial = account.bankName?.trim()?.[0]?.toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      <GlassCard style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryMid }]}>
          {initial ? (
            <Text
              style={[
                styles.avatarText,
                { color: colors.primary, fontFamily: FONTS.bold },
              ]}
            >
              {initial}
            </Text>
          ) : (
            <Ionicons name="wallet-outline" size={20} color={colors.primary} />
          )}
        </View>

        <View style={styles.info}>
          <Text
            style={[
              styles.label,
              { color: colors.textPrimary, fontFamily: FONTS.semiBold },
            ]}
            numberOfLines={1}
          >
            {account.label}
          </Text>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.currencyChip,
                { backgroundColor: colors.surface2 },
              ]}
            >
              <Text
                style={[
                  styles.currencyText,
                  { color: colors.textSubtle, fontFamily: FONTS.semiBold },
                ]}
              >
                {account.currency}
              </Text>
            </View>
            {account.accountNumberMask && (
              <Text
                style={[
                  styles.mask,
                  { color: colors.textSubtle, fontFamily: FONTS.regular },
                ]}
              >
                •••• {account.accountNumberMask}
              </Text>
            )}
          </View>
          {account.lastSyncedAt && (
            <Text
              style={[
                styles.synced,
                { color: colors.textSubtle, fontFamily: FONTS.regular },
              ]}
            >
              Updated {formatRelative(account.lastSyncedAt)}
            </Text>
          )}
        </View>

        <View style={styles.right}>
          <Text
            style={[
              styles.balance,
              { color: colors.textPrimary, fontFamily: FONTS.mono },
            ]}
          >
            {account.balance != null
              ? formatCurrency(account.balance, account.currency)
              : "—"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={colors.textSubtle}
          />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.base,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  pressed: { opacity: 0.7 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: FONT_SIZE.h3 },
  info: { flex: 1, minWidth: 0 },
  label: { fontSize: FONT_SIZE.bodySmall, letterSpacing: -0.2 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: 4,
  },
  currencyChip: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.sm,
  },
  currencyText: { fontSize: 10, letterSpacing: 0.3 },
  mask: { fontSize: 11 },
  synced: { fontSize: 11, marginTop: 2 },
  right: { alignItems: "flex-end", flexShrink: 0, gap: 4 },
  balance: { fontSize: FONT_SIZE.bodySmall, letterSpacing: -0.2 },
});
