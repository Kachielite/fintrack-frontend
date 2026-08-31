import React, { useState } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { useProfile } from "@/features/user/hooks/use-profile";
import { useEmailConnections } from "@/features/email-connection/hooks/use-email-connections";
import { useConnectGmail } from "@/features/email-connection/hooks/use-connect-gmail";
import PlansSheet from "@/features/user/components/plans-sheet";
import { useAddActionStore } from "../add-action.state";

// Mirrors the backend's free-tier cap (fintrack-backend's
// getMaxEmailConnectionsForPlan in user.constants.ts) purely for a proactive
// UX pre-check. The backend is the real source of truth: if this is ever
// stale, the OAuth callback rejects with PLAN_LIMIT_EMAIL_CONNECTIONS and
// handleAddEmailConnection below shows the same upgrade prompt on that error.
const FREE_TIER_MAX_EMAIL_CONNECTIONS = 1;

export default function AddActionSheet() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const isChooserOpen = useAddActionStore((s) => s.isChooserOpen);
  const closeChooser = useAddActionStore((s) => s.closeChooser);
  const openImport = useAddActionStore((s) => s.openImport);

  const { profile } = useProfile();
  const { connections } = useEmailConnections();
  const { connectGmail, isConnecting } = useConnectGmail();
  const [plansOpen, setPlansOpen] = useState(false);

  const isFree = (profile?.planTier ?? "free") === "free";
  const nonRevokedCount = connections.filter((c) => c.status !== "revoked").length;
  const atLimit = isFree && nonRevokedCount >= FREE_TIER_MAX_EMAIL_CONNECTIONS;

  function handleImportStatement() {
    closeChooser();
    openImport();
  }

  function handleAddEmailConnection() {
    if (atLimit) {
      closeChooser();
      setPlansOpen(true);
      return;
    }
    closeChooser();
    connectGmail({
      onError: (error) => {
        if (error.message === "PLAN_LIMIT_EMAIL_CONNECTIONS") {
          // The client-side pre-check above was stale (e.g. another device
          // connected an email in between) — the backend rejected it for
          // real. Same upgrade prompt, not a raw error toast.
          setPlansOpen(true);
        } else {
          Toast.show({ type: "error", text1: error.message || "Couldn't connect Gmail" });
        }
      },
    });
  }

  return (
    <>
      <Modal
        visible={isChooserOpen}
        transparent
        animationType="slide"
        onRequestClose={closeChooser}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeChooser} />
          <DraggableSheet
            style={[
              styles.sheet,
              { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg },
            ]}
            onClose={closeChooser}
            handleColor={colors.borderStrong}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
                Add
              </Text>
              <Pressable
                onPress={closeChooser}
                hitSlop={12}
                style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.body}>
              <Pressable
                onPress={handleImportStatement}
                style={[styles.row, { borderColor: colors.border, backgroundColor: colors.background }]}
              >
                <View style={[styles.rowIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowLabel, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                    Import statement
                  </Text>
                  <Text style={[styles.rowSub, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                    CSV, Excel, PDF, or Word
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textSubtle} />
              </Pressable>

              <Pressable
                onPress={handleAddEmailConnection}
                disabled={isConnecting}
                style={[
                  styles.row,
                  { borderColor: colors.border, backgroundColor: colors.background, opacity: isConnecting ? 0.6 : 1 },
                ]}
              >
                <View style={[styles.rowIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="mail-outline" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowLabel, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
                    Add email connection
                  </Text>
                  <Text style={[styles.rowSub, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                    Scan a Gmail account for bank alerts
                  </Text>
                </View>
                {atLimit ? (
                  <View style={[styles.proBadge, { backgroundColor: colors.primaryMid }]}>
                    <Text style={[styles.proLabel, { color: colors.primary, fontFamily: FONTS.bold }]}>Pro</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={16} color={colors.textSubtle} />
                )}
              </Pressable>
            </View>
          </DraggableSheet>
        </View>
      </Modal>

      <PlansSheet
        visible={plansOpen}
        currentTier={profile?.planTier ?? "free"}
        onClose={() => setPlansOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
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
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 15 },
  rowSub: { fontSize: 12, marginTop: 2 },
  proBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  proLabel: { fontSize: 10, letterSpacing: 0.2 },
});
