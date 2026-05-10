import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { FONTS, FONT_SIZE, RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

// Google "G" mark rendered with four coloured quarter-arcs approximated as Views.
// Replace with react-native-svg <Svg> for pixel-perfect rendering.
function GoogleMark() {
  return (
    <View style={gStyles.mark}>
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
      <View
        style={[
          gStyles.quarter,
          { backgroundColor: "#34A853", left: 0, bottom: 0, borderBottomLeftRadius: 10 },
        ]}
      />
      <View
        style={[gStyles.quarter, { backgroundColor: "#FBBC05", right: 0, bottom: 0 }]}
      />
      <View style={gStyles.inner} />
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
  half: { position: "absolute", top: 0, left: 0, right: 0, height: 10 },
  quarter: { position: "absolute", width: 10, height: 10 },
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
          <GoogleMark />
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
