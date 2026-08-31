import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
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
import NewAccountFields, { NewAccountFieldsValue } from "./new-account-fields";

const EMPTY: NewAccountFieldsValue = { bankName: "", accountNumber: "", currency: null };

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CreateAccountSheet({ visible, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { createAccount, isCreating } = useCreateAccount();
  const [fields, setFields] = useState<NewAccountFieldsValue>(EMPTY);

  function reset() {
    setFields(EMPTY);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleCreate() {
    if (!fields.currency) return;
    createAccount(
      {
        currency: fields.currency,
        bank_id: fields.bankId,
        account_number: fields.accountNumber.trim() || undefined,
      },
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
            <NewAccountFields value={fields} onChange={setFields} />

            <Pressable
              onPress={handleCreate}
              disabled={!fields.currency || isCreating}
              style={[
                styles.createBtn,
                { backgroundColor: fields.currency && !isCreating ? colors.primary : colors.border },
              ]}
            >
              {isCreating ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text
                  style={[
                    styles.createBtnLabel,
                    { color: fields.currency ? colors.onPrimary : colors.textSubtle, fontFamily: FONTS.semiBold },
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
    gap: SPACING.md,
  },
  createBtn: {
    height: 52,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.sm,
  },
  createBtnLabel: { fontSize: 16 },
});
