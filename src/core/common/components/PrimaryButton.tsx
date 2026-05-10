import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { FONTS, FONT_SIZE, RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function PrimaryButton({
  label,
  onPress,
  isLoading = false,
  disabled = false,
}: PrimaryButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
        },
        pressed && !isDisabled && { backgroundColor: colors.primaryDark },
        isDisabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <Text style={[styles.label, { color: colors.onPrimary }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    letterSpacing: 0.1,
  },
});
