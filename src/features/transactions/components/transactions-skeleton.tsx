import React from "react";
import { View, StyleSheet } from "react-native";
import { SPACING } from "@/core/common/constants/theme";
import SkeletonBox from "@/core/common/components/SkeletonBox";

const SKELETON_COUNT = 7;

export default function TransactionsSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <View key={i} style={styles.row}>
          <SkeletonBox width={40} height={40} radius={12} />
          <View style={styles.middle}>
            <SkeletonBox width="65%" height={13} radius={6} />
            <SkeletonBox width="40%" height={10} radius={5} />
          </View>
          <SkeletonBox width={72} height={13} radius={6} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: 6,
  },
  middle: {
    flex: 1,
    gap: 6,
  },
});

