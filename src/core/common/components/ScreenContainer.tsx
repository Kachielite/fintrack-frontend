import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { SPACING } from "@/core/common/constants/theme";

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: boolean;
}

export default function ScreenContainer({
  children,
  scrollable = true,
  padding = true,
}: ScreenContainerProps) {
  const colors = useThemeColors();

  const inner = padding ? (
    <View style={{ paddingHorizontal: SPACING.base }}>{children}</View>
  ) : (
    <>{children}</>
  );

  if (scrollable) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: SPACING.xxl }}
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>{inner}</View>
    </SafeAreaView>
  );
}
