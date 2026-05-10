import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  RADIUS,
} from "@/core/common/constants/theme";

interface AppleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

// Apple logo approximated — replace with react-native-svg for production
function AppleMark() {
  return (
    <View style={aStyles.container}>
      {/* Body of the apple */}
      <View style={aStyles.body} />
      {/* Leaf */}
      <View style={aStyles.leaf} />
      {/* Bite (white circle to cut top-right) */}
      <View style={aStyles.bite} />
    </View>
  );
}

const aStyles = StyleSheet.create({
  container: {
    width: 18,
    height: 20,
    position: "relative",
  },
  body: {
    position: "absolute",
    bottom: 0,
    left: 1,
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: COLORS.textInverse,
  },
  leaf: {
    position: "absolute",
    top: 0,
    left: 7,
    width: 5,
    height: 7,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 3,
    backgroundColor: COLORS.textInverse,
    transform: [{ rotate: "10deg" }],
  },
  bite: {
    position: "absolute",
    top: 2,
    right: 0,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.textPrimary,
  },
});

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
        <ActivityIndicator color={COLORS.textInverse} />
      ) : (
        <>
          <AppleMark />
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
    backgroundColor: COLORS.textPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  pressed: {
    opacity: 0.82,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLORS.textInverse,
  },
});
