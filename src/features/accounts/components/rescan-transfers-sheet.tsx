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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function RescanTransfersSheet({ visible, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { rescan, isRescanning } = useRescanTransfers();

  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (visible) {
      setStarted(false);
      setFailed(false);
    }
  }, [visible]);

  async function handleStart() {
    setFailed(false);
    try {
      await rescan();
      setStarted(true);
    } catch {
      setFailed(true);
    }
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
            {!started ? (
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
                    { backgroundColor: colors.primaryMid },
                  ]}
                >
                  <Ionicons
                    name="checkmark-outline"
                    size={26}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.resultTitle,
                    { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                  ]}
                >
                  Scan started
                </Text>
                <Text
                  style={[
                    styles.bodyText,
                    { color: colors.textSecondary, fontFamily: FONTS.regular },
                  ]}
                >
                  This runs in the background — we&apos;ll notify you when
                  it&apos;s done and what we found.
                </Text>
              </>
            )}
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            {!started ? (
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
});
