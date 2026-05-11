import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS } from "@/core/common/constants/theme";
import { CompleteOnboardingSchemaType } from "../onboarding.dto";

type PayFrequency = CompleteOnboardingSchemaType["pay_frequency"];

const SCHEDULES: Array<{ id: PayFrequency; label: string }> = [
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "irregular", label: "Irregular" },
];

interface Props {
  value: PayFrequency;
  onChange: (v: PayFrequency) => void;
}

export default function PayFrequencyGrid({ value, onChange }: Props) {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        How often do you get paid?
      </Text>
      <View style={styles.grid}>
        {SCHEDULES.map((s) => {
          const active = value === s.id;
          return (
            <Pressable
              key={s.id}
              onPress={() => onChange(s.id)}
              style={[
                styles.cell,
                {
                  backgroundColor: active ? colors.primaryLight : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.cellLabel,
                  {
                    color: active ? colors.primary : colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
              >
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  label: { fontSize: 14, marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cell: {
    width: "48%",
    padding: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
  },
  cellLabel: { fontSize: 14 },
});
