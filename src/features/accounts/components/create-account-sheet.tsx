import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useCreateAccount } from "../hooks/use-create-account";

// Mirrors add-transaction-sheet.tsx's / import-account-picker.tsx's currency chip list.
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
}

export default function CreateAccountSheet({ visible, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { createAccount, isCreating } = useCreateAccount();
  const [currency, setCurrency] = useState<string | null>(null);
  const [label, setLabel] = useState("");

  function reset() {
    setCurrency(null);
    setLabel("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleCreate() {
    if (!currency) return;
    createAccount(
      { currency, label: label.trim() || undefined },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Account created" });
          handleClose();
        },
        onError: () => Toast.show({ type: "error", text1: "Could not create account" }),
      },
    );
  }

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
            { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg },
          ]}
          onClose={handleClose}
          handleColor={colors.borderStrong}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              New account
            </Text>
            <Pressable
              onPress={handleClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.body}>
            <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
              CURRENCY
            </Text>
            <View style={styles.currencyRow}>
              {CURRENCIES.map((c) => {
                const active = currency === c.code;
                return (
                  <Pressable
                    key={c.code}
                    onPress={() => setCurrency(c.code)}
                    style={[
                      styles.currencyChip,
                      {
                        backgroundColor: active ? colors.primary : colors.background,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencyChipLabel,
                        { color: active ? colors.onPrimary : colors.textPrimary, fontFamily: FONTS.semiBold },
                      ]}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
              NAME (OPTIONAL)
            </Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="e.g. M-Pesa"
              placeholderTextColor={colors.textSubtle}
              style={[
                styles.input,
                { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary },
              ]}
            />

            <Pressable
              onPress={handleCreate}
              disabled={!currency || isCreating}
              style={[
                styles.createBtn,
                { backgroundColor: currency && !isCreating ? colors.primary : colors.border },
              ]}
            >
              {isCreating ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text
                  style={[
                    styles.createBtnLabel,
                    { color: currency ? colors.onPrimary : colors.textSubtle, fontFamily: FONTS.semiBold },
                  ]}
                >
                  Create account
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
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "80%",
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
    gap: SPACING.sm,
  },
  label: { fontSize: 11, letterSpacing: 0.6, marginTop: SPACING.sm },
  currencyRow: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.xs },
  currencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
  },
  currencyChipLabel: { fontSize: 13 },
  input: {
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
  },
  createBtn: {
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  createBtnLabel: { fontSize: 16 },
});
