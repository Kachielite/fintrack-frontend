import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPLASH_SLIDES } from "../splash.interface";
import SplashHeader from "./SplashHeader";
import SplashSlideContent from "./SplashSlideContent";
import SplashDots from "./SplashDots";
import PrimaryButton from "@/core/common/components/PrimaryButton";

interface SplashCarouselProps {
  onFinish: () => void;
}

export default function SplashCarousel({ onFinish }: SplashCarouselProps) {
  const colors = useThemeColors();
  const [idx, setIdx] = useState(0);
  const slide = SPLASH_SLIDES[idx];
  const isLast = idx === SPLASH_SLIDES.length - 1;

  function handleNext() {
    if (isLast) {
      onFinish();
    } else {
      setIdx((i) => i + 1);
    }
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <SplashHeader onSkip={onFinish} />

      <SplashSlideContent slide={slide} />

      <View style={styles.bottom}>
        <SplashDots
          count={SPLASH_SLIDES.length}
          activeIndex={idx}
          onPress={setIdx}
        />

        <View style={styles.cta}>
          <PrimaryButton
            label={isLast ? "Get started" : "Next"}
            onPress={handleNext}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bottom: { paddingBottom: SPACING.xxl },
  cta: { paddingHorizontal: SPACING.xl },
});
