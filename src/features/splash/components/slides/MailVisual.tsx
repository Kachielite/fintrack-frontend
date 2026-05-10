import React from "react";
import { View, StyleSheet } from "react-native";
import { RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

export default function MailVisual() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {/* Back card — tilted left */}
      <View
        style={[
          styles.card,
          styles.cardBack,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]} />
        <View style={styles.lines}>
          <View style={[styles.line, { width: "65%", backgroundColor: colors.surface2 }]} />
          <View
            style={[
              styles.line,
              { width: "40%", marginTop: 5, backgroundColor: colors.surface2 },
            ]}
          />
        </View>
      </View>

      {/* Front card — tilted right, elevated */}
      <View
        style={[
          styles.card,
          styles.cardFront,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.textPrimary,
          },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: `${colors.primary}33` },
          ]}
        />
        <View style={styles.lines}>
          <View style={[styles.line, { width: "58%", backgroundColor: colors.surface2 }]} />
          <View
            style={[
              styles.line,
              { width: "34%", marginTop: 5, backgroundColor: colors.surface2 },
            ]}
          />
        </View>
      </View>

      {/* Check badge */}
      <View
        style={[
          styles.badge,
          { backgroundColor: colors.primary, shadowColor: colors.primary },
        ]}
      >
        <View style={styles.checkmark}>
          <View style={styles.checkLeft} />
          <View style={styles.checkRight} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 240, height: 200, position: "relative" },
  card: {
    position: "absolute",
    width: 210,
    height: 54,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  cardBack: { top: 12, left: 0, transform: [{ rotate: "-4deg" }] },
  cardFront: {
    top: 84,
    left: 14,
    transform: [{ rotate: "2deg" }],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: { width: 26, height: 26, borderRadius: RADIUS.sm },
  lines: { flex: 1 },
  line: { height: 7, borderRadius: 4 },
  badge: {
    position: "absolute",
    right: 0,
    top: 126,
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  checkmark: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  checkLeft: {
    position: "absolute",
    width: 10,
    height: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    bottom: 10,
    left: 6,
    transform: [{ rotate: "45deg" }],
  },
  checkRight: {
    position: "absolute",
    width: 18,
    height: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    bottom: 12,
    right: 4,
    transform: [{ rotate: "-50deg" }],
  },
});
