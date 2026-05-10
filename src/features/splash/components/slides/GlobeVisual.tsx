import React from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { FONTS, RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { useFloatAnim } from "@/core/common/hooks/use-float-anim";

const CURRENCIES = ["₦", "$", "£", "KSh"];

function chipPosition(index: number): { left: number; top: number } {
  const angle = (index / CURRENCIES.length) * Math.PI * 2 - Math.PI / 2;
  const r = 88;
  const cx = 120;
  const cy = 100;
  return {
    left: cx + Math.cos(angle) * r - 22,
    top: cy + Math.sin(angle) * r - 22,
  };
}

export default function GlobeVisual() {
  const colors = useThemeColors();

  const globeFloat = useFloatAnim({ amplitude: 5, period: 1900, delay: 0 });

  // Each chip floats at its own pace — staggered 350 ms apart
  const chip0 = useFloatAnim({ amplitude: 6, period: 1400, delay: 0 });
  const chip1 = useFloatAnim({ amplitude: 5, period: 1600, delay: 350 });
  const chip2 = useFloatAnim({ amplitude: 6, period: 1400, delay: 700 });
  const chip3 = useFloatAnim({ amplitude: 5, period: 1600, delay: 1050 });
  const chipFloats = [chip0, chip1, chip2, chip3];

  return (
    <View style={styles.container}>
      {/* Globe — floats as a whole */}
      <Animated.View
        style={[
          styles.globe,
          {
            backgroundColor: colors.primaryLight,
            borderColor: colors.border,
            transform: [{ translateY: globeFloat }],
          },
        ]}
      >
        <View style={[styles.globeH, { backgroundColor: colors.border }]} />
        <View style={[styles.globeV, { borderColor: colors.border }]} />
      </Animated.View>

      {/* Currency chips — each orbits at its own rhythm */}
      {CURRENCIES.map((symbol, i) => {
        const pos = chipPosition(i);
        return (
          <Animated.View
            key={symbol}
            style={[
              styles.chip,
              {
                left: pos.left,
                top: pos.top,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.textPrimary,
                transform: [{ translateY: chipFloats[i] }],
              },
            ]}
          >
            <Text style={[styles.chipText, { color: colors.textPrimary }]}>
              {symbol}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 240, height: 200, position: "relative" },
  globe: {
    position: "absolute",
    left: 40,
    top: 20,
    width: 160,
    height: 160,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  globeH: { position: "absolute", width: "100%", height: 1.5, top: "50%" },
  globeV: {
    width: 80,
    height: 158,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  chip: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chipText: { fontFamily: FONTS.bold, fontSize: 13 },
});
