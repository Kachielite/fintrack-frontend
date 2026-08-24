import React from "react";
import DraggableSheet from "@/core/common/components/DraggableSheet";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, FONT_SIZE, SPACING, RADIUS } from "@/core/common/constants/theme";
import {
  Insight,
  InsightType,
  InsightChartPoint,
} from "@/features/insights/insights.interface";
import { useMarkInsightRead } from "@/features/insights/hooks/use-mark-insight-read";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const CHART_HEIGHT = 120;

function timeUntilNextRun(): string {
  const now = new Date();
  const next = new Date();
  next.setHours(2, 30, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const diffMs = next.getTime() - now.getTime();
  const h = Math.floor(diffMs / 3_600_000);
  const m = Math.floor((diffMs % 3_600_000) / 60_000);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

const TYPE_SUBTITLE: Record<InsightType, string> = {
  spending_pattern: "On your spending habits",
  budget_warning: "On your budget",
  goal_progress: "On your savings goal",
  fx_impact: "On your currencies",
  subscription_alert: "On your subscriptions",
  positive_reinforcement: "On your progress",
};

// ─── Bar chart ────────────────────────────────────────────────────────────────

function BarChart({
  data,
}: {
  data: InsightChartPoint[];
}) {
  const colors = useThemeColors();
  const max = Math.max(...data.map((d) => d.value), 1);

  const fmt = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
    return String(Math.round(v));
  };

  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: colors.surface2, borderColor: colors.border },
      ]}
    >
      <View style={styles.chartBars}>
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          return (
            <View key={d.label} style={styles.barCol}>
              <Text
                style={[
                  styles.barValue,
                  {
                    color: d.highlight ? colors.primary : colors.textSubtle,
                    fontFamily: FONTS.semiBold,
                  },
                ]}
                numberOfLines={1}
              >
                {fmt(d.value)}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(pct, 4)}%`,
                      backgroundColor: d.highlight ? colors.primary : colors.border,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  {
                    color: d.highlight ? colors.primary : colors.textSubtle,
                    fontFamily: d.highlight ? FONTS.bold : FONTS.semiBold,
                  },
                ]}
                numberOfLines={1}
              >
                {d.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Main sheet ───────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
  insight: Insight;
}

export default function InsightSheet({ visible, onClose, insight }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { markRead, isMarking } = useMarkInsightRead();

  const raw = insight.contextData;
  const detail = raw && (raw as any).title ? (raw as any) : null;
  const subtitle = TYPE_SUBTITLE[insight.type] ?? "On your finances";
  const refreshIn = timeUntilNextRun();

  function handleDone() {
    if (!insight.isRead) markRead(insight.id);
    onClose();
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
        <Pressable style={styles.backdrop} onPress={onClose} />

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
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: colors.textPrimary, fontFamily: FONTS.bold },
              ]}
            >
              Insight
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            {/* Iris identity */}
            <View style={styles.irisRow}>
              <View
                style={[styles.irisBadge, { backgroundColor: colors.primary }]}
              >
                <Text
                  style={[
                    styles.irisInitial,
                    { color: colors.onPrimary, fontFamily: FONTS.bold },
                  ]}
                >
                  I
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.irisName,
                    { color: colors.textPrimary, fontFamily: FONTS.bold },
                  ]}
                >
                  Iris's read
                </Text>
                <Text
                  style={[
                    styles.irisSubtitle,
                    { color: colors.textSubtle, fontFamily: FONTS.regular },
                  ]}
                >
                  {subtitle}
                </Text>
              </View>
            </View>

            {/* No detail yet — empty state */}
            {!detail ? (
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: colors.surface2,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="hourglass-outline"
                  size={28}
                  color={colors.textSubtle}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: colors.textPrimary, fontFamily: FONTS.semiBold },
                  ]}
                >
                  Full analysis not available yet
                </Text>
                <Text
                  style={[
                    styles.emptyBody,
                    { color: colors.textSubtle, fontFamily: FONTS.regular },
                  ]}
                >
                  Iris refreshes every night at 2:30 AM.{"\n"}Next update in{" "}
                  <Text style={{ color: colors.primary, fontFamily: FONTS.semiBold }}>
                    {refreshIn}
                  </Text>
                  .
                </Text>
              </View>
            ) : (
              <>
                {/* Headline */}
                <Text
                  style={[
                    styles.headline,
                    { color: colors.textPrimary, fontFamily: FONTS.bold },
                  ]}
                >
                  {detail.title}
                </Text>

                {/* Supporting body */}
                {detail.body ? (
                  <Text
                    style={[
                      styles.bodyText,
                      {
                        color: colors.textSecondary,
                        fontFamily: FONTS.regular,
                      },
                    ]}
                  >
                    {detail.body}
                  </Text>
                ) : null}

                {/* Bar chart */}
                {detail.chart_data && detail.chart_data.length > 0 ? (
                  <BarChart data={detail.chart_data} />
                ) : null}

                {/* Action / tip card */}
                {detail.action_text ? (
                  <View
                    style={[
                      styles.tipCard,
                      {
                        backgroundColor: colors.primaryLight,
                        borderColor: colors.primaryMid,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tipText,
                        { color: colors.textPrimary, fontFamily: FONTS.regular },
                      ]}
                    >
                      {detail.action_text}
                    </Text>
                  </View>
                ) : null}
              </>
            )}

            {/* CTA */}
            <Pressable
              onPress={handleDone}
              disabled={isMarking}
              style={[
                styles.cta,
                {
                  backgroundColor: colors.primary,
                  opacity: isMarking ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.ctaText,
                  { color: colors.onPrimary, fontFamily: FONTS.semiBold },
                ]}
              >
                Got it, thanks Iris
              </Text>
            </Pressable>
          </ScrollView>
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
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.88,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 99,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.h2, letterSpacing: -0.4 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    gap: SPACING.lg,
  },
  irisRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  irisBadge: {
    width: 38,
    height: 38,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  irisInitial: { fontSize: 16 },
  irisName: { fontSize: 14 },
  irisSubtitle: { fontSize: 12, marginTop: 1 },
  headline: { fontSize: 22, lineHeight: 30, letterSpacing: -0.5 },
  bodyText: { fontSize: 14, lineHeight: 22, marginTop: -SPACING.xs },
  // Chart
  chartCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: CHART_HEIGHT,
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    height: "100%",
  },
  barValue: { fontSize: 9, textAlign: "center" },
  barTrack: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  barFill: { width: "100%", borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 11, textAlign: "center" },
  // Tip
  tipCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.base,
  },
  tipText: { fontSize: 14, lineHeight: 22, letterSpacing: -0.1 },
  // Empty state
  emptyCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.xl,
    alignItems: "center",
    gap: SPACING.sm,
  },
  emptyTitle: { fontSize: 15, textAlign: "center" },
  emptyBody: { fontSize: 13, lineHeight: 20, textAlign: "center" },
  // CTA
  cta: {
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md + 2,
    alignItems: "center",
  },
  ctaText: { fontSize: 16, letterSpacing: -0.2 },
});
