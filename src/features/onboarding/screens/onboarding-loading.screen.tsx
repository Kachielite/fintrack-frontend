import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useCrawlStatus } from "../hooks/use-crawl-status";

export default function OnboardingLoadingScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { phase, statusMessage, transactionCount, progress } = useCrawlStatus();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(1)).current;
  const msgFade = useRef(new Animated.Value(1)).current;
  const prevMessage = useRef(statusMessage);

  // Fade message out/in on change
  useEffect(() => {
    if (statusMessage === prevMessage.current) return;
    prevMessage.current = statusMessage;
    Animated.sequence([
      Animated.timing(msgFade, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(msgFade, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [statusMessage]);

  // Pulsing orb
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Expanding ring
  useEffect(() => {
    const ring = Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, { toValue: 1.6, duration: 1200, useNativeDriver: true }),
        Animated.timing(ringAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
      ])
    );
    ring.start();
    return () => ring.stop();
  }, []);

  // Navigate only on success — not on error
  useEffect(() => {
    if (phase === "done" || phase === "skipped") {
      const t = setTimeout(() => {
        navigation.navigate("OnboardingResults" as never, { transactionCount } as never);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [phase, transactionCount, navigation]);

  const showProgress = phase === "syncing" && progress.total > 0;
  const isError = phase === "error";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        {/* Orb with expanding ring */}
        <View style={styles.orbContainer}>
          <Animated.View
            style={[
              styles.ring,
              {
                borderColor: isError ? colors.error : colors.primary,
                transform: [{ scale: ringAnim }],
                opacity: ringAnim.interpolate({
                  inputRange: [1, 1.6],
                  outputRange: [0.4, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.orb,
              {
                backgroundColor: isError ? colors.warningLight : colors.primaryLight,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.orbInner,
                { backgroundColor: isError ? colors.error : colors.primary },
              ]}
            />
          </Animated.View>
        </View>

        {/* Live status message */}
        <Animated.Text
          style={[
            styles.message,
            {
              color: isError ? colors.error : colors.textSecondary,
              fontFamily: FONTS.medium,
              opacity: msgFade,
            },
          ]}
        >
          {statusMessage}
        </Animated.Text>

        {/* Progress bar + count when reading emails */}
        {showProgress && (
          <>
            <View style={[styles.progressTrack, { backgroundColor: colors.surface2 }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${Math.round((progress.processed / progress.total) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressCount, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
              {progress.processed} of {progress.total} emails read
            </Text>
          </>
        )}

        {!showProgress && !isError && (
          <Text style={[styles.subtext, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
            This may take up to a minute
          </Text>
        )}

        {/* Error actions */}
        {isError && (
          <View style={styles.errorActions}>
            <Text style={[styles.errorHint, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
              Check your internet connection and try again.
            </Text>
            <Pressable
              onPress={() => navigation.goBack()}
              style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.retryText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
                Go back
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xxl,
    gap: 20,
  },
  orbContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  ring: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
  },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  orbInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  message: {
    fontSize: FONT_SIZE.body,
    textAlign: "center",
    lineHeight: 24,
  },
  subtext: {
    fontSize: 13,
    textAlign: "center",
  },
  progressCount: {
    fontSize: 12,
    textAlign: "center",
    marginTop: -8,
  },
  progressTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  errorActions: {
    width: "100%",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  errorHint: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    height: 50,
    width: "100%",
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: { fontSize: 15 },
});
