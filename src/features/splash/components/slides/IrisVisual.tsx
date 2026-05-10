import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  RADIUS,
} from "@/core/common/constants/theme";

export default function IrisVisual() {
  return (
    <View style={styles.container}>
      {/* Advisor avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>I</Text>
        </View>

        {/* Sparkle badge */}
        <View style={styles.sparkleBadge}>
          <Text style={styles.sparkleIcon}>✦</Text>
        </View>
      </View>

      {/* "You're doing well" bubble — bottom left */}
      <View style={[styles.bubble, styles.bubbleLeft]}>
        <Text style={styles.bubbleTextDark}>You're doing well 👌</Text>
      </View>

      {/* "Try ₦40k dining" bubble — top right */}
      <View style={[styles.bubble, styles.bubbleRight, styles.bubblePrimary]}>
        <Text style={styles.bubbleTextLight}>Try ₦40k dining</Text>
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
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarLetter: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    color: COLORS.textInverse,
    letterSpacing: -0.5,
  },
  sparkleBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleIcon: {
    fontSize: 11,
    color: COLORS.primary,
  },
  bubble: {
    position: "absolute",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    shadowColor: "#231C13",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleLeft: {
    bottom: 16,
    left: 0,
  },
  bubbleRight: {
    top: 20,
    right: 0,
    borderWidth: 0,
  },
  bubblePrimary: {
    backgroundColor: COLORS.primary,
  },
  bubbleTextDark: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textPrimary,
  },
  bubbleTextLight: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textInverse,
  },
});
