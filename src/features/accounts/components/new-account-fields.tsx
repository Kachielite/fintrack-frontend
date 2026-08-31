import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, SPACING, RADIUS } from "@/core/common/constants/theme";
import Dropdown from "@/core/common/components/Dropdown";
import BankNameField from "./bank-name-field";

const CURRENCIES = [
  { value: "NGN", label: "NGN. Nigerian Naira" },
  { value: "USD", label: "USD. US Dollar" },
  { value: "GBP", label: "GBP. British Pound" },
  { value: "EUR", label: "EUR. Euro" },
  { value: "GHS", label: "GHS. Ghanaian Cedi" },
  { value: "KES", label: "KES. Kenyan Shilling" },
  { value: "ZAR", label: "ZAR. South African Rand" },
];

export interface NewAccountFieldsValue {
  bankId?: number;
  bankName: string;
  accountNumber: string;
  currency: string | null;
}

interface Props {
  value: NewAccountFieldsValue;
  onChange: (value: NewAccountFieldsValue) => void;
}

// The three fields needed to create a distinct account: bank name (see
// BankNameField), account number (distinguishes two accounts at the same
// bank in the same currency, e.g. checking vs. savings), and currency (a
// dropdown, unlike the other two).
export default function NewAccountFields({ value, onChange }: Props) {
  const colors = useThemeColors();

  return (
    <View style={{ gap: SPACING.md }}>
      <BankNameField
        value={{ bankId: value.bankId, bankName: value.bankName }}
        onChange={(bank) => onChange({ ...value, ...bank })}
      />

      <View style={{ gap: SPACING.sm }}>
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
          ACCOUNT NUMBER (OPTIONAL)
        </Text>
        <TextInput
          value={value.accountNumber}
          onChangeText={(text) => onChange({ ...value, accountNumber: text })}
          placeholder="Distinguishes accounts at the same bank"
          placeholderTextColor={colors.textSubtle}
          keyboardType="numeric"
          style={[
            styles.input,
            { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary },
          ]}
        />
      </View>

      <Dropdown
        label="CURRENCY"
        placeholder="Select a currency"
        value={value.currency}
        options={CURRENCIES}
        onSelect={(currency) => onChange({ ...value, currency })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, letterSpacing: 0.6 },
  input: {
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
  },
});
