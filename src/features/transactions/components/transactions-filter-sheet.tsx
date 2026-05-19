import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  CATEGORY_COLORS,
  FALLBACK_CATEGORY_COLOR,
} from "@/core/common/constants/theme";
import { getCategoryIconName } from "../transactions.constants";
import { useCategories } from "@/features/categories/hooks/use-categories";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export interface TransactionFilters {
  categories: string[];
  currencies: string[];
  bankIds: number[];
}

export interface BankOption {
  id: number;
  name: string;
}

type Section = "categories" | "banks" | "currencies";

interface Props {
  visible: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  currencies: string[];
  banks: BankOption[];
  resultCount: number;
  onApply: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export default function TransactionsFilterSheet({
  visible,
  onClose,
  filters,
  currencies,
  banks,
  resultCount,
  onApply,
  onClear,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { data: categories = [] } = useCategories();

  const [draft, setDraft] = useState<TransactionFilters>(filters);
  const [openSection, setOpenSection] = useState<Section | null>(null);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
      setOpenSection(null);
    }
  }, [visible]);

  function toggleSection(s: Section) {
    setOpenSection((prev) => (prev === s ? null : s));
  }

  function toggleCategory(slug: string) {
    setDraft((prev) => ({
      ...prev,
      categories: prev.categories.includes(slug)
        ? prev.categories.filter((x) => x !== slug)
        : [...prev.categories, slug],
    }));
  }

  function toggleBank(id: number) {
    setDraft((prev) => ({
      ...prev,
      bankIds: prev.bankIds.includes(id)
        ? prev.bankIds.filter((x) => x !== id)
        : [...prev.bankIds, id],
    }));
  }

  function toggleCurrency(code: string) {
    setDraft((prev) => ({
      ...prev,
      currencies: prev.currencies.includes(code)
        ? prev.currencies.filter((x) => x !== code)
        : [...prev.currencies, code],
    }));
  }

  function handleApply() {
    onApply(draft);
    onClose();
  }

  function handleClear() {
    const empty: TransactionFilters = { categories: [], currencies: [], bankIds: [] };
    setDraft(empty);
    onClear();
    onClose();
  }

  // ── Summary text helpers ─────────────────────────────────────────────────
  function categoryLabel(): string {
    if (draft.categories.length === 0) return "All";
    if (draft.categories.length === 1) {
      return categories.find((c) => c.slug === draft.categories[0])?.name ?? draft.categories[0];
    }
    return `${draft.categories.length} selected`;
  }

  function bankLabel(): string {
    if (draft.bankIds.length === 0) return "All";
    if (draft.bankIds.length === 1) {
      return banks.find((b) => b.id === draft.bankIds[0])?.name ?? "1 bank";
    }
    return `${draft.bankIds.length} banks`;
  }

  function currencyLabel(): string {
    if (draft.currencies.length === 0) return "All";
    if (draft.currencies.length === 1) return draft.currencies[0];
    return `${draft.currencies.length} selected`;
  }

  // ── Shared row renderer ─────────────────────────────────────────────────
  function DropdownSection({
    id,
    label,
    valueText,
    hasSelection,
    children,
  }: {
    id: Section;
    label: string;
    valueText: string;
    hasSelection: boolean;
    children: React.ReactNode;
  }) {
    const isOpen = openSection === id;
    return (
      <View style={[styles.dropdown, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Pressable onPress={() => toggleSection(id)} style={styles.dropdownHeader}>
          <Text style={[styles.dropdownLabel, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
            {label}
          </Text>
          <View style={styles.dropdownRight}>
            <Text
              style={[
                styles.dropdownValue,
                {
                  color: hasSelection ? colors.primary : colors.textSubtle,
                  fontFamily: hasSelection ? FONTS.semiBold : FONTS.regular,
                },
              ]}
              numberOfLines={1}
            >
              {valueText}
            </Text>
            <Ionicons
              name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
              size={16}
              color={colors.textSubtle}
            />
          </View>
        </Pressable>

        {isOpen && (
          <View style={[styles.dropdownBody, { borderTopColor: colors.border }]}>
            {children}
          </View>
        )}
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <DraggableSheet
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + SPACING.lg,
            },
          ]}
          onClose={onClose}
          handleColor={colors.borderStrong}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              Filter
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            {/* ── Category ─────────────────────────────── */}
            <DropdownSection
              id="categories"
              label="Category"
              valueText={categoryLabel()}
              hasSelection={draft.categories.length > 0}
            >
              {categories.map((cat, i) => {
                const active = draft.categories.includes(cat.slug);
                const tileColor = CATEGORY_COLORS[cat.slug] ?? FALLBACK_CATEGORY_COLOR;
                const tileIcon = getCategoryIconName(cat.slug) as React.ComponentProps<typeof Ionicons>["name"];
                const isLast = i === categories.length - 1;
                return (
                  <Pressable
                    key={cat.slug}
                    onPress={() => toggleCategory(cat.slug)}
                    style={[
                      styles.listItem,
                      {
                        backgroundColor: active ? tileColor + "12" : "transparent",
                        borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View style={[styles.listItemIcon, { backgroundColor: tileColor + "22" }]}>
                      <Ionicons name={tileIcon} size={15} color={tileColor} />
                    </View>
                    <Text
                      style={[
                        styles.listItemName,
                        {
                          color: active ? tileColor : colors.textPrimary,
                          fontFamily: active ? FONTS.semiBold : FONTS.regular,
                        },
                      ]}
                    >
                      {cat.name}
                    </Text>
                    {active && <Ionicons name="checkmark-circle" size={17} color={tileColor} />}
                  </Pressable>
                );
              })}
            </DropdownSection>

            {/* ── Bank ─────────────────────────────────── */}
            {banks.length > 0 && (
              <DropdownSection
                id="banks"
                label="Bank"
                valueText={bankLabel()}
                hasSelection={draft.bankIds.length > 0}
              >
                {banks.map((bank, i) => {
                  const active = draft.bankIds.includes(bank.id);
                  const isLast = i === banks.length - 1;
                  return (
                    <Pressable
                      key={bank.id}
                      onPress={() => toggleBank(bank.id)}
                      style={[
                        styles.listItem,
                        {
                          backgroundColor: active ? colors.primary + "12" : "transparent",
                          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <View style={[styles.listItemIcon, { backgroundColor: colors.primary + "18" }]}>
                        <Ionicons name="business-outline" size={15} color={colors.primary} />
                      </View>
                      <Text
                        style={[
                          styles.listItemName,
                          {
                            color: active ? colors.primary : colors.textPrimary,
                            fontFamily: active ? FONTS.semiBold : FONTS.regular,
                          },
                        ]}
                      >
                        {bank.name}
                      </Text>
                      {active && <Ionicons name="checkmark-circle" size={17} color={colors.primary} />}
                    </Pressable>
                  );
                })}
              </DropdownSection>
            )}

            {/* ── Currency ─────────────────────────────── */}
            {currencies.length > 0 && (
              <DropdownSection
                id="currencies"
                label="Currency"
                valueText={currencyLabel()}
                hasSelection={draft.currencies.length > 0}
              >
                {currencies.map((code, i) => {
                  const active = draft.currencies.includes(code);
                  const isLast = i === currencies.length - 1;
                  return (
                    <Pressable
                      key={code}
                      onPress={() => toggleCurrency(code)}
                      style={[
                        styles.listItem,
                        {
                          backgroundColor: active ? colors.primary + "12" : "transparent",
                          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <View style={[styles.listItemIcon, { backgroundColor: colors.primary + "18" }]}>
                        <Text style={[styles.currencyCode, { color: colors.primary }]}>{code.slice(0, 2)}</Text>
                      </View>
                      <Text
                        style={[
                          styles.listItemName,
                          {
                            color: active ? colors.primary : colors.textPrimary,
                            fontFamily: active ? FONTS.semiBold : FONTS.regular,
                          },
                        ]}
                      >
                        {code}
                      </Text>
                      {active && <Ionicons name="checkmark-circle" size={17} color={colors.primary} />}
                    </Pressable>
                  );
                })}
              </DropdownSection>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              onPress={handleClear}
              style={[styles.btn, styles.btnSecondary, { borderColor: colors.border }]}
            >
              <Text style={[styles.btnText, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                Clear all
              </Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              style={[styles.btn, styles.btnPrimary, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.btnText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
                Show {resultCount} results
              </Text>
            </Pressable>
          </View>
        </DraggableSheet>
      </View>
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
    gap: SPACING.sm,
  },
  // ── Dropdown ──────────────────────────────────────────────────────────────
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
  dropdownBody: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  // ── List rows ─────────────────────────────────────────────────────────────
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
  },
  listItemIcon: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  listItemName: { flex: 1, fontSize: 13 },
  currencyCode: { fontSize: 11, fontFamily: FONTS.bold },
  // ── Footer buttons ────────────────────────────────────────────────────────
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  btn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    alignItems: "center",
  },
  btnSecondary: { borderWidth: 1 },
  btnPrimary: {},
  btnText: { fontSize: FONT_SIZE.body },
});
