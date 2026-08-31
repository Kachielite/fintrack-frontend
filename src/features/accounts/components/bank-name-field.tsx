import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useBanks } from "@/features/user/hooks/use-banks";

export interface BankNameFieldValue {
  bankId?: number;
  bankName: string;
}

interface Props {
  value: BankNameFieldValue;
  onChange: (value: BankNameFieldValue) => void;
  label?: string;
}

// Free-text bank name with live suggestions from the real bank list (GET
// /banks), so it resolves to a real bank_id when it matches one. Typing
// without picking a suggestion still updates bankName but leaves bankId
// unset, so the account still gets created/updated, just without a linked
// bank.
export default function BankNameField({ value, onChange, label = "BANK NAME (OPTIONAL)" }: Props) {
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
    onChange({ bankId, bankName: name });
    setShowSuggestions(false);
  }

  return (
    <View style={{ gap: SPACING.sm }}>
      <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
        {label}
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
