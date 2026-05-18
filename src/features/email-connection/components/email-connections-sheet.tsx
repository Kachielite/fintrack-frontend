import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { EmailConnection } from "../email-connection.interface";
import { EmailConnectionService } from "../email-connection.service";
import { useEmailConnections } from "../hooks/use-email-connections";
import { useConnectionStats } from "../hooks/use-connection-stats";
import { useTriggerSync } from "../hooks/use-trigger-sync";
import EmptyState from "@/core/common/components/EmptyState";
import SkeletonBox from "@/core/common/components/SkeletonBox";
import { formatDate } from "@/core/common/utils/date";

const SCREEN_HEIGHT = Dimensions.get("window").height;

// ─── Stat pill ─────────────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: number }) {
  const colors = useThemeColors();
  return (
    <View style={[styles.statPill, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
        {label}
      </Text>
    </View>
  );
}

// ─── Connection card ───────────────────────────────────────────────────────────

function ConnectionCard({ connection }: { connection: EmailConnection }) {
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const { stats, isLoading: statsLoading, refetch: refetchStats, isRefetching: statsRefetching } = useConnectionStats(connection.id);
  const { triggerSync, isSyncing } = useTriggerSync();

  const deleteDataMutation = useMutation({
    mutationFn: () => EmailConnectionService.deleteConnectionData(connection.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_CONNECTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTION_SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSIGHTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHART_DATA] });
    },
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: () => EmailConnectionService.deleteConnection(connection.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_CONNECTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    },
  });

  const isActive = connection.status === "active";
  const isExpired = connection.status === "expired";
  const statusColor = isActive ? colors.success : isExpired ? colors.warning : colors.error;
  const statusLabel = isActive ? "Active" : isExpired ? "Expired" : "Revoked";

  function handleSync() {
    triggerSync(connection.id);
    Alert.alert("Sync started", "We're scanning for new bank emails. This runs in the background.");
  }

  function handleDeleteData() {
    Alert.alert(
      "Delete all data",
      `This will permanently delete all transactions and scanned emails for ${connection.gmailAddress}. The connection itself will remain.\n\nThis cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete data", style: "destructive", onPress: () => deleteDataMutation.mutate() },
      ],
    );
  }

  function handleRevoke() {
    Alert.alert(
      "Remove connection",
      `This will revoke Gmail access and remove ${connection.gmailAddress} from Vela. Your existing transactions will remain.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => deleteConnectionMutation.mutate() },
      ],
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.gmailIcon, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="mail" size={17} color={colors.primary} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.gmailAddress, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]} numberOfLines={1}>
            {connection.gmailAddress}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor, fontFamily: FONTS.semiBold }]}>
              {statusLabel}
            </Text>
            {connection.gmailLabelName ? (
              <>
                <Text style={[styles.sep, { color: colors.textSubtle }]}>·</Text>
                <Ionicons name="pricetag-outline" size={10} color={colors.textSubtle} />
                <Text style={[styles.metaText, { color: colors.textSubtle, fontFamily: FONTS.regular }]} numberOfLines={1}>
                  {connection.gmailLabelName}
                </Text>
              </>
            ) : null}
          </View>
        </View>
      </View>

      {/* Last synced + stats refresh */}
      <View style={styles.lastSyncRow}>
        <Text style={[styles.lastSync, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
          {connection.lastSyncedAt ? `Last synced ${formatDate(connection.lastSyncedAt)}` : "Not yet synced"}
        </Text>
        <Pressable
          onPress={() => refetchStats()}
          disabled={statsRefetching || statsLoading}
          hitSlop={10}
          style={{ opacity: statsRefetching ? 0.4 : 1 }}
        >
          {statsRefetching
            ? <ActivityIndicator size={12} color={colors.textSubtle} />
            : <Ionicons name="refresh-outline" size={13} color={colors.textSubtle} />}
        </Pressable>
      </View>

      {/* Stats */}
      {statsLoading ? (
        <View style={styles.statsRow}>
          {[1, 2, 3, 4].map((i) => <SkeletonBox key={i} width={60} height={48} radius={RADIUS.md} />)}
        </View>
      ) : stats ? (
        <>
          <View style={styles.statsRow}>
            <StatPill label="Scanned" value={stats.emailsScanned} />
            <StatPill label="Extracted" value={stats.transactionsExtracted} />
            <StatPill label="Skipped" value={stats.nonTransactions} />
            <StatPill label="Failed" value={stats.failed} />
          </View>

          {stats.transactionsExtracted > 0 && (
            <View style={[styles.extractionRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.extractLabelRow}>
                  <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.extractLabel, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>Regex</Text>
                  <Text style={[styles.extractCount, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>{stats.byRegex}</Text>
                </View>
                <View style={styles.extractLabelRow}>
                  <View style={[styles.dot, { backgroundColor: colors.success }]} />
                  <Text style={[styles.extractLabel, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>AI</Text>
                  <Text style={[styles.extractCount, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>{stats.byAi}</Text>
                </View>
              </View>
              <View style={styles.miniBar}>
                <View style={[styles.miniBarSeg, { flex: stats.byRegex || 0.001, backgroundColor: colors.primary, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }]} />
                <View style={[styles.miniBarSeg, { flex: stats.byAi || 0.001, backgroundColor: colors.success, borderTopRightRadius: 3, borderBottomRightRadius: 3 }]} />
              </View>
            </View>
          )}
        </>
      ) : null}

      {/* Actions */}
      <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleSync}
          disabled={isSyncing || !isActive}
          style={[styles.actionBtn, { backgroundColor: colors.primaryLight, opacity: !isActive ? 0.4 : 1 }]}
        >
          {isSyncing
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Ionicons name="refresh-outline" size={13} color={colors.primary} />}
          <Text style={[styles.actionText, { color: colors.primary, fontFamily: FONTS.semiBold }]}>
            {isSyncing ? "Syncing…" : "Sync now"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDeleteData}
          disabled={deleteDataMutation.isPending}
          style={[styles.actionBtn, { backgroundColor: colors.warningLight }]}
        >
          {deleteDataMutation.isPending
            ? <ActivityIndicator size="small" color={colors.warning} />
            : <Ionicons name="trash-outline" size={13} color={colors.warning} />}
          <Text style={[styles.actionText, { color: colors.warning, fontFamily: FONTS.semiBold }]}>Delete data</Text>
        </Pressable>

        <Pressable
          onPress={handleRevoke}
          disabled={deleteConnectionMutation.isPending}
          style={[styles.actionBtn, { backgroundColor: colors.error + "15" }]}
        >
          {deleteConnectionMutation.isPending
            ? <ActivityIndicator size="small" color={colors.error} />
            : <Ionicons name="unlink-outline" size={13} color={colors.error} />}
          <Text style={[styles.actionText, { color: colors.error, fontFamily: FONTS.semiBold }]}>Revoke</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Sheet ────────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function EmailConnectionsSheet({ visible, onClose }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { connections, isLoading } = useEmailConnections();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={sheet.overlay}>
        <Pressable style={sheet.backdrop} onPress={onClose} />

        <View style={[sheet.panel, { backgroundColor: colors.surface, paddingBottom: insets.bottom + SPACING.lg }]}>
          <View style={[sheet.handle, { backgroundColor: colors.borderStrong }]} />

          <View style={sheet.header}>
            <Text style={[sheet.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
              Email connections
            </Text>
            <Pressable onPress={onClose} hitSlop={12} style={[sheet.closeBtn, { backgroundColor: colors.surface2 }]}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={sheet.body}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <View style={{ gap: SPACING.md }}>
                {[0, 1].map((i) => (
                  <View key={i} style={[styles.card, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                    <View style={[styles.cardHeader, { padding: SPACING.base }]}>
                      <SkeletonBox width={34} height={34} radius={RADIUS.md} />
                      <View style={{ flex: 1, gap: 6 }}>
                        <SkeletonBox width="55%" height={12} radius={5} />
                        <SkeletonBox width="35%" height={10} radius={4} />
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: 6, paddingHorizontal: SPACING.base, paddingBottom: SPACING.sm }}>
                      {[1, 2, 3, 4].map((j) => <SkeletonBox key={j} width={60} height={48} radius={RADIUS.md} />)}
                    </View>
                  </View>
                ))}
              </View>
            ) : connections.length === 0 ? (
              <View style={[styles.card, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
                <EmptyState
                  icon="mail-outline"
                  message="No email connections"
                  subMessage="Connect a Gmail account to start scanning your bank emails."
                />
              </View>
            ) : (
              <View style={{ gap: SPACING.md }}>
                {connections.map((c) => <ConnectionCard key={c.id} connection={c} />)}
              </View>
            )}

            <View style={[sheet.infoRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
              <Text style={[sheet.infoText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
                Vela has read-only access to your selected Gmail label. We never store your full emails.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.base,
    paddingBottom: SPACING.xs,
  },
  gmailIcon: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  gmailAddress: { fontSize: 13, letterSpacing: -0.2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 99 },
  statusText: { fontSize: 10 },
  sep: { fontSize: 10 },
  metaText: { fontSize: 10, flexShrink: 1 },
  lastSyncRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: SPACING.base, paddingBottom: SPACING.sm },
  lastSync: { fontSize: 11 },
  statsRow: { flexDirection: "row", gap: SPACING.xs, paddingHorizontal: SPACING.base, paddingBottom: SPACING.sm },
  statPill: {
    flex: 1,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    gap: 2,
  },
  statValue: { fontSize: FONT_SIZE.body },
  statLabel: { fontSize: 9 },
  extractionRow: {
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  extractLabelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 99 },
  extractLabel: { fontSize: 11, flex: 1 },
  extractCount: { fontSize: 11 },
  miniBar: {
    flexDirection: "row",
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  miniBarSeg: { height: "100%" },
  actionsRow: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: SPACING.xs,
    padding: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  actionText: { fontSize: 12 },
});

const sheet = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  panel: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  handle: { width: 36, height: 4, borderRadius: 99, alignSelf: "center", marginTop: 12, marginBottom: 4 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: { width: 34, height: 34, borderRadius: 99, alignItems: "center", justifyContent: "center" },
  body: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg, gap: SPACING.md },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
