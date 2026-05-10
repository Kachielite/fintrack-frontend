import React from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { FONTS, FONT_SIZE, RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { useFloatAnim } from "@/core/common/hooks/use-float-anim";

export default function IrisVisual() {
  const colors = useThemeColors();

  // Avatar bobs slowly; each bubble drifts at its own pace
  const avatarFloat      = useFloatAnim({ amplitude: 8, period: 1800, delay: 0 });
  const bubbleLeftFloat  = useFloatAnim({ amplitude: 5, period: 1500, delay: 300 });
  const bubbleRightFloat = useFloatAnim({ amplitude: 6, period: 1700, delay: 600 });

  return (
    <View style={styles.container}>
      {/* Advisor avatar — bobs gently */}
      <Animated.View
        style={[styles.avatarWrap, { transform: [{ translateY: avatarFloat }] }]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
          ]}
        >
          <Text style={[styles.avatarLetter, { color: colors.onPrimary }]}>I</Text>
        </View>

        <View
          style={[
            styles.sparkleBadge,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sparkleIcon, { color: colors.primary }]}>✦</Text>
        </View>
      </Animated.View>

      {/* "You're doing well" bubble — floats independently */}
      <Animated.View
        style={[
          styles.bubble,
          styles.bubbleLeft,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.textPrimary,
            transform: [{ translateY: bubbleLeftFloat }],
          },
        ]}
      >
        <Text style={[styles.bubbleTextDark, { color: colors.textPrimary }]}>
          You're doing well 👌
        </Text>
      </Animated.View>

      {/* "Try ₦40k dining" bubble — drifts at its own rhythm */}
      <Animated.View
        style={[
          styles.bubble,
          styles.bubbleRight,
          {
            backgroundColor: colors.primary,
            borderWidth: 0,
            transform: [{ translateY: bubbleRightFloat }],
          },
        ]}
      >
        <Text style={[styles.bubbleTextLight, { color: colors.onPrimary }]}>
          Try ₦40k dining
        </Text>
      </Animated.View>
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
  bubbleTextDark: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZE.caption },
  bubbleTextLight: { fontFamily: FONTS.semiBold, fontSize: FONT_SIZE.caption },
});
