import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import {
  COLORS,
  FONTS,
  FONT_SIZE,
  SPACING,
} from "@/core/common/constants/theme";
import { SplashSlide } from "../splash.interface";
import MailVisual from "./slides/MailVisual";
import GlobeVisual from "./slides/GlobeVisual";
import IrisVisual from "./slides/IrisVisual";

interface SplashSlideContentProps {
  slide: SplashSlide;
}

function renderVisual(visual: SplashSlide["visual"]) {
  switch (visual) {
    case "mail":
      return <MailVisual />;
    case "globe":
      return <GlobeVisual />;
    case "iris":
      return <IrisVisual />;
  }
}

export default function SplashSlideContent({ slide }: SplashSlideContentProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(12);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        stiffness: 180,
        damping: 22,
      }),
    ]).start();
  }, [slide, opacity, translateY]);

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
    >
      {/* Visual area */}
      <View style={styles.visual}>{renderVisual(slide.visual)}</View>

      {/* Text */}
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.sub}>{slide.sub}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xxl + SPACING.sm,
  },
  visual: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xxl + SPACING.md,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 30,
    color: COLORS.textPrimary,
    letterSpacing: -0.7,
    lineHeight: 34,
    marginBottom: SPACING.md,
  },
  sub: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});
