import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS } from "@/core/common/constants/theme";

const CURRENCIES = ["₦", "$", "£", "KSh"];

// Positions each chip at 90° intervals around a circle of radius 88
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
  return (
    <View style={styles.container}>
      {/* Globe circle */}
      <View style={styles.globe}>
        {/* Horizontal band */}
        <View style={styles.globeH} />
        {/* Vertical ellipse approximated with border */}
        <View style={styles.globeV} />
      </View>

      {/* Currency chips */}
      {CURRENCIES.map((symbol, i) => {
        const pos = chipPosition(i);
        return (
          <View
            key={symbol}
            style={[styles.chip, { left: pos.left, top: pos.top }]}
          >
            <Text style={styles.chipText}>{symbol}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 200,
    position: "relative",
  },
  globe: {
    position: "absolute",
    left: 40,
    top: 20,
    width: 160,
    height: 160,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  globeH: {
    position: "absolute",
    width: "100%",
    height: 1.5,
    backgroundColor: COLORS.border,
    top: "50%",
  },
  globeV: {
    width: 80,
    height: 158,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: "transparent",
  },
  chip: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#231C13",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chipText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
});
