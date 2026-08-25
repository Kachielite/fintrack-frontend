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
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import Toast from "react-native-toast-message";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from "@/core/common/constants/theme";
import { useImportTransactionsCsv } from "../hooks/use-create-transaction";
import { ImportCsvResultDto } from "../transactions.dto";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ImportCsvSheet({ visible, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { importCsv, isImporting } = useImportTransactionsCsv();

  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<ImportCsvResultDto | null>(null);

  function handleClose() {
    setFileName(null);
    setResult(null);
    onClose();
  }

  async function pickFile() {
    setResult(null);
    const picked = await DocumentPicker.getDocumentAsync({
      type: ["text/csv", "text/comma-separated-values", "*/*"],
      copyToCacheDirectory: true,
    });
    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    setFileName(asset.name);

    let content: string;
    try {
      content = await new File(asset.uri).text();
    } catch {
      Toast.show({
        type: "error",
        text1: "Could not read that file. Try a different CSV.",
      });
      return;
    }

    try {
      const outcome = await importCsv(content);
      setResult(outcome);
      if (outcome.imported > 0) {
        Toast.show({
          type: "success",
          text1: `Imported ${outcome.imported} transaction${outcome.imported === 1 ? "" : "s"}`,
        });
      }
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not import this CSV. Try a different file.";
      Toast.show({ type: "error", text1: message });
    }
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
              Import from CSV
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
              Pick almost any CSV of transactions — a bank statement export or
              your own spreadsheet. We'll automatically figure out which columns
              are the date, description, and amount.
            </Text>

            <Pressable
              onPress={pickFile}
              disabled={isImporting}
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
                {fileName ?? "Choose a CSV file"}
              </Text>
            </Pressable>

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

            {result && !isImporting && (
              <View
                style={[
                  styles.resultCard,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ResultRow
                  label="Imported"
                  value={result.imported}
                  color={colors.success}
                />
                <ResultRow
                  label="Duplicates skipped"
                  value={result.skippedDuplicates}
                  color={colors.textSecondary}
                />
                <ResultRow
                  label="Invalid rows skipped"
                  value={result.skippedInvalid}
                  color={colors.error}
                />
                {result.errors.length > 0 && (
                  <View style={styles.errorsBox}>
                    {result.errors.map((err, i) => (
                      <Text
                        key={i}
                        style={[
                          styles.errorText,
                          {
                            color: colors.textSubtle,
                            fontFamily: FONTS.regular,
                          },
                        ]}
                      >
                        {err}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </DraggableSheet>
      </View>
    </Modal>
  );
}

function ResultRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colors = useThemeColors();
  return (
    <View style={styles.resultRow}>
      <Text
        style={[
          styles.resultLabel,
          { color: colors.textSecondary, fontFamily: FONTS.regular },
        ]}
      >
        {label}
      </Text>
      <Text style={[styles.resultValue, { color, fontFamily: FONTS.bold }]}>
        {value}
      </Text>
    </View>
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
  loadingRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  loadingLabel: { fontSize: 14 },
  resultCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultLabel: { fontSize: 14 },
  resultValue: { fontSize: 16 },
  errorsBox: { marginTop: SPACING.xs, gap: 4 },
  errorText: { fontSize: 12, lineHeight: 16 },
});
