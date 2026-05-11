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
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { CategoryType } from "../transactions.interface";
import { CATEGORY_LABELS, ALL_CATEGORIES } from "../transactions.constants";
import TransactionsFilterGroup from "./transactions-filter-group";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export interface TransactionFilters {
  categories: CategoryType[];
  currencies: string[];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  /** Unique currencies derived from loaded transactions */
  currencies: string[];
  /** Count of results that match the current draft filters */
  resultCount: number;
  onApply: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export default function TransactionsFilterSheet({
  visible,
  onClose,
  filters,
  currencies,
  resultCount,
  onApply,
  onClear,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  // Draft state — user changes are not committed until "Apply"
  const [draft, setDraft] = useState<TransactionFilters>(filters);

  // Sync draft with committed filters each time the sheet opens
  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible]);

  function toggle(key: keyof TransactionFilters, value: string) {
    setDraft((prev) => {
      const list = prev[key] as string[];
      const next = list.includes(value)
        ? list.filter((x) => x !== value)
        : [...list, value];
      return { ...prev, [key]: next };
    });
  }

  function handleApply() {
    onApply(draft);
    onClose();
  }

  function handleClear() {
    setDraft({ categories: [], currencies: [] });
    onClear();
    onClose();
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

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + SPACING.lg,
            },
          ]}
        >
          {/* Drag handle */}
          <View
            style={[styles.handle, { backgroundColor: colors.borderStrong }]}
          />

          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: colors.textPrimary, fontFamily: FONTS.bold },
              ]}
            >
              Filter
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons
                name="close"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          {/* Filter groups */}
          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            <TransactionsFilterGroup
              label="Category"
              options={ALL_CATEGORIES}
              selected={draft.categories}
              onToggle={(v) => toggle("categories", v as CategoryType)}
              formatLabel={(v) => CATEGORY_LABELS[v as CategoryType] ?? v}
            />
            {currencies.length > 0 && (
              <TransactionsFilterGroup
                label="Currency"
                options={currencies}
                selected={draft.currencies}
                onToggle={(v) => toggle("currencies", v)}
              />
            )}
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Pressable
              onPress={handleClear}
              style={[
                styles.btn,
                styles.btnSecondary,
                { borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.btnText,
                  {
                    color: colors.textPrimary,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
              >
                Clear
              </Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              style={[
                styles.btn,
                styles.btnPrimary,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.btnText,
                  { color: colors.onPrimary, fontFamily: FONTS.semiBold },
                ]}
              >
                Show {resultCount} results
              </Text>
            </Pressable>
          </View>
        </View>
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
    maxHeight: SCREEN_HEIGHT * 0.75,
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
    gap: SPACING.xl,
  },
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

