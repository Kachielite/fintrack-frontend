import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, SPACING, RADIUS } from "@/core/common/constants/theme";

interface Props {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  /** Optional formatter to display a human-readable label for each option */
  formatLabel?: (value: string) => string;
}

export default function TransactionsFilterGroup({
  label,
  options,
  selected,
  onToggle,
  formatLabel = (v) => v,
}: Props) {
  const colors = useThemeColors();

  return (
    <View>
      <Text
        style={[
          styles.groupLabel,
          { color: colors.textSecondary, fontFamily: FONTS.bold },
        ]}
      >
        {label.toUpperCase()}
      </Text>
      <View style={styles.chips}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => onToggle(opt)}
              style={[
                styles.chip,
                {
                  backgroundColor: active
                    ? colors.primary
                    : colors.surface2,
                  borderColor: active ? colors.primary : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: active ? colors.onPrimary : colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
              >
                {formatLabel(opt)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  chip: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipText: { fontSize: 13 },
});

