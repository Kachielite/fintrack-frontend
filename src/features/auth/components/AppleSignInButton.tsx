import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FONTS, FONT_SIZE, RADIUS } from "@/core/common/constants/theme";

interface AppleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

export default function AppleSignInButton({
  onPress,
  isLoading = false,
}: AppleSignInButtonProps) {
  // Only render on iOS — Apple guidelines require hiding on Android
  if (Platform.OS !== "ios") return null;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Continue with Apple"
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
          <Text style={styles.label}>Continue with Apple</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  pressed: { opacity: 0.82 },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: "#FFFFFF",
  },
});
