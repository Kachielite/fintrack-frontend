import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { usePickAndImportStatement } from "../hooks/use-pick-and-import-statement";
import { ImportTarget } from "../transactions.dto";
import ImportAccountPicker from "./import-account-picker";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAccepted?: () => void;
}

export default function ImportCsvSheet({ visible, onClose, onAccepted }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { pickFile, confirmImport, isImporting, fileName, hasPickedFile, accepted, error, reset } =
    usePickAndImportStatement(onAccepted);
  const [target, setTarget] = useState<ImportTarget | undefined>(undefined);
  const canImport = !!(target?.accountId !== undefined || target?.currency);

  function handleClose() {
    reset();
    setTarget(undefined);
    onClose();
  }

  function handleImport() {
    confirmImport(target);
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
            { backgroundColor: colors.surface, paddingBottom: insets.bottom },
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
            >
              Import statement
            </Text>
            <Pressable
              onPress={handleClose}
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
            <Text
              style={[
                styles.hint,
                { color: colors.textSecondary, fontFamily: FONTS.regular },
              ]}
            >
              Statements don't follow one fixed column layout, so we read them
              with AI — it needs to know which account to attribute the
              transactions to, since the statement itself may not say (e.g. no
              currency column).
            </Text>

            {!accepted && !isImporting && (
              <ImportAccountPicker value={target} onChange={setTarget} />
            )}

            <View style={{ gap: SPACING.sm }}>
              <Text style={[styles.label, { color: colors.textSecondary, fontFamily: FONTS.bold }]}>
                STATEMENT FILE
              </Text>
              <Pressable
                onPress={pickFile}
                disabled={isImporting || accepted}
                style={[
                  styles.pickBtn,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Ionicons
                  name="document-attach-outline"
                  size={22}
                  color={colors.primary}
                />
                <Text
                  style={[
                    styles.pickBtnLabel,
                    { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                  ]}
                >
                  {fileName ?? "Choose a statement file"}
                </Text>
              </Pressable>
            </View>

            {!accepted && !isImporting && (
              <Pressable
                onPress={handleImport}
                disabled={!canImport || !hasPickedFile}
                style={[
                  styles.importBtn,
                  { backgroundColor: canImport && hasPickedFile ? colors.primary : colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.importBtnLabel,
                    {
                      color: canImport && hasPickedFile ? colors.onPrimary : colors.textSubtle,
                      fontFamily: FONTS.semiBold,
                    },
                  ]}
                >
                  Import
                </Text>
              </Pressable>
            )}

            {isImporting && (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.primary} />
                <Text
                  style={[
                    styles.loadingLabel,
                    { color: colors.textSecondary, fontFamily: FONTS.regular },
                  ]}
                >
                  Importing…
                </Text>
              </View>
            )}

            {error && !isImporting && (
              <View
                style={[
                  styles.errorCard,
                  {
                    backgroundColor: colors.error + "15",
                    borderColor: colors.error + "55",
                  },
                ]}
              >
                <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
                <Text
                  style={[
                    styles.errorCardText,
                    { color: colors.error, fontFamily: FONTS.medium },
                  ]}
                >
                  {error}
                </Text>
              </View>
            )}

            {accepted && !isImporting && (
              <View
                style={[
                  styles.resultCard,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.acceptedRow}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text
                    style={[
                      styles.acceptedTitle,
                      { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    Import started
                  </Text>
                </View>
                <Text
                  style={[
                    styles.acceptedBody,
                    { color: colors.textSecondary, fontFamily: FONTS.regular },
                  ]}
                >
                  We're processing your statement in the background — you'll get a
                  notification with the results shortly. You can close this now.
                </Text>
              </View>
            )}
          </ScrollView>
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
    gap: SPACING.lg,
  },
  hint: { fontSize: 13, lineHeight: 20 },
  label: { fontSize: 11, letterSpacing: 0.6 },
  pickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    height: 56,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    paddingHorizontal: SPACING.md,
  },
  pickBtnLabel: { fontSize: 15, flex: 1 },
  importBtn: {
    height: 50,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  importBtnLabel: { fontSize: 15 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  loadingLabel: { fontSize: 14 },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
  },
  errorCardText: { flex: 1, fontSize: 13, lineHeight: 19 },
  resultCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  acceptedRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  acceptedTitle: { fontSize: 15 },
  acceptedBody: { fontSize: 13, lineHeight: 19 },
});
