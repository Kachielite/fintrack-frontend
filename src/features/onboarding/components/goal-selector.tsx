import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS } from "@/core/common/constants/theme";
import { CompleteOnboardingSchemaType } from "../onboarding.dto";

type GoalType = CompleteOnboardingSchemaType["goal_type"];

const GOALS: Array<{ id: GoalType; label: string; sub: string }> = [
  { id: "save", label: "Build savings", sub: "Grow a cushion for the future" },
  { id: "debt", label: "Clear debt", sub: "Pay down what you owe, faster" },
  { id: "daily", label: "Manage day-to-day", sub: "Just keep things in check" },
  { id: "specific", label: "Save for something specific", sub: "A trip, a thing, a milestone" },
];

interface Props {
  value: GoalType;
  onChange: (v: GoalType) => void;
}

export default function GoalSelector({ value, onChange }: Props) {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        What matters most right now?
      </Text>
      <View style={styles.list}>
        {GOALS.map((g) => {
          const active = value === g.id;
          return (
            <Pressable
              key={g.id}
              onPress={() => onChange(g.id)}
              style={[
                styles.option,
                {
                  backgroundColor: active ? colors.primaryLight : colors.surface,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.optionTitle,
                  {
                    color: active ? colors.primary : colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
              >
                {g.label}
              </Text>
              <Text
                style={[
                  styles.optionSub,
                  { color: colors.textSecondary, fontFamily: FONTS.regular },
                ]}
              >
                {g.sub}
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
  list: { gap: 8 },
  option: {
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  optionTitle: { fontSize: 15, marginBottom: 2 },
  optionSub: { fontSize: 13 },
});
