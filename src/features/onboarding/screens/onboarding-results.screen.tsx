import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  SafeAreaView,
  Easing,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useAuthStore } from "@/features/auth/auth.state";

export default function OnboardingResultsScreen() {
  const colors = useThemeColors();
  const route = useRoute();
  const { transactionCount } = (route.params ?? { transactionCount: 0 }) as {
    transactionCount: number;
  };
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);

  const [displayed, setDisplayed] = useState(0);
  const trophyScale = useRef(new Animated.Value(0)).current;
  const trophyRotate = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Trophy entrance animation
  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(trophyScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Trophy gentle sway
    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyRotate, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(trophyRotate, {
          toValue: -1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Counter animation
  useEffect(() => {
    if (transactionCount <= 0) return;
    const duration = 2000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * transactionCount));
      if (progress < 1) requestAnimationFrame(tick);
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [transactionCount]);

  const trophyRotateStr = trophyRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-5deg", "5deg"],
  });

  const hasTransactions = transactionCount > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Glow background */}
      <Animated.View
        style={[
          styles.glow,
          { backgroundColor: colors.primaryLight, opacity: glowOpacity },
        ]}
        pointerEvents="none"
      />

      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        {/* Trophy */}
        <View style={styles.trophyWrap}>
          <Animated.View
            style={{
              transform: [{ scale: trophyScale }, { rotate: trophyRotateStr }],
            }}
          >
            <View style={[styles.trophyBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="trophy" size={64} color={colors.primary} />
            </View>
          </Animated.View>
        </View>

        {/* Sparkles */}
        <View style={styles.sparkleRow}>
          {["sparkles", "star", "sparkles"].map((icon, i) => (
            <Ionicons
              key={i}
              name={icon as any}
              size={i === 1 ? 20 : 14}
              color={colors.primary}
              style={{ opacity: 0.6 + i * 0.2 }}
            />
          ))}
        </View>

        {/* Counter or success message */}
        {hasTransactions ? (
          <>
            <Text
              style={[
                styles.count,
                { color: colors.textPrimary, fontFamily: FONTS.extraBold },
              ]}
            >
              {displayed.toLocaleString()}
            </Text>
            <Text
              style={[
                styles.countLabel,
                { color: colors.textSecondary, fontFamily: FONTS.regular },
              ]}
            >
              transactions organised
            </Text>
          </>
        ) : (
          <Text
            style={[
              styles.emptyLabel,
              { color: colors.textPrimary, fontFamily: FONTS.bold },
            ]}
          >
            Your account is all set!
          </Text>
        )}

        <Text
          style={[
            styles.tagline,
            { color: colors.textSubtle, fontFamily: FONTS.regular },
          ]}
        >
          {hasTransactions
            ? "FinTrack has read, categorised, and organised your spending history. Ready to see the big picture?"
            : "Connect your Gmail label any time to let FinTrack organise your bank emails automatically."}
        </Text>

        {/* CTA */}
        <Pressable
          onPress={setOnboardingComplete}
          style={[styles.cta, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.ctaText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
            {hasTransactions ? "Show me my dashboard" : "Finish setup"}
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "55%",
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xxl,
    gap: 12,
  },
  trophyWrap: {
    marginBottom: 4,
  },
  trophyBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  count: {
    fontSize: 64,
    lineHeight: 72,
    letterSpacing: -2,
  },
  countLabel: {
    fontSize: FONT_SIZE.body,
    textAlign: "center",
  },
  emptyLabel: {
    fontSize: FONT_SIZE.h2,
    textAlign: "center",
  },
  tagline: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  cta: {
    width: "100%",
    height: 54,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  ctaText: { fontSize: 16 },
});
