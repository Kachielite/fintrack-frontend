import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  SPACING,
  RADIUS,
  CATEGORY_COLORS,
  FALLBACK_CATEGORY_COLOR,
} from "@/core/common/constants/theme";
import { getCategoryIconName } from "../transactions.constants";
import {
  useCategories,
  getCategoryLabel,
} from "@/features/categories/hooks/use-categories";
import { formatTransactionAmount } from "@/core/common/utils/currency";
import { formatDate } from "@/core/common/utils/date";
import { Transaction } from "../transactions.interface";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  transactions: Transaction[];
  targetCategory: string;
  isSubmitting: boolean;
  onConfirm: (selectedIds: number[]) => void;
}

export default function SimilarTransactionsSheet({
  visible,
  onClose,
  transactions,
  targetCategory,
  isSubmitting,
  onConfirm,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { data: categories = [] } = useCategories();
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Every candidate starts checked — reviewing means unchecking the ones
  // that don't actually belong, not opting in one at a time.
  useEffect(() => {
    if (visible) setSelected(new Set(transactions.map((t) => t.id)));
  }, [visible, transactions]);

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const targetLabel = getCategoryLabel(targetCategory, categories);

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
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontFamily: FONTS.bold },
                ]}
              >
                Similar transactions
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.textSecondary, fontFamily: FONTS.regular },
                ]}
              >
                Uncheck any that don&apos;t belong in {targetLabel}.
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}
            showsVerticalScrollIndicator={false}
          >
            {transactions.map((tx, i) => {
              const isChecked = selected.has(tx.id);
              const catColor = CATEGORY_COLORS[tx.category] ?? FALLBACK_CATEGORY_COLOR;
              const iconName = getCategoryIconName(tx.category) as React.ComponentProps<
                typeof Ionicons
              >["name"];
              const isLast = i === transactions.length - 1;
              return (
                <Pressable
                  key={tx.id}
                  onPress={() => toggle(tx.id)}
                  style={[
                    styles.row,
                    !isLast && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: isChecked ? colors.primary : colors.border,
                        backgroundColor: isChecked ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    {isChecked && (
                      <Ionicons name="checkmark" size={14} color={colors.onPrimary} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.merchant,
                        { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                      ]}
                    >
                      {tx.merchant}
                    </Text>
                    <View style={styles.metaRow}>
                      <View style={[styles.catChip, { backgroundColor: catColor + "22" }]}>
                        <Ionicons name={iconName} size={11} color={catColor} />
                        <Text
                          style={[
                            styles.catChipText,
                            { color: catColor, fontFamily: FONTS.medium },
                          ]}
                        >
                          {getCategoryLabel(tx.category, categories)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.date,
                          { color: colors.textSubtle, fontFamily: FONTS.regular },
                        ]}
                      >
                        {formatDate(tx.transactionDate)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.amount,
                      { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    {formatTransactionAmount(tx.amount, tx.currency)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={() => onConfirm(Array.from(selected))}
              disabled={selected.size === 0 || isSubmitting}
              style={[
                styles.confirmBtn,
                {
                  backgroundColor: colors.primary,
                  opacity: selected.size === 0 || isSubmitting ? 0.5 : 1,
                },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <Text
                  style={[
                    styles.confirmBtnText,
                    { color: colors.onPrimary, fontFamily: FONTS.semiBold },
                  ]}
                >
                  Apply to {selected.size} selected
                </Text>
              )}
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
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  title: { fontSize: 18, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  merchant: { fontSize: 14.5 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: 4,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  catChipText: { fontSize: 11 },
  date: { fontSize: 12 },
  amount: { fontSize: 14 },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  confirmBtn: {
    height: 50,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: { fontSize: 15.5, letterSpacing: -0.2 },
});
