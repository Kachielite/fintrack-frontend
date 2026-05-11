import React from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS } from "@/core/common/constants/theme";
import { CompleteOnboardingSchemaType } from "../onboarding.dto";

type Currency = CompleteOnboardingSchemaType["ref_currency"];

const CURRENCIES: Array<{ code: Currency; label: string }> = [
  { code: "NGN", label: "₦ NGN" },
  { code: "USD", label: "$ USD" },
  { code: "GBP", label: "£ GBP" },
  { code: "EUR", label: "€ EUR" },
  { code: "GHS", label: "₵ GHS" },
  { code: "KES", label: "KSh KES" },
  { code: "ZAR", label: "R ZAR" },
];

interface Props {
  value: Currency;
  onChange: (v: Currency) => void;
}

export default function CurrencySelector({ value, onChange }: Props) {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        What's your main currency?
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {CURRENCIES.map((c) => {
          const active = value === c.code;
          return (
            <Pressable
              key={c.code}
              onPress={() => onChange(c.code)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  {
                    color: active ? colors.onPrimary : colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
              >
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: { fontSize: 14, marginBottom: 10 },
  scroll: { gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
    borderWidth: 1.5,
  },
  chipLabel: { fontSize: 14 },
});
