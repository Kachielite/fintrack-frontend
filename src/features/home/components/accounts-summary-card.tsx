import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { formatCompactCurrency } from "@/core/common/utils/currency";
import { Account } from "@/features/accounts/accounts.interface";
import SectionHeader from "@/core/common/components/SectionHeader";
import SkeletonBox from "@/core/common/components/SkeletonBox";

interface Props {
  accounts: Account[];
  isLoading: boolean;
}

export default function AccountsSummaryCard({ accounts, isLoading }: Props) {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();

  if (!isLoading && accounts.length === 0) return null;

  return (
    <View>
      <SectionHeader
        title="Accounts"
        action={{
          label: "See all",
          onPress: () => navigation.navigate("Accounts"),
        }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
      >
        {isLoading
          ? [0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.chip, { backgroundColor: colors.surface2, borderColor: colors.border }]}
              >
                <SkeletonBox width={28} height={28} radius={14} />
                <SkeletonBox width={44} height={12} radius={6} />
              </View>
            ))
          : accounts.map((account) => (
              <Pressable
                key={account.id}
                onPress={() => navigation.navigate("Accounts")}
                style={[styles.chip, { backgroundColor: colors.surface2, borderColor: colors.border }]}
              >
                <View style={[styles.avatar, { backgroundColor: colors.primaryMid }]}>
                  {account.bankName ? (
                    <Text
                      style={[styles.avatarText, { color: colors.primary, fontFamily: FONTS.bold }]}
                    >
                      {account.bankName[0].toUpperCase()}
                    </Text>
                  ) : (
                    <Ionicons name="wallet-outline" size={13} color={colors.primary} />
                  )}
                </View>
                <Text
                  style={[styles.balance, { color: colors.textPrimary, fontFamily: FONTS.mono }]}
                  numberOfLines={1}
                >
                  {account.balance != null
                    ? formatCompactCurrency(account.balance, account.currency)
                    : "—"}
                </Text>
              </Pressable>
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { gap: SPACING.sm, paddingHorizontal: SPACING.base },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 11 },
  balance: { fontSize: FONT_SIZE.bodySmall - 1, letterSpacing: -0.2 },
});
