import React from "react";
import { View, StyleSheet } from "react-native";
import { SPACING } from "@/core/common/constants/theme";
import SkeletonBox from "@/core/common/components/SkeletonBox";
import GlassCard from "@/core/common/components/GlassCard";

const SKELETON_COUNT = 3;

export default function BudgetSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <GlassCard key={i} style={styles.card}>
          <View style={styles.top}>
            <SkeletonBox width={36} height={36} radius={12} />
            <View style={styles.info}>
              <SkeletonBox width="55%" height={13} radius={6} />
              <SkeletonBox width="40%" height={10} radius={5} />
            </View>
            <View style={styles.amounts}>
              <SkeletonBox width={70} height={13} radius={6} />
              <SkeletonBox width={50} height={10} radius={5} />
            </View>
          </View>
          <SkeletonBox width="100%" height={6} radius={99} />
        </GlassCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.sm },
  card: { padding: SPACING.base, gap: SPACING.sm },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  info: { flex: 1, gap: 6 },
  amounts: { alignItems: "flex-end", gap: 4 },
});

