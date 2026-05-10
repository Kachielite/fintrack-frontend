import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  RADIUS,
} from "@/core/common/constants/theme";

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

// Google "G" mark rendered with four coloured quarter-arcs approximated as Views.
// Replace with react-native-svg <Svg> for pixel-perfect rendering.
function GoogleMark() {
  return (
    <View style={gStyles.mark}>
      {/* Top half — blue */}
      <View
        style={[
          gStyles.half,
          {
            backgroundColor: "#4285F4",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        ]}
      />
      {/* Bottom-left — green */}
      <View
        style={[
          gStyles.quarter,
          {
            backgroundColor: "#34A853",
            left: 0,
            bottom: 0,
            borderBottomLeftRadius: 10,
          },
        ]}
      />
      {/* Bottom-right — yellow then red — simplified to two colours */}
      <View
        style={[
          gStyles.quarter,
          { backgroundColor: "#FBBC05", right: 0, bottom: 0 },
        ]}
      />
      {/* Inner white circle */}
      <View style={gStyles.inner} />
      {/* White G bar */}
      <View style={gStyles.gBar} />
    </View>
  );
}

const gStyles = StyleSheet.create({
  mark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#EA4335",
  },
  half: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 10,
  },
  quarter: {
    position: "absolute",
    width: 10,
    height: 10,
  },
  inner: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  gBar: {
    position: "absolute",
    top: 8,
    right: 1,
    width: 8,
    height: 4,
    backgroundColor: "#4285F4",
    borderRadius: 1,
  },
});

export default function GoogleSignInButton({
  onPress,
  isLoading = false,
}: GoogleSignInButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.textSecondary} />
      ) : (
        <>
          <GoogleMark />
          <Text style={styles.label}>Continue with Google</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  pressed: {
    opacity: 0.85,
    backgroundColor: COLORS.primaryLight,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLORS.textPrimary,
  },
});
