import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { UserService } from "../user.service";
import { UserProfile } from "../user.interface";
import GoalSelector from "@/features/onboarding/components/goal-selector";
import IncomeSlider, { INCOMES_BY_CURRENCY } from "@/features/onboarding/components/income-slider";
import PayFrequencyGrid from "@/features/onboarding/components/pay-frequency-grid";
import { CompleteOnboardingSchemaType } from "@/features/onboarding/onboarding.dto";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type GoalType = CompleteOnboardingSchemaType["goal_type"];
type PayFrequency = CompleteOnboardingSchemaType["pay_frequency"];
type Currency = CompleteOnboardingSchemaType["ref_currency"];

export type FinancialProfileField = "goal" | "income" | "pay_frequency";

const TITLES: Record<FinancialProfileField, string> = {
  goal: "Goal",
  income: "Monthly income",
  pay_frequency: "Pay frequency",
};

interface Props {
  field: FinancialProfileField | null;
  profile: UserProfile | undefined;
  onClose: () => void;
}

export default function FinancialProfileSheet({ field, profile, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const visible = field !== null;

  const currency = (profile?.refCurrency as Currency) ?? "NGN";
  const tiers = INCOMES_BY_CURRENCY[currency] ?? INCOMES_BY_CURRENCY.NGN;

  const [goalType, setGoalType] = useState<GoalType>("save");
  const [incomeRange, setIncomeRange] = useState<string>(tiers[0].value);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>("monthly");

  // Re-seed every time the sheet opens so a cancelled edit never lingers —
  // deliberately not depending on `profile` so an in-progress edit isn't
  // clobbered if the profile query happens to refetch while the sheet is open.
  useEffect(() => {
    if (!visible) return;
    setGoalType((profile?.goalType as GoalType) ?? "save");
    setIncomeRange(profile?.incomeRange ?? tiers[0].value);
    setPayFrequency((profile?.payFrequency as PayFrequency) ?? "monthly");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const saveMutation = useMutation({
    mutationFn: () => {
      if (field === "goal") return UserService.updateProfile({ goal_type: goalType });
      if (field === "income") return UserService.updateProfile({ income_range: incomeRange });
      return UserService.updateProfile({ pay_frequency: payFrequency });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
      onClose();
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={sheet.overlay}>
        <Pressable style={sheet.backdrop} onPress={onClose} />

        <DraggableSheet
          style={[sheet.panel, { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg }]}
          onClose={onClose}
          handleColor={colors.borderStrong}
        >
          <View style={sheet.header}>
            <Text style={[sheet.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              {field ? TITLES[field] : ""}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} style={[sheet.closeBtn, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={sheet.body}
            showsVerticalScrollIndicator={false}
          >
            {field === "goal" && <GoalSelector value={goalType} onChange={setGoalType} />}
            {field === "income" && <IncomeSlider value={incomeRange} currency={currency} onChange={setIncomeRange} />}
            {field === "pay_frequency" && <PayFrequencyGrid value={payFrequency} onChange={setPayFrequency} />}
          </ScrollView>

          <View style={[sheet.footer, { borderTopColor: colors.border }]}>
            <Pressable
              onPress={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              style={[
                sheet.saveBtn,
                { backgroundColor: colors.primary, opacity: saveMutation.isPending ? 0.7 : 1 },
              ]}
            >
              {saveMutation.isPending ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={[sheet.saveBtnText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
                  Save changes
                </Text>
              )}
            </Pressable>
          </View>
        </DraggableSheet>
      </View>
    </Modal>
  );
}

const sheet = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  panel: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: { width: 34, height: 34, borderRadius: 99, alignItems: "center", justifyContent: "center" },
  body: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveBtn: {
    height: 52,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: { fontSize: 16 },
});
