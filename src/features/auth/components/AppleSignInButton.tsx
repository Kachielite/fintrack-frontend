import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { FONTS, FONT_SIZE, RADIUS } from "@/core/common/constants/theme";

interface AppleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

// Apple button uses hardcoded black/white per Apple's brand guidelines.
// The mark body is always white on the black button background.
function AppleMark() {
  return (
    <View style={aStyles.container}>
      <View style={aStyles.body} />
      <View style={aStyles.leaf} />
      {/* Black circle cuts the "bite" from the apple shape */}
      <View style={aStyles.bite} />
    </View>
  );
}

const aStyles = StyleSheet.create({
  container: { width: 18, height: 20, position: "relative" },
  body: {
    position: "absolute",
    bottom: 0,
    left: 1,
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  leaf: {
    position: "absolute",
    top: 0,
    left: 7,
    width: 5,
    height: 7,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 3,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "10deg" }],
  },
  bite: {
    position: "absolute",
    top: 2,
    right: 0,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#000000",
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
        <ActivityIndicator color="#FFFFFF" />
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
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  pressed: { opacity: 0.82 },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: "#FFFFFF",
  },
});
