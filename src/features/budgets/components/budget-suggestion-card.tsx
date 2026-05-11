import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { BudgetSuggestion } from "../budgets.interface";
import { BudgetService } from "../budgets.service";
import { formatCurrency } from "@/core/common/utils/currency";

interface Props {
  suggestion: BudgetSuggestion;
  onDismiss: () => void;
}

export default function BudgetSuggestionCard({ suggestion, onDismiss }: Props) {
  const colors = useThemeColors();
  const queryClient = useQueryClient();

  const { mutate: acceptSuggestion, isPending } = useMutation({
    mutationFn: () =>
      BudgetService.createBudget({
        category: suggestion.category,
        limit_amount: suggestion.suggestedLimit,
        currency: "NGN",
        period_type: "monthly",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      Toast.show({ type: "success", text1: "Budget created!" });
      onDismiss();
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Could not create budget. Try again." });
    },
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderStrong,
        },
      ]}
    >
      {/* Label */}
      <View style={styles.labelRow}>
        <Ionicons name="sparkles" size={12} color={colors.primary} />
        <Text
          style={[
            styles.label,
            { color: colors.primary, fontFamily: FONTS.bold },
          ]}
        >
          SUGGESTED FOR YOU
        </Text>
      </View>

      {/* Message */}
      <Text
        style={[
          styles.message,
          { color: colors.textPrimary, fontFamily: FONTS.medium },
        ]}
      >
        {suggestion.message ||
          `Based on your last 3 months, a ${formatCurrency(suggestion.suggestedLimit, "NGN")} budget seems realistic. Want to set it?`}
      </Text>

      {/* Action buttons */}
      <View style={styles.actions}>
        {/* Accept */}
        <Pressable
          onPress={() => acceptSuggestion()}
          disabled={isPending}
          style={[
            styles.btn,
            styles.btnPrimary,
            { backgroundColor: colors.primary, opacity: isPending ? 0.7 : 1 },
          ]}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text
              style={[
                styles.btnText,
                { color: colors.onPrimary, fontFamily: FONTS.semiBold },
              ]}
            >
              Accept {formatCurrency(suggestion.suggestedLimit, "NGN")}
            </Text>
          )}
        </Pressable>

        {/* Dismiss */}
        <Pressable
          onPress={onDismiss}
          style={[
            styles.btn,
            styles.btnGhost,
            { borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.btnText,
              { color: colors.textSecondary, fontFamily: FONTS.semiBold },
            ]}
          >
            Not now
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderStyle: "dashed",
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  label: { fontSize: 11, letterSpacing: 0.8 },
  message: {
    fontSize: FONT_SIZE.body - 1,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    flexWrap: "wrap",
  },
  btn: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
  },
  btnPrimary: {},
  btnGhost: { borderWidth: 1 },
  btnText: { fontSize: 13 },
});

