import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  RADIUS,
} from "@/core/common/constants/theme";

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
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.textInverse} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  pressed: {
    backgroundColor: COLORS.primaryDark,
    shadowOpacity: 0.12,
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLORS.textInverse,
    letterSpacing: 0.1,
  },
});
