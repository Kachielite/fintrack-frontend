import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface SkeletonBoxProps {
  width: number | string;
  height: number;
  radius?: number;
}

export default function SkeletonBox({ width, height, radius = 8 }: SkeletonBoxProps) {
  const colors = useThemeColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width: width as any,
        height,
        borderRadius: radius,
        backgroundColor: colors.surface2,
        opacity,
      }}
    />
  );
}
