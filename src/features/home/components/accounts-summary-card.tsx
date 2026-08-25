import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { formatCurrency } from "@/core/common/utils/currency";
import { Account } from "@/features/accounts/accounts.interface";
import SectionHeader from "@/core/common/components/SectionHeader";
import GlassCard from "@/core/common/components/GlassCard";
import SkeletonBox from "@/core/common/components/SkeletonBox";

interface Props {
  accounts: Account[];
  isLoading: boolean;
}

const VISIBLE_LIMIT = 4;

export default function AccountsSummaryCard({ accounts, isLoading }: Props) {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();

  if (!isLoading && accounts.length === 0) return null;

  const items = accounts.slice(0, VISIBLE_LIMIT);
  const hasMore = accounts.length > VISIBLE_LIMIT;

  return (
    <View>
      <SectionHeader
        title="Accounts"
        action={{
          label: "See all",
          onPress: () => navigation.navigate("Accounts"),
        }}
      />
      <GlassCard>
        {isLoading ? (
          <View style={{ gap: SPACING.sm, padding: SPACING.base }}>
            {[0, 1].map((i) => (
              <View key={i} style={styles.skeletonRow}>
                <SkeletonBox width={36} height={36} radius={RADIUS.md} />
                <View style={{ flex: 1, gap: 6 }}>
                  <SkeletonBox width="55%" height={13} radius={6} />
                </View>
                <SkeletonBox width={70} height={13} radius={6} />
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingHorizontal: SPACING.base }}>
            {items.map((account, i) => (
              <Pressable
                key={account.id}
                onPress={() => navigation.navigate("Accounts")}
                style={[
                  styles.row,
                  i < items.length - 1 || hasMore
                    ? [styles.separator, { borderBottomColor: colors.border }]
                    : undefined,
                ]}
              >
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: colors.primaryMid },
                  ]}
                >
                  {account.bankName ? (
                    <Text
                      style={[
                        styles.avatarText,
                        { color: colors.primary, fontFamily: FONTS.bold },
                      ]}
                    >
                      {account.bankName[0].toUpperCase()}
                    </Text>
                  ) : (
                    <Ionicons
                      name="wallet-outline"
                      size={16}
                      color={colors.primary}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                  ]}
                  numberOfLines={1}
                >
                  {account.label}
                </Text>
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
              </Pressable>
            ))}
            {hasMore && (
              <Pressable
                onPress={() => navigation.navigate("Accounts")}
                style={styles.moreRow}
              >
                <Text
                  style={[
                    styles.moreText,
                    { color: colors.textSubtle, fontFamily: FONTS.regular },
                  ]}
                >
                  +{accounts.length - VISIBLE_LIMIT} more
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
  },
  separator: { borderBottomWidth: 1 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 15 },
  label: { flex: 1, fontSize: FONT_SIZE.bodySmall, letterSpacing: -0.2 },
  balance: { fontSize: FONT_SIZE.bodySmall, letterSpacing: -0.2 },
  moreRow: { paddingVertical: SPACING.sm },
  moreText: { fontSize: 12 },
});
