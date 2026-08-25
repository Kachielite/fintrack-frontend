import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
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
} from "@/core/common/constants/theme";
import { useRescanTransfers } from "../hooks/use-rescan-transfers";
import { RescanTransfersResult } from "../accounts.dto";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  onReview: () => void;
}

export default function RescanTransfersSheet({
  visible,
  onClose,
  onReview,
}: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { rescan, isRescanning } = useRescanTransfers();

  const [result, setResult] = useState<RescanTransfersResult | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (visible) {
      setResult(null);
      setFailed(false);
    }
  }, [visible]);

  async function handleStart() {
    setFailed(false);
    try {
      const r = await rescan();
      setResult(r);
    } catch {
      setFailed(true);
    }
  }

  function handleReview() {
    onClose();
    onReview();
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
            <Text
              style={[
                styles.title,
                { color: colors.textPrimary, fontFamily: FONTS.bold },
              ]}
            >
              Re-scan for Transfers
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.body}>
            {result === null ? (
              <>
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: colors.primaryMid },
                  ]}
                >
                  <Ionicons
                    name="sync-outline"
                    size={26}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.bodyText,
                    { color: colors.textSecondary, fontFamily: FONTS.regular },
                  ]}
                >
                  We&apos;ll look through your full transaction history for
                  self-transfers and currency conversions we may have missed,
                  and exclude them from your totals. Safe to run any time.
                </Text>
                {failed && (
                  <Text
                    style={[
                      styles.errorText,
                      { color: colors.error, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    Something went wrong — please try again.
                  </Text>
                )}
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor:
                        result.linked > 0 ? colors.primaryMid : colors.surface2,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      result.linked > 0
                        ? "checkmark-circle-outline"
                        : "checkmark-outline"
                    }
                    size={26}
                    color={
                      result.linked > 0 ? colors.primary : colors.textSubtle
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.resultTitle,
                    { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                  ]}
                >
                  {result.linked > 0
                    ? `Found ${result.linked} transfer${result.linked === 1 ? "" : "s"}`
                    : "No new transfers found"}
                </Text>
                <Text
                  style={[
                    styles.bodyText,
                    { color: colors.textSecondary, fontFamily: FONTS.regular },
                  ]}
                >
                  Checked {result.scanned} transaction
                  {result.scanned === 1 ? "" : "s"}.
                  {result.linked > 0
                    ? " We excluded them from your spend and income totals."
                    : ""}
                </Text>
              </>
            )}
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            {result === null ? (
              <Pressable
                onPress={handleStart}
                disabled={isRescanning}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: colors.primary,
                    opacity: isRescanning ? 0.7 : 1,
                  },
                ]}
              >
                {isRescanning ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text
                    style={[
                      styles.primaryBtnLabel,
                      { color: colors.onPrimary, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    Start scan
                  </Text>
                )}
              </Pressable>
            ) : result.linked > 0 ? (
              <View style={{ gap: SPACING.sm }}>
                <Pressable
                  onPress={handleReview}
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.primaryBtnLabel,
                      { color: colors.onPrimary, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    Review transfers
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onClose}
                  style={[styles.secondaryBtn, { borderColor: colors.border }]}
                >
                  <Text
                    style={[
                      styles.secondaryBtnLabel,
                      { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                    ]}
                  >
                    Done
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={onClose}
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
              >
                <Text
                  style={[
                    styles.primaryBtnLabel,
                    { color: colors.onPrimary, fontFamily: FONTS.semiBold },
                  ]}
                >
                  Done
                </Text>
              </Pressable>
            )}
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
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.h2,
    letterSpacing: -0.4,
    flex: 1,
    marginRight: SPACING.sm,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    alignItems: "center",
    gap: SPACING.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  resultTitle: {
    fontSize: FONT_SIZE.h3,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  bodyText: { fontSize: 14, lineHeight: 20, textAlign: "center" },
  errorText: { fontSize: 13, textAlign: "center" },
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
  secondaryBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryBtnLabel: { fontSize: FONT_SIZE.body, letterSpacing: -0.2 },
});
