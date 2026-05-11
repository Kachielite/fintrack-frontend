import React from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  filterCount: number;
  onFilterPress: () => void;
}

export default function TransactionsSearchBar({
  value,
  onChangeText,
  filterCount,
  onFilterPress,
}: Props) {
  const colors = useThemeColors();
  const isFiltered = filterCount > 0;

  return (
    <View style={styles.row}>
      {/* Search input */}
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Ionicons name="search-outline" size={16} color={colors.textSubtle} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search transactions"
          placeholderTextColor={colors.textSubtle}
          style={[
            styles.input,
            { color: colors.textPrimary, fontFamily: FONTS.regular },
          ]}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText("")} hitSlop={8}>
            <Ionicons
              name="close-circle"
              size={16}
              color={colors.textSubtle}
            />
          </Pressable>
        )}
      </View>

      {/* Filter button */}
      <Pressable
        onPress={onFilterPress}
        style={[
          styles.filterBtn,
          {
            backgroundColor: isFiltered ? colors.primary : colors.surface,
            borderColor: isFiltered ? colors.primary : colors.border,
          },
        ]}
      >
        <Ionicons
          name="options-outline"
          size={18}
          color={isFiltered ? colors.onPrimary : colors.textPrimary}
        />
        {isFiltered && (
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text style={[styles.badgeText, { color: colors.onPrimary }]}>
              {filterCount}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.sm,
  },
  inputWrap: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.bodySmall,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
  },
});

