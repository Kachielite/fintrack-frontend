import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { Account } from "../accounts.interface";
import { useUpdateAccount } from "../hooks/use-update-account";
import { DuplicateAccountSuggestion } from "../utils/duplicate-suggestions";

interface Props {
  suggestion: DuplicateAccountSuggestion;
  onDismiss: () => void;
}

function maskedLabel(account: Account) {
  return account.accountNumberMask
    ? `${account.label} •••• ${account.accountNumberMask}`
    : account.label;
}

export default function MergeSuggestionsBanner({
  suggestion,
  onDismiss,
}: Props) {
  const colors = useThemeColors();
  const { updateAccount, isUpdating } = useUpdateAccount();
  const { target, source } = suggestion;

  function handleMerge() {
    Alert.alert(
      "Merge accounts",
      `Move every transaction from "${source.label}" into "${target.label}"? "${source.label}" will be deactivated. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Merge",
          style: "destructive",
          onPress: () =>
            updateAccount(
              { id: source.id, data: { merge_into_account_id: target.id } },
              {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: `Merged into ${target.label}`,
                  });
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

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.borderStrong },
      ]}
    >
      <Pressable
        onPress={onDismiss}
        hitSlop={8}
        style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
      >
        <Ionicons name="close" size={16} color={colors.textSecondary} />
      </Pressable>

      <View style={styles.labelRow}>
        <Ionicons name="git-merge-outline" size={12} color={colors.primary} />
        <Text
          style={[
            styles.label,
            { color: colors.primary, fontFamily: FONTS.bold },
          ]}
        >
          POSSIBLE DUPLICATE
        </Text>
      </View>

      <Text
        style={[
          styles.message,
          { color: colors.textPrimary, fontFamily: FONTS.medium },
        ]}
      >
        {maskedLabel(source)} looks like the same account as{" "}
        {maskedLabel(target)}.
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={handleMerge}
          disabled={isUpdating}
          style={[
            styles.btn,
            styles.btnPrimary,
            { backgroundColor: colors.primary, opacity: isUpdating ? 0.7 : 1 },
          ]}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text
              style={[
                styles.btnText,
                { color: colors.onPrimary, fontFamily: FONTS.semiBold },
              ]}
            >
              Merge
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={onDismiss}
          style={[styles.btn, styles.btnGhost, { borderColor: colors.border }]}
        >
          <Text
            style={[
              styles.btnText,
              { color: colors.textSecondary, fontFamily: FONTS.semiBold },
            ]}
          >
            Not a duplicate
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderStyle: "dashed",
    padding: SPACING.base,
    paddingTop: SPACING.base + 4,
    gap: SPACING.sm,
  },
  closeBtn: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 26,
    height: 26,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingRight: 30,
  },
  label: { fontSize: 11, letterSpacing: 0.8 },
  message: {
    fontSize: FONT_SIZE.body - 1,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    flexWrap: "wrap",
  },
  btn: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
  },
  btnPrimary: {},
  btnGhost: { borderWidth: 1 },
  btnText: { fontSize: 13 },
});
