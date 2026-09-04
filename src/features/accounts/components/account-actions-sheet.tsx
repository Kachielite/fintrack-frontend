import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { Account } from "../accounts.interface";
import { useUpdateAccount } from "../hooks/use-update-account";
import BankNameField, { BankNameFieldValue } from "./bank-name-field";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  account: Account;
  otherAccounts: Account[];
}

type Mode = "menu" | "edit" | "merge";

function bankDraftFrom(account: Account): BankNameFieldValue {
  return { bankId: account.bankId ?? undefined, bankName: account.bankName ?? "" };
}

export default function AccountActionsSheet({
  visible,
  onClose,
  account,
  otherAccounts,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { updateAccount, isUpdating } = useUpdateAccount();

  const [mode, setMode] = useState<Mode>("menu");
  const [labelDraft, setLabelDraft] = useState(account.label);
  const [bankDraft, setBankDraft] = useState<BankNameFieldValue>(bankDraftFrom(account));
  const [accountNumberDraft, setAccountNumberDraft] = useState(account.accountNumberMask ?? "");

  function reset() {
    setMode("menu");
    setLabelDraft(account.label);
    setBankDraft(bankDraftFrom(account));
    setAccountNumberDraft(account.accountNumberMask ?? "");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleEditSave() {
    const label = labelDraft.trim();
    if (!label) return;
    updateAccount(
      {
        id: account.id,
        data: {
          label,
          bank_id: bankDraft.bankId,
          account_number: accountNumberDraft.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Account updated" });
          handleClose();
        },
        onError: () =>
          Toast.show({ type: "error", text1: "Could not update account" }),
      },
    );
  }

  function handleMergeInto(target: Account) {
    // Merging only reassigns transactions.account_id server-side - it does
    // not touch currency/amount/refAmount/refCurrency on the moved rows, so
    // a cross-currency merge silently leaves transactions in one currency
    // sitting under an account labeled/filtered as another with no
    // conversion. Call that out explicitly instead of the generic message.
    // See fintrack-frontend#66.
    const message =
      account.currency !== target.currency
        ? `"${account.label}" is in ${account.currency}, but "${target.label}" is in ${target.currency}. Merged transactions will keep their original ${account.currency} amounts — they won't be converted. "${account.label}" will be deactivated. This cannot be undone.`
        : `Move every transaction from "${account.label}" into "${target.label}"? "${account.label}" will be deactivated. This cannot be undone.`;
    Alert.alert(
      "Merge accounts",
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Merge",
          style: "destructive",
          onPress: () =>
            updateAccount(
              { id: account.id, data: { merge_into_account_id: target.id } },
              {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: `Merged into ${target.label}`,
                  });
                  handleClose();
                },
                onError: () =>
                  Toast.show({
                    type: "error",
                    text1: "Could not merge accounts",
                  }),
              },
            ),
        },
      ],
    );
  }

  function handleDeactivate() {
    Alert.alert(
      "Deactivate account",
      `"${account.label}" will be hidden from your accounts list. Its past transactions stay exactly as they are.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: () =>
            updateAccount(
              { id: account.id, data: { is_active: false } },
              {
                onSuccess: () => {
                  Toast.show({ type: "success", text1: "Account deactivated" });
                  handleClose();
                },
                onError: () =>
                  Toast.show({
                    type: "error",
                    text1: "Could not deactivate account",
                  }),
              },
            ),
        },
      ],
    );
  }

  const headerTitle =
    mode === "menu"
      ? account.label
      : mode === "edit"
        ? "Edit Account"
        : "Merge Into…";

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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ width: "100%" }}
        >
          <DraggableSheet
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                paddingBottom: insets.bottom + SPACING.lg,
              },
            ]}
            onClose={handleClose}
            handleColor={colors.borderStrong}
          >
            <View style={styles.header}>
              {mode !== "menu" ? (
                <Pressable
                  onPress={() => setMode("menu")}
                  hitSlop={12}
                  style={[styles.iconBtn, { backgroundColor: colors.surface2 }]}
                >
                  <Ionicons
                    name="chevron-back"
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>
              ) : (
                <View style={styles.iconBtnSpacer} />
              )}
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontFamily: FONTS.bold },
                ]}
                numberOfLines={1}
              >
                {headerTitle}
              </Text>
              <Pressable
                onPress={handleClose}
                hitSlop={12}
                style={[styles.iconBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            {mode === "menu" && (
              <View style={styles.body}>
                <View
                  style={[styles.listContainer, { borderColor: colors.border }]}
                >
                  <MenuRow
                    icon="pencil-outline"
                    label="Edit account"
                    onPress={() => setMode("edit")}
                    showBorder
                  />
                  <MenuRow
                    icon="git-merge-outline"
                    label="Merge into another account"
                    disabled={otherAccounts.length === 0}
                    onPress={() => setMode("merge")}
                    showBorder
                  />
                  <MenuRow
                    icon="eye-off-outline"
                    label="Deactivate"
                    destructive
                    onPress={handleDeactivate}
                  />
                </View>
              </View>
            )}

            {mode === "edit" && (
              <>
                <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.55 }} contentContainerStyle={styles.body}>
                  <TextInput
                    value={labelDraft}
                    onChangeText={setLabelDraft}
                    placeholder="Account name"
                    placeholderTextColor={colors.textSubtle}
                    autoFocus
                    style={[
                      styles.input,
                      {
                        color: colors.textPrimary,
                        borderColor: colors.border,
                        backgroundColor: colors.background,
                        fontFamily: FONTS.regular,
                      },
                    ]}
                    returnKeyType="done"
                  />
                  <BankNameField value={bankDraft} onChange={setBankDraft} />
                  <View style={{ gap: SPACING.sm }}>
                    <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
                      ACCOUNT NUMBER (OPTIONAL)
                    </Text>
                    <TextInput
                      value={accountNumberDraft}
                      onChangeText={setAccountNumberDraft}
                      placeholder="Distinguishes accounts at the same bank"
                      placeholderTextColor={colors.textSubtle}
                      keyboardType="numeric"
                      style={[
                        styles.input,
                        {
                          color: colors.textPrimary,
                          borderColor: colors.border,
                          backgroundColor: colors.background,
                          fontFamily: FONTS.regular,
                        },
                      ]}
                    />
                  </View>
                </ScrollView>
                <View
                  style={[styles.footer, { borderTopColor: colors.border }]}
                >
                  <Pressable
                    onPress={handleEditSave}
                    disabled={isUpdating || labelDraft.trim().length === 0}
                    style={[
                      styles.primaryBtn,
                      {
                        backgroundColor: colors.primary,
                        opacity:
                          isUpdating || labelDraft.trim().length === 0
                            ? 0.5
                            : 1,
                      },
                    ]}
                  >
                    {isUpdating ? (
                      <ActivityIndicator color={colors.onPrimary} />
                    ) : (
                      <Text
                        style={[
                          styles.primaryBtnLabel,
                          {
                            color: colors.onPrimary,
                            fontFamily: FONTS.semiBold,
                          },
                        ]}
                      >
                        Save
                      </Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}

            {mode === "merge" && (
              <ScrollView
                style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}
                contentContainerStyle={styles.body}
              >
                <Text
                  style={[
                    styles.hint,
                    { color: colors.textSubtle, fontFamily: FONTS.regular },
                  ]}
                >
                  Choose the account to move all of this account&apos;s
                  transactions into.
                </Text>
                <View
                  style={[styles.listContainer, { borderColor: colors.border }]}
                >
                  {otherAccounts.map((target, i) => {
                    const initial = target.bankName?.trim()?.[0]?.toUpperCase();
                    return (
                      <Pressable
                        key={target.id}
                        onPress={() => handleMergeInto(target)}
                        disabled={isUpdating}
                        style={[
                          styles.targetRow,
                          i < otherAccounts.length - 1 && {
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: colors.border,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.targetIcon,
                            { backgroundColor: colors.primaryMid },
                          ]}
                        >
                          {initial ? (
                            <Text
                              style={[
                                styles.targetIconText,
                                {
                                  color: colors.primary,
                                  fontFamily: FONTS.bold,
                                },
                              ]}
                            >
                              {initial}
                            </Text>
                          ) : (
                            <Ionicons
                              name="wallet-outline"
                              size={14}
                              color={colors.primary}
                            />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.targetLabel,
                            {
                              color: colors.textPrimary,
                              fontFamily: FONTS.semiBold,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {target.label}
                        </Text>
                        <View
                          style={[
                            styles.currencyChip,
                            { backgroundColor: colors.surface2 },
                          ]}
                        >
                          <Text
                            style={[
                              styles.currencyChipText,
                              {
                                color: colors.textSubtle,
                                fontFamily: FONTS.semiBold,
                              },
                            ]}
                          >
                            {target.currency}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </DraggableSheet>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  destructive,
  disabled,
  showBorder,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  showBorder?: boolean;
}) {
  const colors = useThemeColors();
  const tint = disabled
    ? colors.textSubtle
    : destructive
      ? colors.error
      : colors.primary;
  const textColor = disabled
    ? colors.textSubtle
    : destructive
      ? colors.error
      : colors.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.menuRow,
        showBorder && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        pressed && !disabled ? { opacity: 0.6 } : undefined,
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: tint + "1E" }]}>
        <Ionicons name={icon} size={16} color={tint} />
      </View>
      <Text
        style={[
          styles.menuLabel,
          { color: textColor, fontFamily: FONTS.semiBold },
        ]}
      >
        {label}
      </Text>
      {!disabled && !destructive && (
        <Ionicons name="chevron-forward" size={15} color={colors.textSubtle} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: { borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.h2,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnSpacer: { width: 32, height: 32 },
  body: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.base,
    gap: SPACING.sm,
  },
  listContainer: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
  },
  menuIcon: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.bodySmall },
  fieldLabel: { fontSize: 11, letterSpacing: 0.6 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    fontSize: FONT_SIZE.body,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  primaryBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
  },
  primaryBtnLabel: { fontSize: FONT_SIZE.body, letterSpacing: -0.2 },
  hint: { fontSize: 12, lineHeight: 17, marginBottom: SPACING.xs },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
  },
  targetIcon: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  targetIconText: { fontSize: 13 },
  targetLabel: { flex: 1, fontSize: FONT_SIZE.bodySmall },
  currencyChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  currencyChipText: { fontSize: 10, letterSpacing: 0.3 },
});
