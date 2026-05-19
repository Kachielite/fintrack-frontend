import React, { useState, useEffect } from "react";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS, CATEGORY_COLORS } from "@/core/common/constants/theme";
import { CATEGORY_LABELS, CATEGORY_ICON_NAMES } from "@/features/transactions/transactions.constants";
import { formatCurrency } from "@/core/common/utils/currency";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { Budget } from "../budgets.interface";
import { BudgetService } from "../budgets.service";

interface Props {
  visible: boolean;
  onClose: () => void;
  budget: Budget;
}

export default function EditBudgetSheet({ visible, onClose, budget }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState(String(budget.limitAmount));
  const [period, setPeriod] = useState<"monthly" | "weekly">(budget.periodType);

  useEffect(() => {
    if (visible) {
      setAmount(String(budget.limitAmount));
      setPeriod(budget.periodType);
    }
  }, [visible, budget.limitAmount, budget.periodType]);

  const mutation = useMutation({
    mutationFn: () =>
      BudgetService.updateBudget(budget.id, {
        limit_amount: parseFloat(amount),
        period_type: period,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGET_DETAIL, budget.id] });
      onClose();
    },
    onError: () => {
      Alert.alert("Error", "Could not save changes. Please try again.");
    },
  });

  function nudge(delta: number) {
    const current = parseFloat(amount) || 0;
    const next = Math.max(0.01, Math.round((current + delta) * 100) / 100);
    setAmount(String(next));
  }

  function handleSave() {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid budget limit.");
      return;
    }
    mutation.mutate();
  }

  const parsedAmount = parseFloat(amount) || 0;
  const catColor = CATEGORY_COLORS[budget.category] ?? colors.textSubtle;
  const iconName = (CATEGORY_ICON_NAMES[budget.category] ?? "ellipsis-horizontal-outline") as React.ComponentProps<typeof Ionicons>["name"];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <DraggableSheet
          style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg }]}
          onClose={onClose}
          handleColor={colors.borderStrong}
        >

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.catIcon, { backgroundColor: catColor + "22" }]}>
              <Ionicons name={iconName} size={18} color={catColor} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              Edit {CATEGORY_LABELS[budget.category]}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Amount input */}
          <View style={styles.body}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
              LIMIT AMOUNT
            </Text>
            <View style={[styles.amountRow, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
              <Pressable onPress={() => nudge(-10)} style={styles.nudgeBtn} hitSlop={8}>
                <Ionicons name="remove" size={20} color={colors.textPrimary} />
              </Pressable>
              <TextInput
                style={[styles.amountInput, { color: colors.textPrimary, fontFamily: FONTS.bold }]}
                value={amount}
                onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ""))}
                keyboardType="decimal-pad"
                selectTextOnFocus
                placeholder="0"
                placeholderTextColor={colors.textSubtle}
              />
              <Pressable onPress={() => nudge(10)} style={styles.nudgeBtn} hitSlop={8}>
                <Ionicons name="add" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
            <Text style={[styles.currencyHint, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
              {budget.currency} · {parsedAmount > 0 ? `${formatCurrency(Math.max(0, parsedAmount - budget.spent), budget.currency)} remaining this ${period}` : "—"}
            </Text>

            {/* Period type */}
            <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontFamily: FONTS.bold, marginTop: SPACING.sm }]}>
              RESETS EVERY
            </Text>
            <View style={styles.periodRow}>
              {(["monthly", "weekly"] as const).map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  style={[
                    styles.periodBtn,
                    {
                      backgroundColor: period === p ? colors.primary : colors.surface2,
                      borderColor: period === p ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.periodLabel,
                      {
                        color: period === p ? colors.onPrimary : colors.textPrimary,
                        fontFamily: period === p ? FONTS.semiBold : FONTS.regular,
                      },
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Save */}
            <Pressable
              onPress={handleSave}
              disabled={mutation.isPending || parsedAmount <= 0}
              style={[
                styles.saveBtn,
                {
                  backgroundColor: parsedAmount > 0 ? colors.primary : colors.border,
                  opacity: mutation.isPending ? 0.7 : 1,
                },
              ]}
            >
              {mutation.isPending ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={[styles.saveBtnLabel, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
                  Save changes
                </Text>
              )}
            </Pressable>
          </View>
        </DraggableSheet>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 99,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  catIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { flex: 1, fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  sectionLabel: { fontSize: 11, letterSpacing: 0.6 },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  nudgeBtn: {
    width: 52,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  amountInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 28,
    letterSpacing: -0.8,
  },
  currencyHint: { fontSize: 12, textAlign: "center" },
  periodRow: { flexDirection: "row", gap: SPACING.sm },
  periodBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  periodLabel: { fontSize: FONT_SIZE.body },
  saveBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  saveBtnLabel: { fontSize: FONT_SIZE.body, letterSpacing: -0.2 },
});
