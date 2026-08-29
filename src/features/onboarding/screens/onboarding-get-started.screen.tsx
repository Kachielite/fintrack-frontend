import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import PrimaryButton from "@/core/common/components/PrimaryButton";
import { useAuthStore } from "@/features/auth/auth.state";

export default function OnboardingGetStartedScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<any>();
  const setDataSourceSkipped = useAuthStore((s) => s.setDataSourceSkipped);

  function handleSkip() {
    setDataSourceSkipped(true);
    navigation.navigate("OnboardingGoal", { source: "skipped" });
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.body}>
        <View style={styles.visual}>
          <View style={[styles.iconBadge, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="rocket-outline" size={40} color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
          How do you want to get started?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
          Connect your bank emails or import a statement and Vela will organise
          everything for you. You can always do this later too.
        </Text>

        <View style={styles.options}>
          <PrimaryButton
            label="Connect Gmail"
            onPress={() => navigation.navigate("OnboardingGmail")}
          />

          <Pressable
            onPress={() => navigation.navigate("OnboardingImportStatement")}
            style={[styles.outlineBtn, { borderColor: colors.primary }]}
          >
            <Text style={[styles.outlineBtnLabel, { color: colors.primary, fontFamily: FONTS.semiBold }]}>
              Import bank statement
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={handleSkip} hitSlop={8} style={styles.skipRow}>
          <Text style={[styles.skipText, { color: colors.textSecondary, fontFamily: FONTS.semiBold }]}>
            I'll do this later
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.xxl,
  },
  visual: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xxl,
  },
  iconBadge: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    letterSpacing: -0.7,
    lineHeight: 34,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZE.body,
    lineHeight: 24,
    marginBottom: SPACING.xxl,
  },
  options: { gap: SPACING.md, marginBottom: SPACING.xl },
  outlineBtn: {
    height: 56,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnLabel: { fontSize: FONT_SIZE.body, letterSpacing: 0.1 },
  skipRow: { alignSelf: "center" },
  skipText: {
    fontSize: FONT_SIZE.bodySmall,
    textDecorationLine: "underline",
  },
});
