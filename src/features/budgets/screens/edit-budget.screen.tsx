import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS, CATEGORY_COLORS } from "@/core/common/constants/theme";
import { CATEGORY_LABELS, CATEGORY_ICON_NAMES } from "@/features/transactions/transactions.constants";
import { formatCurrency } from "@/core/common/utils/currency";
import { RootStackParamList } from "@/core/navigation/root-navigator";
import { useBudgetDetail } from "../hooks/use-budget-detail";
import { useUpdateBudget } from "../hooks/use-update-budget";

type RouteProps = RouteProp<RootStackParamList, "EditBudget">;

export default function EditBudgetScreen() {
  const colors = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProps>();
  const { budget, isLoading } = useBudgetDetail(params.budgetId);
  const { form, isUpdating, updateBudget } = useUpdateBudget(params.budgetId);

  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (budget && !initialized) {
      setAmount(String(budget.limitAmount));
      setPeriod(budget.periodType);
      form.setValue("limit_amount", budget.limitAmount);
      form.setValue("period_type", budget.periodType);
      setInitialized(true);
    }
  }, [budget, initialized]);

  function handleAmountChange(text: string) {
    const cleaned = text.replace(/[^0-9.]/g, "");
    setAmount(cleaned);
    const num = parseFloat(cleaned);
    if (!isNaN(num)) form.setValue("limit_amount", num);
  }

  function nudge(delta: number) {
    const current = parseFloat(amount) || 0;
    const next = Math.max(0.01, current + delta);
    const rounded = Math.round(next * 100) / 100;
    setAmount(String(rounded));
    form.setValue("limit_amount", rounded);
  }

  function handlePeriodChange(p: "monthly" | "weekly") {
    setPeriod(p);
    form.setValue("period_type", p);
  }

  async function handleSave() {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid budget limit.");
      return;
    }
    await updateBudget();
    navigation.goBack();
  }

  if (isLoading || !budget) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
        <View style={styles.loader}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const catColor = CATEGORY_COLORS[budget.category] ?? colors.textSubtle;
  const iconName = (CATEGORY_ICON_NAMES[budget.category] ?? "ellipsis-horizontal-outline") as React.ComponentProps<typeof Ionicons>["name"];
  const catLabel = CATEGORY_LABELS[budget.category] ?? budget.category;
  const parsedAmount = parseFloat(amount) || 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
            Edit Budget
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Category identity */}
          <View style={[styles.categoryRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.categoryIcon, { backgroundColor: catColor + "22" }]}>
              <Ionicons name={iconName} size={22} color={catColor} />
            </View>
            <View>
              <Text style={[styles.categoryLabel, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                {catLabel}
              </Text>
              <Text style={[styles.categoryMeta, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                {formatCurrency(budget.spent, budget.currency)} spent this {period}
              </Text>
            </View>
          </View>

          {/* Amount section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
              MONTHLY LIMIT
            </Text>
            <View style={[styles.amountRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Pressable onPress={() => nudge(-10)} style={[styles.nudgeBtn, { backgroundColor: colors.surface2 }]}>
                <Ionicons name="remove" size={18} color={colors.textPrimary} />
              </Pressable>
              <TextInput
                style={[styles.amountInput, { color: colors.textPrimary, fontFamily: FONTS.bold }]}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.textSubtle}
                selectTextOnFocus
              />
              <Pressable onPress={() => nudge(10)} style={[styles.nudgeBtn, { backgroundColor: colors.surface2 }]}>
                <Ionicons name="add" size={18} color={colors.textPrimary} />
              </Pressable>
            </View>
            <Text style={[styles.currencyHint, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
              {budget.currency}
            </Text>
          </View>

          {/* Period type */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
              RESETS EVERY
            </Text>
            <View style={styles.periodRow}>
              {(["monthly", "weekly"] as const).map((p) => (
                <Pressable
                  key={p}
                  onPress={() => handlePeriodChange(p)}
                  style={[
                    styles.periodBtn,
                    {
                      backgroundColor: period === p ? colors.primary : colors.surface,
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
          </View>

          {/* Summary */}
          {parsedAmount > 0 && (
            <View style={[styles.summaryCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary + "33" }]}>
              <Ionicons name="sparkles" size={13} color={colors.primary} />
              <Text style={[styles.summaryText, { color: colors.textPrimary, fontFamily: FONTS.regular }]}>
                Setting a{" "}
                <Text style={{ fontFamily: FONTS.semiBold }}>{formatCurrency(parsedAmount, budget.currency)}</Text>
                {" "}{period} limit will give you{" "}
                <Text style={{ fontFamily: FONTS.semiBold }}>
                  {formatCurrency(Math.max(0, parsedAmount - budget.spent), budget.currency)}
                </Text>
                {" "}remaining for this {period}.
              </Text>
            </View>
          )}

          {/* Save button */}
          <Pressable
            onPress={handleSave}
            disabled={isUpdating || parsedAmount <= 0}
            style={[
              styles.saveBtn,
              {
                backgroundColor: parsedAmount > 0 ? colors.primary : colors.border,
                opacity: isUpdating ? 0.7 : 1,
              },
            ]}
          >
            {isUpdating ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={[styles.saveBtnLabel, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
                Save changes
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerTitle: { fontSize: FONT_SIZE.h1, letterSpacing: -0.6 },
  content: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl,
    gap: SPACING.xl,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: { fontSize: FONT_SIZE.body, letterSpacing: -0.3 },
  categoryMeta: { fontSize: 12, marginTop: 2 },
  section: { gap: SPACING.sm },
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
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  amountInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 28,
    letterSpacing: -0.8,
    paddingVertical: SPACING.sm,
  },
  currencyHint: { fontSize: 12, textAlign: "center" },
  periodRow: { flexDirection: "row", gap: SPACING.sm },
  periodBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  periodLabel: { fontSize: FONT_SIZE.body },
  summaryCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  summaryText: { flex: 1, fontSize: 14, lineHeight: 22 },
  saveBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  saveBtnLabel: { fontSize: FONT_SIZE.body, letterSpacing: -0.2 },
});
