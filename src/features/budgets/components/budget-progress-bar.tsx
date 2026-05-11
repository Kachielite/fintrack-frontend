import React from "react";
import { View, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { BudgetStatus } from "../budgets.interface";

interface Props {
  percentage: number;
  status: BudgetStatus;
  height?: number;
}

export default function BudgetProgressBar({
  percentage,
  status,
  height = 6,
}: Props) {
  const colors = useThemeColors();

  const barColor =
    status === "over"
      ? colors.error
      : status === "warning"
        ? colors.warning
        : colors.success;

  const clampedPct = Math.min(Math.max(percentage, 0), 100);

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: colors.surface2, height },
      ]}
    >
      <View
        style={[
          styles.fill,
          { backgroundColor: barColor, width: `${clampedPct}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: 99, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 99 },
});

