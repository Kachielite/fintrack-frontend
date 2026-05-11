import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS } from "@/core/common/constants/theme";
import { CompleteOnboardingSchemaType } from "../onboarding.dto";

type Currency = CompleteOnboardingSchemaType["ref_currency"];

interface IncomeTier {
  label: string;
  value: string;
}

export const INCOMES_BY_CURRENCY: Record<Currency, IncomeTier[]> = {
  NGN: [
    { label: "Under ₦200k", value: "0-200k" },
    { label: "₦200k – ₦600k", value: "200k-600k" },
    { label: "₦600k – ₦1.5M", value: "600k-1.5M" },
    { label: "₦1.5M – ₦3M", value: "1.5M-3M" },
    { label: "Over ₦3M", value: "3M+" },
  ],
  USD: [
    { label: "Under $1,000", value: "0-1000" },
    { label: "$1,000 – $3,000", value: "1000-3000" },
    { label: "$3,000 – $7,500", value: "3000-7500" },
    { label: "$7,500 – $15,000", value: "7500-15000" },
    { label: "Over $15,000", value: "15000+" },
  ],
  GBP: [
    { label: "Under £800", value: "0-800" },
    { label: "£800 – £2,500", value: "800-2500" },
    { label: "£2,500 – £6,000", value: "2500-6000" },
    { label: "£6,000 – £12,000", value: "6000-12000" },
    { label: "Over £12,000", value: "12000+" },
  ],
  EUR: [
    { label: "Under €900", value: "0-900" },
    { label: "€900 – €2,800", value: "900-2800" },
    { label: "€2,800 – €7,000", value: "2800-7000" },
    { label: "€7,000 – €14,000", value: "7000-14000" },
    { label: "Over €14,000", value: "14000+" },
  ],
  GHS: [
    { label: "Under ₵2,000", value: "0-2000" },
    { label: "₵2,000 – ₵5,000", value: "2000-5000" },
    { label: "₵5,000 – ₵12,000", value: "5000-12000" },
    { label: "₵12,000 – ₵25,000", value: "12000-25000" },
    { label: "Over ₵25,000", value: "25000+" },
  ],
  KES: [
    { label: "Under KSh 15k", value: "0-15000" },
    { label: "KSh 15k – 50k", value: "15000-50000" },
    { label: "KSh 50k – 150k", value: "50000-150000" },
    { label: "KSh 150k – 300k", value: "150000-300000" },
    { label: "Over KSh 300k", value: "300000+" },
  ],
  ZAR: [
    { label: "Under R5,000", value: "0-5000" },
    { label: "R5,000 – R15,000", value: "5000-15000" },
    { label: "R15,000 – R40,000", value: "15000-40000" },
    { label: "R40,000 – R80,000", value: "40000-80000" },
    { label: "Over R80,000", value: "80000+" },
  ],
};

const WRAPPER_HEIGHT = 40;
const ACTIVE_DOT = 22;
const INACTIVE_DOT = 12;
const H_PAD = ACTIVE_DOT / 2;

interface Props {
  value: string;
  currency: Currency;
  onChange: (v: string) => void;
}

export default function IncomeSlider({ value, currency, onChange }: Props) {
  const colors = useThemeColors();
  const [wrapperWidth, setWrapperWidth] = useState(0);

  const tiers = INCOMES_BY_CURRENCY[currency] ?? INCOMES_BY_CURRENCY.NGN;
  const activeIdx = tiers.findIndex((i) => i.value === value);
  const safeIdx = activeIdx >= 0 ? activeIdx : 0;
  const fillPct = safeIdx / (tiers.length - 1);

  const handleLayout = (e: LayoutChangeEvent) => {
    setWrapperWidth(e.nativeEvent.layout.width);
  };

  const span = Math.max(0, wrapperWidth - H_PAD * 2);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        Roughly, how much comes in each month?
      </Text>
      <Text style={[styles.hint, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
        We'll never share this. It just helps Iris give better advice.
      </Text>

      <Text style={[styles.currentValue, { color: colors.primary, fontFamily: FONTS.bold }]}>
        {tiers[safeIdx].label}
      </Text>

      <View style={styles.trackWrapper} onLayout={handleLayout}>
        {/* Background track */}
        <View
          style={[
            styles.trackBg,
            { backgroundColor: colors.surface2, left: H_PAD, right: H_PAD },
          ]}
        />
        {/* Filled track */}
        <View
          style={[
            styles.trackFill,
            {
              backgroundColor: colors.primary,
              left: H_PAD,
              width: span * fillPct,
            },
          ]}
        />

        {/* Step dots */}
        {wrapperWidth > 0 &&
          tiers.map((tier, i) => {
            const isActive = i === safeIdx;
            const isPast = i <= safeIdx;
            const dotSize = isActive ? ACTIVE_DOT : INACTIVE_DOT;
            const cx = H_PAD + (i / (tiers.length - 1)) * span;
            const top = (WRAPPER_HEIGHT - dotSize) / 2;

            return (
              <Pressable
                key={tier.value}
                onPress={() => onChange(tier.value)}
                hitSlop={10}
                style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    left: cx - dotSize / 2,
                    top,
                    backgroundColor: isPast ? colors.primary : colors.surface2,
                    borderWidth: isActive ? 4 : 0,
                    borderColor: colors.surface,
                    shadowColor: isActive ? colors.primary : "transparent",
                    elevation: isActive ? 4 : 0,
                  },
                ]}
              />
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 28 },
  sectionLabel: { fontSize: 14, marginBottom: 4 },
  hint: { fontSize: 12, marginBottom: 14 },
  currentValue: { fontSize: 22, marginBottom: 14 },
  trackWrapper: {
    height: WRAPPER_HEIGHT,
    justifyContent: "center",
  },
  trackBg: {
    position: "absolute",
    height: 4,
    borderRadius: 99,
    top: (WRAPPER_HEIGHT - 4) / 2,
  },
  trackFill: {
    position: "absolute",
    height: 4,
    borderRadius: 99,
    top: (WRAPPER_HEIGHT - 4) / 2,
  },
  dot: {
    position: "absolute",
    borderRadius: 99,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});
