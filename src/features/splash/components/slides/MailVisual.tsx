import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS, RADIUS } from "@/core/common/constants/theme";

// Simulates the design: two tilted email-card skeletons + a circular check badge
export default function MailVisual() {
  return (
    <View style={styles.container}>
      {/* Back card — tilted left */}
      <View style={[styles.card, styles.cardBack]}>
        <View style={styles.avatar} />
        <View style={styles.lines}>
          <View style={[styles.line, { width: "65%" }]} />
          <View style={[styles.line, { width: "40%", marginTop: 5 }]} />
        </View>
      </View>

      {/* Front card — tilted right, elevated */}
      <View style={[styles.card, styles.cardFront]}>
        <View style={[styles.avatar, styles.avatarPrimary]} />
        <View style={styles.lines}>
          <View style={[styles.line, { width: "58%" }]} />
          <View style={[styles.line, { width: "34%", marginTop: 5 }]} />
        </View>
      </View>

      {/* Check badge */}
      <View style={styles.badge}>
        <View style={styles.checkmark}>
          {/* Checkmark drawn with two rotated bars */}
          <View style={styles.checkLeft} />
          <View style={styles.checkRight} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 200,
    position: "relative",
  },
  card: {
    position: "absolute",
    width: 210,
    height: 54,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  cardBack: {
    top: 12,
    left: 0,
    transform: [{ rotate: "-4deg" }],
  },
  cardFront: {
    top: 84,
    left: 14,
    transform: [{ rotate: "2deg" }],
    // simulated elevation shadow
    shadowColor: "#231C13",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
  },
  avatarPrimary: {
    backgroundColor: `${COLORS.primary}33`,
  },
  lines: {
    flex: 1,
  },
  line: {
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.surface2,
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 126,
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  checkmark: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  checkLeft: {
    position: "absolute",
    width: 10,
    height: 3,
    backgroundColor: COLORS.textInverse,
    borderRadius: 2,
    bottom: 10,
    left: 6,
    transform: [{ rotate: "45deg" }],
  },
  checkRight: {
    position: "absolute",
    width: 18,
    height: 3,
    backgroundColor: COLORS.textInverse,
    borderRadius: 2,
    bottom: 12,
    right: 4,
    transform: [{ rotate: "-50deg" }],
  },
});
