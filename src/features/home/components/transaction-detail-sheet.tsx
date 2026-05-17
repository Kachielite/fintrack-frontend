import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  CATEGORY_COLORS,
  FALLBACK_CATEGORY_COLOR,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { Transaction } from "@/features/transactions/transactions.interface";
import { TransactionService } from "@/features/transactions/transactions.service";
import {
  CATEGORY_ICON_NAMES,
  getCategoryIconName,
} from "@/features/transactions/transactions.constants";
import { formatTransactionAmount } from "@/core/common/utils/currency";
import { formatDate, formatTime } from "@/core/common/utils/date";
import {
  useCategories,
  getCategoryLabel,
} from "@/features/categories/hooks/use-categories";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export default function TransactionDetailSheet({ visible, onClose, transaction }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();

  const isReview = transaction.status === "unverified";
  const [savedCategory, setSavedCategory] = useState<string>(transaction.category);
  const [savedMerchant, setSavedMerchant] = useState<string>(transaction.merchant);
  const [reviewDone, setReviewDone] = useState(false);
  const [confirmedCategory, setConfirmedCategory] = useState<string | null>(null);
  const [similarDismissed, setSimilarDismissed] = useState(false);

  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editMerchantDraft, setEditMerchantDraft] = useState<string>(transaction.merchant);
  const [editCatDraft, setEditCatDraft] = useState<string>(transaction.category);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const editSheetY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const showReviewBanner = isReview && !reviewDone;

  const saveMutation = useMutation({
    mutationFn: (payload: { merchant?: string; category?: string }) =>
      TransactionService.correctTransaction(transaction.id, payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      if (payload.merchant) setSavedMerchant(payload.merchant);
      if (payload.category) {
        const prevCategory = savedCategory;
        setSavedCategory(payload.category);
        setReviewDone(true);
        if (payload.category !== prevCategory) {
          setConfirmedCategory(payload.category);
        }
      }
      dismissEditSheet();
    },
  });

  const { data: similarTransactions = [] } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION_DETAIL, transaction.id, "similar"],
    queryFn: () => TransactionService.getSimilarTransactions(transaction.id),
    enabled: confirmedCategory !== null && !similarDismissed,
    staleTime: Infinity,
  });

  const bulkMutation = useMutation({
    mutationFn: (ids: number[]) =>
      TransactionService.bulkCorrectCategory(ids, confirmedCategory!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      setSimilarDismissed(true);
    },
  });

  const showSimilarBanner =
    confirmedCategory !== null && !similarDismissed && similarTransactions.length > 0;

  const isCredit = transaction.transactionType === "credit";
  const showRef = transaction.currency !== transaction.refCurrency;

  const catColor = CATEGORY_COLORS[savedCategory] ?? FALLBACK_CATEGORY_COLOR;
  const iconName = getCategoryIconName(savedCategory) as React.ComponentProps<typeof Ionicons>["name"];
  const displayCategoryLabel = getCategoryLabel(savedCategory, categories);

  const otherRows: [string, string][] = [
    ["Currency", transaction.currency],
    ["Date", formatDate(transaction.transactionDate)],
    ["Time", formatTime(transaction.transactionDate)],
  ];
  if (transaction.bankName) otherRows.unshift(["Bank", transaction.bankName]);
  if (transaction.reference) otherRows.push(["Reference", transaction.reference]);

  function openEditSheet() {
    setEditMerchantDraft(savedMerchant);
    setEditCatDraft(savedCategory);
    setCatDropdownOpen(false);
    setEditSheetOpen(true);
    Animated.spring(editSheetY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }

  function dismissEditSheet() {
    Animated.timing(editSheetY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setEditSheetOpen(false));
  }

  const categoryChanged = editCatDraft !== savedCategory;
  const editSaveDisabled = saveMutation.isPending || editMerchantDraft.trim().length === 0;

  function handleEditSave() {
    saveMutation.mutate({
      merchant: editMerchantDraft.trim(),
      category: editCatDraft,
    });
  }

  function renderCategoryList() {
    return categories.map((cat, i) => {
      const active = editCatDraft === cat.slug;
      const tileColor = CATEGORY_COLORS[cat.slug] ?? FALLBACK_CATEGORY_COLOR;
      const tileIcon = (CATEGORY_ICON_NAMES[cat.slug] ?? "ellipsis-horizontal-outline") as React.ComponentProps<typeof Ionicons>["name"];
      const isLast = i === categories.length - 1;
      return (
        <Pressable
          key={cat.slug}
          onPress={() => setEditCatDraft(cat.slug)}
          style={[
            styles.catListItem,
            {
              backgroundColor: active ? tileColor + "14" : "transparent",
              borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={[styles.catListIcon, { backgroundColor: tileColor + "22" }]}>
            <Ionicons name={tileIcon} size={17} color={tileColor} />
          </View>
          <Text
            style={[
              styles.catListName,
              {
                color: active ? tileColor : colors.textPrimary,
                fontFamily: active ? FONTS.semiBold : FONTS.regular,
              },
            ]}
          >
            {cat.name}
          </Text>
          {active && <Ionicons name="checkmark-circle" size={18} color={tileColor} />}
        </Pressable>
      );
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* ── Detail sheet ──────────────────────────────────────── */}
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              Transaction
            </Text>
            <View style={styles.headerActions}>
              <Pressable
                onPress={openEditSheet}
                hitSlop={12}
                style={[styles.iconBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="pencil-outline" size={17} color={colors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={onClose}
                hitSlop={12}
                style={[styles.iconBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={[styles.body, { paddingBottom: SPACING.lg }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero */}
            <View style={styles.headerCenter}>
              <View style={[styles.iconWrap, { backgroundColor: catColor + "22" }]}>
                <Ionicons name={iconName} size={28} color={catColor} />
              </View>
              <Text
                style={[
                  styles.amount,
                  { color: isCredit ? colors.success : colors.textPrimary, fontFamily: FONTS.mono },
                ]}
              >
                {formatTransactionAmount(transaction.amount, transaction.currency)}
              </Text>
              {showRef && (
                <Text style={[styles.refAmount, { color: colors.textSubtle, fontFamily: FONTS.mono }]}>
                  ≈ {formatTransactionAmount(transaction.refAmount, transaction.refCurrency)}
                </Text>
              )}
              <Text style={[styles.merchant, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                {savedMerchant}
              </Text>
              <Text style={[styles.dateLine, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                {formatDate(transaction.transactionDate)} · {formatTime(transaction.transactionDate)}
              </Text>
            </View>

            {/* Review banner */}
            {showReviewBanner && (
              <View
                style={[
                  styles.reviewCard,
                  { backgroundColor: colors.warningLight, borderColor: colors.warning + "55" },
                ]}
              >
                <Text style={[styles.reviewLabel, { color: colors.warning, fontFamily: FONTS.bold }]}>
                  NEEDS A QUICK LOOK
                </Text>
                <Text style={[styles.reviewBody, { color: colors.textPrimary, fontFamily: FONTS.regular }]}>
                  We weren&apos;t sure how to categorise this one. Tap edit to confirm or change.
                </Text>
                <Pressable
                  onPress={openEditSheet}
                  style={[styles.confirmBtn, { backgroundColor: colors.warning }]}
                >
                  <Text style={[styles.confirmText, { color: colors.surface, fontFamily: FONTS.semiBold }]}>
                    Review &amp; confirm
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Similar banner */}
            {showSimilarBanner && (
              <View style={[styles.similarCard, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                <View style={styles.similarHeader}>
                  <Ionicons name="git-branch-outline" size={14} color={colors.primary} />
                  <Text style={[styles.similarLabel, { color: colors.primary, fontFamily: FONTS.bold }]}>
                    SIMILAR EXPENSES FOUND
                  </Text>
                </View>
                <Text style={[styles.similarBody, { color: colors.textPrimary, fontFamily: FONTS.regular }]}>
                  {similarTransactions.length} other{" "}
                  <Text style={{ fontFamily: FONTS.semiBold }}>{savedMerchant}</Text>{" "}
                  {similarTransactions.length === 1 ? "expense has" : "expenses have"} a different
                  category. Apply{" "}
                  <Text style={{ fontFamily: FONTS.semiBold }}>
                    {getCategoryLabel(confirmedCategory!, categories)}
                  </Text>{" "}
                  to all of them?
                </Text>
                <View style={styles.similarActions}>
                  <Pressable
                    onPress={() => bulkMutation.mutate(similarTransactions.map((t) => t.id))}
                    disabled={bulkMutation.isPending}
                    style={[
                      styles.similarBtn,
                      { backgroundColor: colors.primary, opacity: bulkMutation.isPending ? 0.7 : 1 },
                    ]}
                  >
                    {bulkMutation.isPending ? (
                      <ActivityIndicator size="small" color={colors.onPrimary} />
                    ) : (
                      <Text style={[styles.similarBtnText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
                        Yes, update all
                      </Text>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => setSimilarDismissed(true)}
                    style={[styles.similarBtn, { borderColor: colors.border, borderWidth: 1 }]}
                  >
                    <Text style={[styles.similarBtnText, { color: colors.textSecondary, fontFamily: FONTS.semiBold }]}>
                      No, just this one
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Detail card */}
            <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View
                style={[
                  styles.detailRow,
                  { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                ]}
              >
                <Text style={[styles.detailLabel, { color: colors.textSubtle, fontFamily: FONTS.semiBold }]}>
                  Category
                </Text>
                <Text style={[styles.detailValue, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                  {displayCategoryLabel}
                </Text>
              </View>

              <View
                style={[
                  styles.detailRow,
                  otherRows.length > 0 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.detailLabel, { color: colors.textSubtle, fontFamily: FONTS.semiBold }]}>
                  Merchant
                </Text>
                <Text
                  style={[styles.detailValue, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}
                  numberOfLines={1}
                >
                  {savedMerchant}
                </Text>
              </View>

              {otherRows.map(([label, value], i) => (
                <View
                  key={label}
                  style={[
                    styles.detailRow,
                    i < otherRows.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.detailLabel, { color: colors.textSubtle, fontFamily: FONTS.semiBold }]}>
                    {label}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={onClose}
              style={[styles.cta, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.ctaText, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                Close
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>

      {/* ── Combined edit sheet ──────────────────────────────── */}
      {editSheetOpen && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[StyleSheet.absoluteFillObject, styles.overlay]}
        >
          <Pressable style={styles.backdrop} onPress={dismissEditSheet} />
          <Animated.View
            style={[
              styles.editSheet,
              {
                backgroundColor: colors.surface,
                paddingBottom: insets.bottom + SPACING.lg,
                transform: [{ translateY: editSheetY }],
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

            <View style={styles.editSheetHeader}>
              <Text style={[styles.editSheetTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                Edit Transaction
              </Text>
              <Pressable
                onPress={dismissEditSheet}
                hitSlop={12}
                style={[styles.iconBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              style={{ flexShrink: 1 }}
              contentContainerStyle={styles.editSheetBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                value={editMerchantDraft}
                onChangeText={setEditMerchantDraft}
                placeholder="Merchant name"
                placeholderTextColor={colors.textSubtle}
                style={[
                  styles.merchantInput,
                  {
                    color: colors.textPrimary,
                    borderColor: colors.border,
                    backgroundColor: colors.surface2,
                    fontFamily: FONTS.regular,
                  },
                ]}
                returnKeyType="done"
              />

              {/* Category — collapsible dropdown */}
              <View style={[styles.dropdown, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Pressable
                  onPress={() => setCatDropdownOpen((o) => !o)}
                  style={styles.dropdownHeader}
                >
                  <Text style={[styles.dropdownLabel, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                    Category
                  </Text>
                  <View style={styles.dropdownRight}>
                    <Text
                      style={[
                        styles.dropdownValue,
                        {
                          color: categoryChanged ? colors.primary : colors.textSubtle,
                          fontFamily: categoryChanged ? FONTS.semiBold : FONTS.regular,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {getCategoryLabel(editCatDraft, categories)}
                    </Text>
                    <Ionicons
                      name={catDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"}
                      size={16}
                      color={colors.textSubtle}
                    />
                  </View>
                </Pressable>
                {catDropdownOpen && (
                  <View style={[styles.dropdownBody, { borderTopColor: colors.border }]}>
                    {renderCategoryList()}
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={[styles.editSheetFooter, { paddingHorizontal: SPACING.xl }]}>
              <Pressable
                onPress={handleEditSave}
                disabled={editSaveDisabled}
                style={[
                  styles.confirmBtn,
                  { backgroundColor: colors.primary, opacity: editSaveDisabled ? 0.5 : 1 },
                ]}
              >
                {saveMutation.isPending ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Text style={[styles.confirmText, { color: colors.surface, fontFamily: FONTS.semiBold }]}>
                    Save changes
                  </Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
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
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  editSheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.88,
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
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerTitle: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  editSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  editSheetTitle: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  editSheetBody: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.base,
    gap: SPACING.sm,
  },
  editSheetFooter: { paddingTop: SPACING.md },
  merchantInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    fontSize: FONT_SIZE.body,
  },
  dropdown: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md + 2,
  },
  dropdownLabel: { fontSize: 15 },
  dropdownRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    maxWidth: "55%",
  },
  dropdownValue: { fontSize: 14 },
  dropdownBody: { borderTopWidth: StyleSheet.hairlineWidth },
  body: { paddingHorizontal: SPACING.xl, gap: SPACING.lg },
  headerCenter: { alignItems: "center", paddingVertical: SPACING.sm, gap: 6 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  amount: { fontSize: 36, letterSpacing: -1 },
  refAmount: { fontSize: 13 },
  merchant: { fontSize: 16, letterSpacing: -0.3, marginTop: 4 },
  dateLine: { fontSize: 13, marginTop: 2 },
  reviewCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  reviewLabel: { fontSize: 11, letterSpacing: 0.6 },
  reviewBody: { fontSize: 14, lineHeight: 20 },
  catListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
  },
  catListIcon: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  catListName: { flex: 1, fontSize: 14 },
  confirmBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  confirmText: { fontSize: 14 },
  detailCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
  },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14 },
  cta: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
    borderWidth: 1,
  },
  ctaText: { fontSize: FONT_SIZE.body, letterSpacing: -0.2 },
  similarCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  similarHeader: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  similarLabel: { fontSize: 11, letterSpacing: 0.6 },
  similarBody: { fontSize: 14, lineHeight: 20 },
  similarActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    flexWrap: "wrap",
    marginTop: SPACING.xs,
  },
  similarBtn: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
  },
  similarBtnText: { fontSize: 13 },
});
