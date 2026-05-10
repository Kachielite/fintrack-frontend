import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS, RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

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

  return (
    <View style={styles.container}>
      {/* Globe circle */}
      <View
        style={[
          styles.globe,
          {
            backgroundColor: colors.primaryLight,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={[styles.globeH, { backgroundColor: colors.border }]} />
        <View style={[styles.globeV, { borderColor: colors.border }]} />
      </View>

      {/* Currency chips */}
      {CURRENCIES.map((symbol, i) => {
        const pos = chipPosition(i);
        return (
          <View
            key={symbol}
            style={[
              styles.chip,
              {
                left: pos.left,
                top: pos.top,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.textPrimary,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: colors.textPrimary }]}>
              {symbol}
            </Text>
          </View>
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
