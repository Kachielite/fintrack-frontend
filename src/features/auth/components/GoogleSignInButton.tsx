import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FONTS, FONT_SIZE, RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

export default function GoogleSignInButton({
  onPress,
  isLoading = false,
}: GoogleSignInButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderStrong,
        },
        pressed && { backgroundColor: colors.primaryLight },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
    >
      {isLoading ? (
        <ActivityIndicator color={colors.textSecondary} />
      ) : (
        <>
          <Ionicons name="logo-google" size={22} color={colors.textPrimary} />
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Continue with Google
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
  },
});
