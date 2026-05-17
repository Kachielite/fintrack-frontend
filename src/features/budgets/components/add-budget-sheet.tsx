import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  CATEGORY_COLORS,
  FALLBACK_CATEGORY_COLOR,
} from "@/core/common/constants/theme";
import { CATEGORY_ICON_NAMES } from "@/features/transactions/transactions.constants";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { useCategories, getCategoryLabel } from "@/features/categories/hooks/use-categories";
import { useBudgets } from "../hooks/use-budgets";
import { useUserStore } from "@/features/user/user.state";
import { BudgetService } from "../budgets.service";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AddBudgetSheet({ visible, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const { data: allCategories = [] } = useCategories();
  const { budgets } = useBudgets();
  const refCurrency = useUserStore((s) => s.profile?.refCurrency ?? "NGN");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly");
  const [catPickerOpen, setCatPickerOpen] = useState(false);

  const pickerY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // One budget per category — exclude already-budgeted ones
  const budgetedSlugs = new Set(budgets.map((b) => b.category));
  const availableCategories = allCategories.filter(
    (cat) => cat.slug !== "uncategorized" && !budgetedSlugs.has(cat.slug),
  );

  const { mutate: createBudget, isPending } = useMutation({
    mutationFn: () =>
      BudgetService.createBudget({
        category: selectedCategory!,
        limit_amount: parseFloat(amount),
        currency: refCurrency,
        period_type: period,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      Toast.show({ type: "success", text1: "Budget created!" });
      handleClose();
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Could not create budget. Try again." });
    },
  });

  function handleClose() {
    setSelectedCategory(null);
    setAmount("");
    setPeriod("monthly");
    onClose();
  }

  function openPicker() {
    setCatPickerOpen(true);
    Animated.spring(pickerY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }

  function closePicker() {
    Animated.timing(pickerY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setCatPickerOpen(false));
  }

  function selectCategory(slug: string) {
    setSelectedCategory(slug);
    closePicker();
  }

  function handleAmountChange(text: string) {
    setAmount(text.replace(/[^0-9.]/g, ""));
  }

  function nudge(delta: number) {
    const current = parseFloat(amount) || 0;
    setAmount(String(Math.max(0, Math.round(current + delta))));
  }

  function handleSubmit() {
    if (!selectedCategory) {
      Alert.alert("Select a category", "Please pick a category for this budget.");
      return;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid budget limit.");
      return;
    }
    createBudget();
  }

  const parsedAmount = parseFloat(amount) || 0;
  const catColor = selectedCategory
    ? (CATEGORY_COLORS[selectedCategory] ?? FALLBACK_CATEGORY_COLOR)
    : colors.border;
  const catIcon = selectedCategory
    ? ((CATEGORY_ICON_NAMES[selectedCategory] ?? "ellipsis-horizontal-outline") as React.ComponentProps<typeof Ionicons>["name"])
    : ("grid-outline" as React.ComponentProps<typeof Ionicons>["name"]);
  const catLabel = selectedCategory ? getCategoryLabel(selectedCategory, allCategories) : null;
  const canCreate = !!selectedCategory && parsedAmount > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* ── Main sheet ───────────────────────────────────────────── */}
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              Add Budget
            </Text>
            <Pressable
              onPress={handleClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Scrollable form */}
          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Category dropdown */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
                CATEGORY
              </Text>
              <Pressable
                onPress={openPicker}
                style={[
                  styles.dropdownTrigger,
                  {
                    backgroundColor: colors.background,
                    borderColor: selectedCategory ? catColor : colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.catChipIcon,
                    { backgroundColor: selectedCategory ? catColor + "22" : colors.surface2 },
                  ]}
                >
                  <Ionicons
                    name={catIcon}
                    size={16}
                    color={selectedCategory ? catColor : colors.textSubtle}
                  />
                </View>
                <Text
                  style={[
                    styles.dropdownText,
                    {
                      color: selectedCategory ? colors.textPrimary : colors.textSubtle,
                      fontFamily: selectedCategory ? FONTS.semiBold : FONTS.regular,
                      flex: 1,
                    },
                  ]}
                >
                  {catLabel ?? "Select a category"}
                </Text>
                <Ionicons name="chevron-down-outline" size={16} color={colors.textSubtle} />
              </Pressable>
              {availableCategories.length === 0 && (
                <Text style={[styles.allBudgetedNote, { color: colors.textSubtle }]}>
                  All categories already have a budget.
                </Text>
              )}
            </View>

            {/* Amount */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
                {period === "monthly" ? "MONTHLY" : "WEEKLY"} LIMIT
              </Text>
              <View
                style={[
                  styles.amountRow,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Pressable
                  onPress={() => nudge(-1000)}
                  style={[styles.nudgeBtn, { backgroundColor: colors.surface2 }]}
                >
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
                <Pressable
                  onPress={() => nudge(1000)}
                  style={[styles.nudgeBtn, { backgroundColor: colors.surface2 }]}
                >
                  <Ionicons name="add" size={18} color={colors.textPrimary} />
                </Pressable>
              </View>
              <Text style={[styles.currencyHint, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                {refCurrency}
              </Text>
            </View>

            {/* Period */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
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
                        backgroundColor: period === p ? colors.primary : colors.background,
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
            {selectedCategory && parsedAmount > 0 && (
              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: catColor + "15", borderColor: catColor + "40" },
                ]}
              >
                <View style={[styles.summaryIcon, { backgroundColor: catColor + "22" }]}>
                  <Ionicons name={catIcon} size={14} color={catColor} />
                </View>
                <Text
                  style={[styles.summaryText, { color: colors.textPrimary, fontFamily: FONTS.regular }]}
                >
                  <Text style={{ fontFamily: FONTS.semiBold }}>{catLabel}</Text>
                  {" "}budget of{" "}
                  <Text style={{ fontFamily: FONTS.mono }}>
                    {refCurrency} {parsedAmount.toLocaleString()}
                  </Text>
                  {" "}per {period === "monthly" ? "month" : "week"}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Sticky create button */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Pressable
              onPress={handleSubmit}
              disabled={!canCreate || isPending}
              style={[
                styles.createBtn,
                { backgroundColor: canCreate ? colors.primary : colors.border },
              ]}
            >
              {isPending ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text
                  style={[styles.createBtnLabel, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}
                >
                  Create budget
                </Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* ── Category picker (overlay inside same Modal) ───────────── */}
      {catPickerOpen && (
        <View style={[StyleSheet.absoluteFillObject, styles.pickerOverlay]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={closePicker} />
          <Animated.View
            style={[
              styles.pickerSheet,
              {
                backgroundColor: colors.surface,
                paddingBottom: insets.bottom + SPACING.lg,
                transform: [{ translateY: pickerY }],
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

            <View style={styles.pickerHeader}>
              <Text
                style={[styles.pickerTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}
              >
                Select Category
              </Text>
              <Pressable
                onPress={closePicker}
                hitSlop={12}
                style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.pickerList}
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.pickerListContainer, { borderColor: colors.border }]}>
                {availableCategories.map((cat, i, arr) => {
                  const active = selectedCategory === cat.slug;
                  const tileColor = CATEGORY_COLORS[cat.slug] ?? FALLBACK_CATEGORY_COLOR;
                  const icon = (CATEGORY_ICON_NAMES[cat.slug] ??
                    "ellipsis-horizontal-outline") as React.ComponentProps<typeof Ionicons>["name"];
                  return (
                    <Pressable
                      key={cat.slug}
                      onPress={() => selectCategory(cat.slug)}
                      style={[
                        styles.pickerRow,
                        {
                          backgroundColor: active ? tileColor + "12" : "transparent",
                          borderBottomWidth: i < arr.length - 1 ? StyleSheet.hairlineWidth : 0,
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <View style={[styles.pickerRowIcon, { backgroundColor: tileColor + "22" }]}>
                        <Ionicons name={icon} size={16} color={tileColor} />
                      </View>
                      <Text
                        style={[
                          styles.pickerRowName,
                          {
                            color: active ? tileColor : colors.textPrimary,
                            fontFamily: active ? FONTS.semiBold : FONTS.regular,
                          },
                        ]}
                      >
                        {cat.name}
                      </Text>
                      {active && (
                        <Ionicons name="checkmark-circle" size={18} color={tileColor} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.9,
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
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.base,
    gap: SPACING.lg,
  },
  section: { gap: SPACING.sm },
  label: { fontSize: 11, letterSpacing: 0.6 },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  catChipIcon: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownText: { fontSize: 15 },
  allBudgetedNote: { fontSize: 13, fontStyle: "italic" },
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
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  summaryText: { flex: 1, fontSize: 14, lineHeight: 22 },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  createBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
  },
  createBtnLabel: { fontSize: FONT_SIZE.body, letterSpacing: -0.2 },
  // Picker overlay
  pickerOverlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  pickerSheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    height: SCREEN_HEIGHT * 0.75,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  pickerTitle: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  pickerList: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.base,
  },
  pickerListContainer: {
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
  },
  pickerRowIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerRowName: { flex: 1, fontSize: 14 },
});
