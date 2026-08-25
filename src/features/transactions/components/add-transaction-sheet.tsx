import React, { useState, useRef } from "react";
import DraggableSheet from "@/core/common/components/DraggableSheet";
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
import DateTimePicker from "@react-native-community/datetimepicker";
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
import {
  useCategories,
  getCategoryLabel,
} from "@/features/categories/hooks/use-categories";
import { useCreateTransaction } from "../hooks/use-create-transaction";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const CURRENCIES = [
  { code: "NGN", label: "₦ NGN" },
  { code: "USD", label: "$ USD" },
  { code: "GBP", label: "£ GBP" },
  { code: "EUR", label: "€ EUR" },
  { code: "GHS", label: "₵ GHS" },
  { code: "KES", label: "KSh KES" },
  { code: "ZAR", label: "R ZAR" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  defaultCurrency?: string;
  onImportCsv?: () => void;
}

export default function AddTransactionSheet({
  visible,
  onClose,
  defaultCurrency,
  onImportCsv,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const { data: allCategories = [] } = useCategories();
  const { createTransaction, isCreating } = useCreateTransaction();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<"debit" | "credit">(
    "debit",
  );
  const [currency, setCurrency] = useState(defaultCurrency ?? "NGN");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [catPickerOpen, setCatPickerOpen] = useState(false);

  const pickerY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  function handleClose() {
    setSelectedCategory(null);
    setMerchant("");
    setAmount("");
    setTransactionType("debit");
    setCurrency(defaultCurrency ?? "NGN");
    setDate(new Date());
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

  async function handleSubmit() {
    if (!merchant.trim()) {
      Alert.alert("Add a description", "What was this transaction for?");
      return;
    }
    if (!selectedCategory) {
      Alert.alert(
        "Select a category",
        "Please pick a category for this transaction.",
      );
      return;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return;
    }
    try {
      await createTransaction({
        merchant: merchant.trim(),
        category: selectedCategory,
        transaction_type: transactionType,
        amount: num,
        currency,
        transaction_date: date.toISOString(),
      });
      Toast.show({ type: "success", text1: "Transaction added!" });
      handleClose();
    } catch {
      Toast.show({
        type: "error",
        text1: "Could not add transaction. Try again.",
      });
    }
  }

  const parsedAmount = parseFloat(amount) || 0;
  const catColor = selectedCategory
    ? (CATEGORY_COLORS[selectedCategory] ?? FALLBACK_CATEGORY_COLOR)
    : colors.border;
  const catIcon = selectedCategory
    ? ((CATEGORY_ICON_NAMES[selectedCategory] ??
        "ellipsis-horizontal-outline") as React.ComponentProps<
        typeof Ionicons
      >["name"])
    : ("grid-outline" as React.ComponentProps<typeof Ionicons>["name"]);
  const catLabel = selectedCategory
    ? getCategoryLabel(selectedCategory, allCategories)
    : null;
  const canCreate =
    !!merchant.trim() && !!selectedCategory && parsedAmount > 0 && !isCreating;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <DraggableSheet
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, paddingBottom: insets.bottom },
          ]}
          onClose={handleClose}
          handleColor={colors.borderStrong}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontFamily: FONTS.bold },
                ]}
              >
                Add Transaction
              </Text>
              <Pressable
                onPress={handleClose}
                hitSlop={12}
                style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Type toggle */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontFamily: FONTS.bold },
                  ]}
                >
                  TYPE
                </Text>
                <View style={styles.typeRow}>
                  <Pressable
                    onPress={() => setTransactionType("debit")}
                    style={[
                      styles.typeBtn,
                      {
                        backgroundColor:
                          transactionType === "debit"
                            ? colors.error + "1A"
                            : colors.background,
                        borderColor:
                          transactionType === "debit"
                            ? colors.error
                            : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeLabel,
                        {
                          color:
                            transactionType === "debit"
                              ? colors.error
                              : colors.textSecondary,
                          fontFamily: FONTS.semiBold,
                        },
                      ]}
                    >
                      Expense
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setTransactionType("credit")}
                    style={[
                      styles.typeBtn,
                      {
                        backgroundColor:
                          transactionType === "credit"
                            ? colors.success + "1A"
                            : colors.background,
                        borderColor:
                          transactionType === "credit"
                            ? colors.success
                            : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeLabel,
                        {
                          color:
                            transactionType === "credit"
                              ? colors.success
                              : colors.textSecondary,
                          fontFamily: FONTS.semiBold,
                        },
                      ]}
                    >
                      Income
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Merchant / description */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontFamily: FONTS.bold },
                  ]}
                >
                  DESCRIPTION
                </Text>
                <TextInput
                  value={merchant}
                  onChangeText={setMerchant}
                  placeholder="e.g. Coffee shop"
                  placeholderTextColor={colors.textSubtle}
                  style={[
                    styles.textInput,
                    {
                      color: colors.textPrimary,
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                />
              </View>

              {/* Category dropdown */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontFamily: FONTS.bold },
                  ]}
                >
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
                      {
                        backgroundColor: selectedCategory
                          ? catColor + "22"
                          : colors.surface2,
                      },
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
                      styles.dropdownValue,
                      {
                        color: selectedCategory
                          ? colors.textPrimary
                          : colors.textSubtle,
                        fontFamily: FONTS.semiBold,
                      },
                    ]}
                  >
                    {catLabel ?? "Select a category"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.textSubtle}
                  />
                </Pressable>
              </View>

              {/* Amount + currency */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontFamily: FONTS.bold },
                  ]}
                >
                  AMOUNT
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSubtle}
                  keyboardType="decimal-pad"
                  style={[
                    styles.textInput,
                    styles.amountInput,
                    {
                      color: colors.textPrimary,
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.currencyScroll}
                >
                  {CURRENCIES.map((c) => {
                    const active = currency === c.code;
                    return (
                      <Pressable
                        key={c.code}
                        onPress={() => setCurrency(c.code)}
                        style={[
                          styles.currencyChip,
                          {
                            backgroundColor: active
                              ? colors.primary
                              : colors.background,
                            borderColor: active
                              ? colors.primary
                              : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.currencyChipLabel,
                            {
                              color: active
                                ? colors.onPrimary
                                : colors.textPrimary,
                              fontFamily: FONTS.semiBold,
                            },
                          ]}
                        >
                          {c.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Date */}
              <View style={styles.section}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontFamily: FONTS.bold },
                  ]}
                >
                  DATE
                </Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    styles.dropdownTrigger,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={colors.textSubtle}
                  />
                  <Text
                    style={[
                      styles.dropdownValue,
                      { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    {date.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    maximumDate={new Date()}
                    onChange={(_event, selected) => {
                      setShowDatePicker(Platform.OS === "ios");
                      if (selected) setDate(selected);
                    }}
                  />
                )}
              </View>

              {/* Submit */}
              <Pressable
                onPress={handleSubmit}
                disabled={!canCreate}
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor: canCreate ? colors.primary : colors.border,
                  },
                ]}
              >
                {isCreating ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text
                    style={[
                      styles.submitLabel,
                      { color: colors.onPrimary, fontFamily: FONTS.bold },
                    ]}
                  >
                    Add Transaction
                  </Text>
                )}
              </Pressable>

              {onImportCsv && (
                <Pressable onPress={onImportCsv} style={styles.importLink}>
                  <Ionicons
                    name="document-attach-outline"
                    size={15}
                    color={colors.textSubtle}
                  />
                  <Text
                    style={[
                      styles.importLinkLabel,
                      { color: colors.textSubtle, fontFamily: FONTS.medium },
                    ]}
                  >
                    Or import multiple from a CSV file
                  </Text>
                </Pressable>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </DraggableSheet>
      </View>

      {/* Category picker overlay */}
      {catPickerOpen && (
        <View style={styles.pickerOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closePicker} />
          <Animated.View
            style={[
              styles.pickerSheet,
              {
                backgroundColor: colors.surface,
                transform: [{ translateY: pickerY }],
              },
            ]}
          >
            <View style={styles.pickerHeader}>
              <Text
                style={[
                  styles.pickerTitle,
                  { color: colors.textPrimary, fontFamily: FONTS.bold },
                ]}
              >
                Select category
              </Text>
              <Pressable
                onPress={closePicker}
                hitSlop={12}
                style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}>
              {allCategories.map((cat) => {
                const color =
                  CATEGORY_COLORS[cat.slug] ?? FALLBACK_CATEGORY_COLOR;
                const icon = (CATEGORY_ICON_NAMES[cat.slug] ??
                  "ellipsis-horizontal-outline") as React.ComponentProps<
                  typeof Ionicons
                >["name"];
                return (
                  <Pressable
                    key={cat.slug}
                    onPress={() => selectCategory(cat.slug)}
                    style={styles.pickerRow}
                  >
                    <View
                      style={[
                        styles.catChipIcon,
                        { backgroundColor: color + "22" },
                      ]}
                    >
                      <Ionicons name={icon} size={16} color={color} />
                    </View>
                    <Text
                      style={[
                        styles.pickerRowLabel,
                        { color: colors.textPrimary, fontFamily: FONTS.medium },
                      ]}
                    >
                      {getCategoryLabel(cat.slug, allCategories)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "88%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: { fontSize: FONT_SIZE.h3 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },
  section: { gap: SPACING.sm },
  label: { fontSize: 11, letterSpacing: 0.6 },
  typeRow: { flexDirection: "row", gap: SPACING.sm },
  typeBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  typeLabel: { fontSize: 14 },
  textInput: {
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
  },
  amountInput: { fontSize: 20, fontFamily: FONTS.bold },
  currencyScroll: { marginTop: SPACING.xs },
  currencyChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
    marginRight: 8,
  },
  currencyChipLabel: { fontSize: 13 },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
  },
  catChipIcon: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownValue: { flex: 1, fontSize: 15 },
  submitBtn: {
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
  },
  submitLabel: { fontSize: 16 },
  importLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: SPACING.sm,
  },
  importLinkLabel: { fontSize: 13 },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  pickerSheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingBottom: SPACING.xl,
    maxHeight: "70%",
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  pickerTitle: { fontSize: FONT_SIZE.h3 },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  pickerRowLabel: { fontSize: 15 },
});
