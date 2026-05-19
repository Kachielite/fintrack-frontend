import React from "react";
import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface Props {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export default function SuggestionChips({ suggestions, onSelect }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {suggestions.map((s, i) => (
          <Pressable
            key={i}
            onPress={() => onSelect(s)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: pressed ? colors.primaryMid : colors.primaryLight,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: colors.primary }]} numberOfLines={2}>
              {s}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  row: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: 200,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
