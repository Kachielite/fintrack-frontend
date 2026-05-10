import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS, FONT_SIZE, RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

export default function IrisVisual() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {/* Advisor avatar */}
      <View style={styles.avatarWrap}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
          ]}
        >
          <Text style={[styles.avatarLetter, { color: colors.onPrimary }]}>
            I
          </Text>
        </View>

        {/* Sparkle badge */}
        <View
          style={[
            styles.sparkleBadge,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.sparkleIcon, { color: colors.primary }]}>✦</Text>
        </View>
      </View>

      {/* "You're doing well" bubble — bottom left */}
      <View
        style={[
          styles.bubble,
          styles.bubbleLeft,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.textPrimary,
          },
        ]}
      >
        <Text style={[styles.bubbleTextDark, { color: colors.textPrimary }]}>
          You're doing well 👌
        </Text>
      </View>

      {/* "Try ₦40k dining" bubble — top right */}
      <View
        style={[
          styles.bubble,
          styles.bubbleRight,
          { backgroundColor: colors.primary, borderWidth: 0 },
        ]}
      >
        <Text style={[styles.bubbleTextLight, { color: colors.onPrimary }]}>
          Try ₦40k dining
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarLetter: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    letterSpacing: -0.5,
  },
  sparkleBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleIcon: { fontSize: 11 },
  bubble: {
    position: "absolute",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleLeft: { bottom: 16, left: 0 },
  bubbleRight: { top: 20, right: 0 },
  bubbleTextDark: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
  },
  bubbleTextLight: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
  },
});
