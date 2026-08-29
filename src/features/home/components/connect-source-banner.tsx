import React from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useAuthStore } from "@/features/auth/auth.state";
import { useConnectGmail } from "@/features/email-connection/hooks/use-connect-gmail";

interface Props {
  onDismiss: () => void;
  onImportPress: () => void;
}

export default function ConnectSourceBanner({ onDismiss, onImportPress }: Props) {
  const colors = useThemeColors();
  const setDataSourceSkipped = useAuthStore((s) => s.setDataSourceSkipped);
  const { connectGmail, isConnecting } = useConnectGmail();

  function handleConnect() {
    connectGmail({ onSuccess: () => setDataSourceSkipped(false) });
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
        <Ionicons name="link-outline" size={12} color={colors.primary} />
        <Text style={[styles.label, { color: colors.primary, fontFamily: FONTS.bold }]}>
          SET UP AUTOMATIC IMPORTS
        </Text>
      </View>

      <Text style={[styles.message, { color: colors.textPrimary, fontFamily: FONTS.medium }]}>
        Connect your email or import a bank statement so Vela can organise
        your spending for you.
      </Text>

      <View style={styles.actions}>
        <Pressable
          onPress={handleConnect}
          disabled={isConnecting}
          style={[
            styles.btn,
            styles.btnPrimary,
            { backgroundColor: colors.primary, opacity: isConnecting ? 0.7 : 1 },
          ]}
        >
          {isConnecting ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <Text style={[styles.btnText, { color: colors.onPrimary, fontFamily: FONTS.semiBold }]}>
              Connect email
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={onImportPress}
          style={[styles.btn, styles.btnGhost, { borderColor: colors.border }]}
        >
          <Text style={[styles.btnText, { color: colors.textSecondary, fontFamily: FONTS.semiBold }]}>
            Import statement
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
