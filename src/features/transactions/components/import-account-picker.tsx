import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { ImportTarget } from "../transactions.dto";

// Mirrors add-transaction-sheet.tsx's currency chip list.
const CURRENCIES = [
  { code: "NGN", label: "₦ NGN" },
  { code: "USD", label: "$ USD" },
  { code: "GBP", label: "£ GBP" },
  { code: "EUR", label: "€ EUR" },
  { code: "GHS", label: "₵ GHS" },
  { code: "KES", label: "KSh KES" },
  { code: "ZAR", label: "R ZAR" },
];

interface Props {
  value: ImportTarget | undefined;
  onChange: (target: ImportTarget | undefined) => void;
}

/**
 * Lets the user pick which account a statement is being imported into (or
 * create a new one by currency) instead of silently falling back to their
 * app-wide reference currency — the fix for statements with no currency
 * column (e.g. M-Pesa) landing as the wrong currency. bank_id is
 * intentionally not exposed here — the backend calls it optional, and
 * there's no bank-picker UI elsewhere in the app to borrow from.
 */
export default function ImportAccountPicker({ value, onChange }: Props) {
  const colors = useThemeColors();
  const { accounts, isLoading } = useAccounts();
  const activeAccounts = accounts.filter((a) => a.isActive);
  const [creatingNew, setCreatingNew] = useState(activeAccounts.length === 0);

  function selectExisting(accountId: number) {
    setCreatingNew(false);
    onChange({ accountId });
  }

  function selectCurrency(currency: string) {
    onChange({ currency });
  }

  const selectedAccountId = value?.accountId;
  const selectedCurrency = !creatingNew ? undefined : value?.currency;

  return (
    <View style={{ gap: SPACING.sm }}>
      <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
        IMPORT INTO
      </Text>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          {activeAccounts.length > 0 && (
            <View style={{ gap: SPACING.xs }}>
              {activeAccounts.map((account) => {
                const active = !creatingNew && selectedAccountId === account.id;
                return (
                  <Pressable
                    key={account.id}
                    onPress={() => selectExisting(account.id)}
                    style={[
                      styles.row,
                      {
                        backgroundColor: active ? colors.primaryLight : colors.background,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <View style={[styles.rowIcon, { backgroundColor: colors.surface2 }]}>
                      <Ionicons name="wallet-outline" size={16} color={colors.textSubtle} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.rowLabel, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}
                        numberOfLines={1}
                      >
                        {account.label}
                      </Text>
                      <Text style={[styles.rowSub, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                        {account.currency}
                        {account.bankName ? ` · ${account.bankName}` : ""}
                      </Text>
                    </View>
                    {active && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
                  </Pressable>
                );
              })}
            </View>
          )}

          <Pressable
            onPress={() => setCreatingNew(true)}
            style={[
              styles.row,
              {
                backgroundColor: creatingNew ? colors.primaryLight : colors.background,
                borderColor: creatingNew ? colors.primary : colors.border,
                borderStyle: "dashed",
              },
            ]}
          >
            <View style={[styles.rowIcon, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="add" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
              Create a new account
            </Text>
          </Pressable>

          {creatingNew && (
            <View style={styles.currencyRow}>
              {CURRENCIES.map((c) => {
                const active = selectedCurrency === c.code;
                return (
                  <Pressable
                    key={c.code}
                    onPress={() => selectCurrency(c.code)}
                    style={[
                      styles.currencyChip,
                      {
                        backgroundColor: active ? colors.primary : colors.background,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyChipLabel,
                        { color: active ? colors.onPrimary : colors.textPrimary, fontFamily: FONTS.semiBold },
                      ]}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, letterSpacing: 0.6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 14 },
  rowSub: { fontSize: 11, marginTop: 1 },
  currencyRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs },
  currencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
  },
  currencyChipLabel: { fontSize: 13 },
});
