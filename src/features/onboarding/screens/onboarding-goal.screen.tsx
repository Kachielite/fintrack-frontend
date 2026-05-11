import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useCompleteOnboarding } from "../hooks/use-complete-onboarding";
import OnboardingProgressBar from "../components/onboarding-progress-bar";
import AdvisorMark from "../components/advisor-mark";
import GoalSelector from "../components/goal-selector";
import IncomeSlider, { INCOMES_BY_CURRENCY } from "../components/income-slider";
import PayFrequencyGrid from "../components/pay-frequency-grid";
import CurrencySelector from "../components/currency-selector";
import { CompleteOnboardingSchemaType } from "../onboarding.dto";

type Currency = CompleteOnboardingSchemaType["ref_currency"];

export default function OnboardingGoalScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const { form, isSubmitting, completeOnboarding } = useCompleteOnboarding(
    () => navigation.navigate("OnboardingLoading" as never),
  );

  const goalType = form.watch("goal_type");
  const incomeRange = form.watch("income_range");
  const payFrequency = form.watch("pay_frequency");
  const refCurrency = form.watch("ref_currency");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.progressRow}>
        <OnboardingProgressBar step={3} total={3} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AdvisorMark />

        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.extraBold }]}>
          Let's get to know your situation a little.
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
          A few quick questions. No exact numbers needed — rough is fine.
        </Text>

        <GoalSelector
          value={goalType}
          onChange={(v) => form.setValue("goal_type", v)}
        />

        <CurrencySelector
          value={refCurrency}
          onChange={(newCurrency) => {
            const currentTiers = INCOMES_BY_CURRENCY[refCurrency as Currency] ?? INCOMES_BY_CURRENCY.NGN;
            const tierIdx = currentTiers.findIndex((t) => t.value === incomeRange);
            const safeIdx = tierIdx >= 0 ? tierIdx : 0;
            form.setValue("ref_currency", newCurrency);
            form.setValue("income_range", INCOMES_BY_CURRENCY[newCurrency as Currency][safeIdx].value);
          }}
        />

        <IncomeSlider
          value={incomeRange}
          currency={refCurrency as Currency}
          onChange={(v) => form.setValue("income_range", v)}
        />

        <PayFrequencyGrid
          value={payFrequency}
          onChange={(v) => form.setValue("pay_frequency", v)}
        />
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={completeOnboarding}
          disabled={isSubmitting}
          style={[
            styles.primaryBtn,
            { backgroundColor: colors.primary, opacity: isSubmitting ? 0.7 : 1 },
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={[styles.primaryBtnText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
              Continue
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  progressRow: { paddingTop: SPACING.xl },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.base,
  },
  title: {
    fontSize: FONT_SIZE.h1 - 2,
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 12,
    paddingBottom: SPACING.xxl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  primaryBtn: {
    height: 54,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 16 },
});
