import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import OnboardingProgressBar from "../components/onboarding-progress-bar";
import PrimaryButton from "@/core/common/components/PrimaryButton";

// This screen is kept for backwards-navigation compatibility.
// The active onboarding flow now goes: OnboardingGmail → OnboardingGoal directly.
export default function OnboardingConnectScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.progressRow}>
        <OnboardingProgressBar step={2} total={2} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.extraBold }]}>
          Almost there
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
          Your Gmail is being set up automatically.
        </Text>
        <PrimaryButton
          label="Continue"
          onPress={() => navigation.navigate("OnboardingGoal")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  progressRow: { paddingTop: SPACING.xl },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    gap: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.h1,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  body: {
    fontSize: FONT_SIZE.body,
    lineHeight: 24,
  },
});
