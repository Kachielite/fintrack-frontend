import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface Props {
  step: number;
  total: number;
}

export default function OnboardingProgressBar({ step, total }: Props) {
  const colors = useThemeColors();
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            {
              flex: 1,
              backgroundColor: i < step ? colors.primary : colors.surface2,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6, paddingHorizontal: 24 },
  segment: { height: 4, borderRadius: 99 },
});
