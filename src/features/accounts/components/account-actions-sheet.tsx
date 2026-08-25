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

interface Props {
  visible: boolean;
  onClose: () => void;
  account: Account;
  otherAccounts: Account[];
}

type Mode = "menu" | "rename" | "merge";

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

  function reset() {
    setMode("menu");
    setLabelDraft(account.label);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleRenameSave() {
    const label = labelDraft.trim();
    if (!label) return;
    updateAccount(
      { id: account.id, data: { label } },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Account renamed" });
          handleClose();
        },
        onError: () =>
          Toast.show({ type: "error", text1: "Could not rename account" }),
      },
    );
  }

  function handleMergeInto(target: Account) {
    Alert.alert(
      "Merge accounts",
      `Move every transaction from "${account.label}" into "${target.label}"? "${account.label}" will be deactivated. This cannot be undone.`,
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
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
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontFamily: FONTS.bold },
                ]}
                numberOfLines={1}
              >
                {mode === "menu"
                  ? account.label
                  : mode === "rename"
                    ? "Rename account"
                    : "Merge into…"}
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
                <MenuRow
                  icon="pencil-outline"
                  label="Rename"
                  onPress={() => setMode("rename")}
                />
                <MenuRow
                  icon="git-merge-outline"
                  label="Merge into another account"
                  disabled={otherAccounts.length === 0}
                  onPress={() => setMode("merge")}
                />
                <MenuRow
                  icon="eye-off-outline"
                  label="Deactivate"
                  destructive
                  onPress={handleDeactivate}
                />
              </View>
            )}

            {mode === "rename" && (
              <View style={styles.body}>
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
                      backgroundColor: colors.surface2,
                      fontFamily: FONTS.regular,
                    },
                  ]}
                  returnKeyType="done"
                  onSubmitEditing={handleRenameSave}
                />
                <Pressable
                  onPress={handleRenameSave}
                  disabled={isUpdating || labelDraft.trim().length === 0}
                  style={[
                    styles.primaryBtn,
                    {
                      backgroundColor: colors.primary,
                      opacity:
                        isUpdating || labelDraft.trim().length === 0 ? 0.5 : 1,
                    },
                  ]}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <Text
                      style={[
                        styles.primaryBtnText,
                        { color: colors.surface, fontFamily: FONTS.semiBold },
                      ]}
                    >
                      Save
                    </Text>
                  )}
                </Pressable>
              </View>
            )}

            {mode === "merge" && (
              <ScrollView
                style={{ maxHeight: 320 }}
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
                {otherAccounts.map((target) => (
                  <Pressable
                    key={target.id}
                    onPress={() => handleMergeInto(target)}
                    disabled={isUpdating}
                    style={[styles.targetRow, { borderColor: colors.border }]}
                  >
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
                    <Text
                      style={[
                        styles.targetCurrency,
                        { color: colors.textSubtle, fontFamily: FONTS.regular },
                      ]}
                    >
                      {target.currency}
                    </Text>
                  </Pressable>
                ))}
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
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}) {
  const colors = useThemeColors();
  const color = disabled
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
        pressed && !disabled ? { opacity: 0.6 } : undefined,
      ]}
    >
      <Ionicons name={icon} size={19} color={color} />
      <Text style={[styles.menuLabel, { color, fontFamily: FONTS.semiBold }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: { borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.h3,
    letterSpacing: -0.3,
    flex: 1,
    marginRight: SPACING.sm,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.base,
    gap: SPACING.sm,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  menuLabel: { fontSize: FONT_SIZE.bodySmall },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    fontSize: FONT_SIZE.body,
  },
  primaryBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  primaryBtnText: { fontSize: 14 },
  hint: { fontSize: 12, lineHeight: 17, marginBottom: SPACING.xs },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.md,
  },
  targetLabel: {
    fontSize: FONT_SIZE.bodySmall,
    flex: 1,
    marginRight: SPACING.sm,
  },
  targetCurrency: { fontSize: 11 },
});
