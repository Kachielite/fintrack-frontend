import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import { FONTS, SPACING, RADIUS } from "@/core/common/constants/theme";
import { GoalAlignmentStatus, InsightChartPoint, InsightDetail } from "../insights.interface";

function fmtValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
  return String(Math.round(v));
}

function InsightBarChart({ data }: { data: InsightChartPoint[] }) {
  const colors = useThemeColors();
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.chartCard, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
      <View style={styles.chartBars}>
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          return (
            <View key={d.label} style={styles.barCol}>
              <Text
                style={[styles.barValue, { color: d.highlight ? colors.primary : colors.textSubtle, fontFamily: FONTS.semiBold }]}
                numberOfLines={1}
              >
                {fmtValue(d.value)}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${Math.max(pct, 4)}%` as any, backgroundColor: d.highlight ? colors.primary : colors.border },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  { color: d.highlight ? colors.primary : colors.textSubtle, fontFamily: d.highlight ? FONTS.bold : FONTS.semiBold },
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

const GOAL_ALIGNMENT_LABEL: Record<GoalAlignmentStatus, string> = {
  on_track: "On track",
  ahead: "Ahead of goal",
  behind: "Behind goal",
  no_goals: "No goal set",
};

function GoalAlignmentPill({ status }: { status: GoalAlignmentStatus }) {
  const colors = useThemeColors();
  const color = status === "behind" ? colors.warning : status === "no_goals" ? colors.textSubtle : colors.success;

  return (
    <View style={[styles.goalPill, { backgroundColor: color + "1A", borderColor: color + "55" }]}>
      <Text style={[styles.goalPillText, { color, fontFamily: FONTS.semiBold }]}>
        {GOAL_ALIGNMENT_LABEL[status]}
      </Text>
    </View>
  );
}

interface Props {
  detail: InsightDetail;
}

export default function InsightReportDetail({ detail }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.headline, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>
        {detail.headline}
      </Text>

      {detail.findings.length > 0 && (
        <View style={styles.findings}>
          {detail.findings.map((finding, i) => (
            <View key={i} style={styles.findingRow}>
              <View style={[styles.findingDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.findingText, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>
                {finding}
              </Text>
            </View>
          ))}
        </View>
      )}

      {detail.chart_data && detail.chart_data.length > 0 && <InsightBarChart data={detail.chart_data} />}

      {detail.closing && (
        <View style={[styles.closingCard, { backgroundColor: colors.primaryLight, borderColor: colors.primaryMid }]}>
          {detail.goal_alignment && detail.goal_alignment.status !== "no_goals" && (
            <GoalAlignmentPill status={detail.goal_alignment.status} />
          )}
          <Text style={[styles.closingText, { color: colors.textPrimary, fontFamily: FONTS.regular }]}>
            {detail.closing}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: SPACING.sm },
  headline: { fontSize: 18, lineHeight: 26, letterSpacing: -0.4 },
  findings: { gap: 6 },
  findingRow: { flexDirection: "row", gap: SPACING.xs, alignItems: "flex-start" },
  findingDot: { width: 5, height: 5, borderRadius: 3, marginTop: 8 },
  findingText: { flex: 1, fontSize: 14, lineHeight: 21 },
  chartCard: { borderRadius: RADIUS.lg, borderWidth: 1, padding: SPACING.base },
  chartBars: { flexDirection: "row", alignItems: "flex-end", height: 100, gap: 6 },
  barCol: { flex: 1, alignItems: "center", gap: 4, height: "100%" as any },
  barValue: { fontSize: 9, textAlign: "center" },
  barTrack: { flex: 1, width: "100%", justifyContent: "flex-end" },
  barFill: { width: "100%", borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 11, textAlign: "center" },
  closingCard: { borderRadius: RADIUS.lg, borderWidth: 1, padding: SPACING.md, gap: SPACING.xs },
  closingText: { fontSize: 14, lineHeight: 22 },
  goalPill: {
    alignSelf: "flex-start",
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  goalPillText: { fontSize: 11, letterSpacing: 0.2 },
});
