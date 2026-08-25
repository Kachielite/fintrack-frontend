import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import {
  useThemeColors,
  useIsDark,
} from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import OnboardingProgressBar from "../components/onboarding-progress-bar";
import {
  useCategories,
  getCategoryLabel,
} from "@/features/categories/hooks/use-categories";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { useCreateTransaction } from "@/features/transactions/hooks/use-create-transaction";

const CURRENCIES = [
  { code: "NGN", label: "₦ NGN" },
  { code: "USD", label: "$ USD" },
  { code: "GBP", label: "£ GBP" },
  { code: "EUR", label: "€ EUR" },
  { code: "GHS", label: "₵ GHS" },
  { code: "KES", label: "KSh KES" },
  { code: "ZAR", label: "R ZAR" },
];

export default function OnboardingManualEntryScreen() {
  const colors = useThemeColors();
  const isDark = useIsDark();
  const navigation = useNavigation();
  const { data: allCategories = [] } = useCategories();
  const { accounts } = useAccounts();
  const { createTransaction, isCreating } = useCreateTransaction();

  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );
  const [transactionType, setTransactionType] = useState<"debit" | "credit">(
    "debit",
  );
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  function resetForm() {
    setMerchant("");
    setCategory(null);
    setTransactionType("debit");
    setAmount("");
    setDate(new Date());
  }

  async function handleAdd() {
    const num = parseFloat(amount);
    if (!merchant.trim() || !category || isNaN(num) || num <= 0) {
      Toast.show({
        type: "error",
        text1: "Fill in a description, category, and amount first.",
      });
      return;
    }
    try {
      await createTransaction({
        merchant: merchant.trim(),
        category,
        transaction_type: transactionType,
        amount: num,
        currency,
        transaction_date: date.toISOString(),
        account_id: selectedAccountId ?? undefined,
      });
      setAddedCount((c) => c + 1);
      resetForm();
      Toast.show({ type: "success", text1: "Transaction added" });
    } catch {
      Toast.show({
        type: "error",
        text1: "Could not add that transaction. Try again.",
      });
    }
  }

  function goNext() {
    navigation.navigate("OnboardingGoal" as never);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.progressRow}>
        <OnboardingProgressBar step={1} total={2} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontFamily: FONTS.extraBold },
          ]}
        >
          Add a few transactions to get started
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: colors.textSecondary, fontFamily: FONTS.regular },
          ]}
        >
          You can add as many as you like now, or just a couple to try it out —
          you can always add more later, and connect Gmail anytime from
          Settings.
        </Text>

        {addedCount > 0 && (
          <View
            style={[
              styles.addedBanner,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.success}
            />
            <Text
              style={[
                styles.addedBannerText,
                { color: colors.success, fontFamily: FONTS.semiBold },
              ]}
            >
              {addedCount} transaction{addedCount === 1 ? "" : "s"} added
            </Text>
          </View>
        )}

        {/* Type */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: colors.textPrimary, fontFamily: FONTS.bold },
            ]}
          >
            Type
          </Text>
          <View style={styles.typeRow}>
            <Pressable
              onPress={() => setTransactionType("debit")}
              style={[
                styles.typeBtn,
                {
                  backgroundColor:
                    transactionType === "debit"
                      ? colors.primaryLight
                      : colors.surface,
                  borderColor:
                    transactionType === "debit"
                      ? colors.primary
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
                        ? colors.primary
                        : colors.textPrimary,
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
                      ? colors.primaryLight
                      : colors.surface,
                  borderColor:
                    transactionType === "credit"
                      ? colors.primary
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
                        ? colors.primary
                        : colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
              >
                Income
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: colors.textPrimary, fontFamily: FONTS.bold },
            ]}
          >
            Description
          </Text>
          <TextInput
            value={merchant}
            onChangeText={setMerchant}
            placeholder="e.g. Groceries"
            placeholderTextColor={colors.textSubtle}
            style={[
              styles.textInput,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: colors.textPrimary, fontFamily: FONTS.bold },
            ]}
          >
            Category
          </Text>
          <View style={styles.chipGrid}>
            {allCategories.map((cat) => {
              const active = category === cat.slug;
              return (
                <Pressable
                  key={cat.slug}
                  onPress={() => setCategory(cat.slug)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      {
                        color: active ? colors.onPrimary : colors.textPrimary,
                        fontFamily: FONTS.semiBold,
                      },
                    ]}
                  >
                    {getCategoryLabel(cat.slug, allCategories)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: colors.textPrimary, fontFamily: FONTS.bold },
            ]}
          >
            Account
          </Text>
          <View style={styles.chipGrid}>
            <Pressable
              onPress={() => setSelectedAccountId(null)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    selectedAccountId === null
                      ? colors.primary
                      : colors.surface,
                  borderColor:
                    selectedAccountId === null ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  {
                    color:
                      selectedAccountId === null
                        ? colors.onPrimary
                        : colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
              >
                General Account
              </Text>
            </Pressable>
            {accounts.map((acct) => {
              const active = selectedAccountId === acct.id;
              return (
                <Pressable
                  key={acct.id}
                  onPress={() => setSelectedAccountId(acct.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      {
                        color: active ? colors.onPrimary : colors.textPrimary,
                        fontFamily: FONTS.semiBold,
                      },
                    ]}
                  >
                    {acct.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Amount + currency */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: colors.textPrimary, fontFamily: FONTS.bold },
            ]}
          >
            Amount
          </Text>
          <TextInput
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            placeholderTextColor={colors.textSubtle}
            keyboardType="decimal-pad"
            style={[
              styles.textInput,
              styles.amountInput,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surface,
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
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.currencyChipLabel,
                      {
                        color: active ? colors.onPrimary : colors.textPrimary,
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
              { color: colors.textPrimary, fontFamily: FONTS.bold },
            ]}
          >
            Date
          </Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[
              styles.dateTrigger,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.textSubtle}
            />
            <Text
              style={[
                styles.dateValue,
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
              themeVariant={isDark ? "dark" : "light"}
              maximumDate={new Date()}
              onChange={(_event, selected) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selected) setDate(selected);
              }}
            />
          )}
        </View>

        <Pressable
          onPress={handleAdd}
          disabled={isCreating}
          style={[styles.addBtn, { borderColor: colors.primary }]}
        >
          {isCreating ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text
                style={[
                  styles.addBtnLabel,
                  { color: colors.primary, fontFamily: FONTS.semiBold },
                ]}
              >
                Add this transaction
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={goNext}
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
        >
          <Text
            style={[
              styles.primaryBtnText,
              { color: colors.onPrimary, fontFamily: FONTS.semiBold },
            ]}
          >
            {addedCount > 0 ? "Continue" : "Skip for now"}
          </Text>
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
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  title: { fontSize: FONT_SIZE.h1 - 2, letterSpacing: -0.5, lineHeight: 34 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  addedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
  },
  addedBannerText: { fontSize: 13 },
  section: { gap: SPACING.sm },
  label: { fontSize: 14 },
  typeRow: { flexDirection: "row", gap: SPACING.sm },
  typeBtn: {
    flex: 1,
    height: 46,
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
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 99,
    borderWidth: 1.5,
  },
  chipLabel: { fontSize: 13 },
  currencyScroll: { marginTop: SPACING.xs },
  currencyChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
    marginRight: 8,
  },
  currencyChipLabel: { fontSize: 13 },
  dateTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    height: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
  },
  dateValue: { fontSize: 15 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  addBtnLabel: { fontSize: 14 },
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
