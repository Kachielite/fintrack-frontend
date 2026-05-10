import React, { useEffect, useRef } from "react";
import { View, Animated, Pressable, StyleSheet } from "react-native";
import { RADIUS, SPACING } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface SplashDotsProps {
  count: number;
  activeIndex: number;
  onPress: (index: number) => void;
}

function AnimatedDot({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const width = useRef(new Animated.Value(active ? 24 : 6)).current;
  const opacity = useRef(new Animated.Value(active ? 1 : 0.35)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(width, {
        toValue: active ? 24 : 6,
        useNativeDriver: false,
        stiffness: 200,
        damping: 20,
      }),
      Animated.timing(opacity, {
        toValue: active ? 1 : 0.35,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [active, width, opacity]);

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Animated.View
        style={[
          styles.dot,
          {
            width,
            backgroundColor: active ? colors.primary : colors.surface2,
            opacity,
          },
        ]}
      />
    </Pressable>
  );
}

export default function SplashDots({
  count,
  activeIndex,
  onPress,
}: SplashDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <AnimatedDot
          key={i}
          active={i === activeIndex}
          onPress={() => onPress(i)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm - 2,
    paddingBottom: SPACING.xl,
  },
  dot: {
    height: 6,
    borderRadius: RADIUS.full,
  },
});
