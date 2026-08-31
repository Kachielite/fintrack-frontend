import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, SPACING, RADIUS } from "@/core/common/constants/theme";
import Dropdown from "@/core/common/components/Dropdown";
import { useBanks } from "@/features/user/hooks/use-banks";

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

// The three fields needed to create a distinct account: bank name (free
// text, with suggestions from the real bank list so it can resolve to a
// real bank_id when it matches), account number (distinguishes two accounts
// at the same bank in the same currency, e.g. checking vs. savings), and
// currency (a dropdown, unlike the other two).
export default function NewAccountFields({ value, onChange }: Props) {
  const colors = useThemeColors();
  const { banks } = useBanks();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions =
    showSuggestions && value.bankName.trim().length > 0
      ? banks
          .filter((b) => b.name.toLowerCase().includes(value.bankName.trim().toLowerCase()))
          .slice(0, 5)
      : [];

  function updateBankName(text: string) {
    onChange({ ...value, bankName: text, bankId: undefined });
    setShowSuggestions(true);
  }

  function selectBank(bankId: number, name: string) {
    onChange({ ...value, bankId, bankName: name });
    setShowSuggestions(false);
  }

  return (
    <View style={{ gap: SPACING.md }}>
      <View style={{ gap: SPACING.sm }}>
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
          BANK NAME (OPTIONAL)
        </Text>
        <TextInput
          value={value.bankName}
          onChangeText={updateBankName}
          onFocus={() => setShowSuggestions(true)}
          placeholder="e.g. Access Bank"
          placeholderTextColor={colors.textSubtle}
          style={[
            styles.input,
            { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary },
          ]}
        />
        {suggestions.length > 0 && (
          <View style={[styles.suggestions, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {suggestions.map((b) => (
              <Pressable
                key={b.id}
                onPress={() => selectBank(b.id, b.name)}
                style={[styles.suggestionRow, { borderBottomColor: colors.border }]}
              >
                <Text style={{ color: colors.textPrimary, fontFamily: FONTS.regular, fontSize: 14 }}>
                  {b.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

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
  suggestions: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  suggestionRow: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
