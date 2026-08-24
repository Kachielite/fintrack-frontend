import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect, Line, Circle, Path, G, Text as SvgText } from "react-native-svg";
import { IrisChartData } from "../iris.interface";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";

interface Props {
  chart: IrisChartData;
}

// ─── Bar chart ───────────────────────────────────────────────────────────────

function BarChart({ chart, primaryColor, subtleColor, textColor, borderColor }: {
  chart: IrisChartData;
  primaryColor: string;
  subtleColor: string;
  textColor: string;
  borderColor: string;
}) {
  const maxValue = Math.max(...chart.data.map((d) => d.value), 1);

  return (
    <View style={styles.card}>
      {chart.data.map((point, i) => (
        <View key={i} style={styles.barRow}>
          <Text style={[styles.barLabel, { color: subtleColor }]} numberOfLines={1}>
            {point.label}
          </Text>
          <View style={[styles.barTrack, { backgroundColor: borderColor }]}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${(point.value / maxValue) * 100}%`,
                  backgroundColor: point.highlight ? primaryColor : subtleColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.barValue, { color: point.highlight ? primaryColor : textColor }]}>
            {point.value >= 1_000_000
              ? `${(point.value / 1_000_000).toFixed(1)}M`
              : point.value >= 1_000
              ? `${(point.value / 1_000).toFixed(0)}K`
              : String(point.value)}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ─── Line chart ──────────────────────────────────────────────────────────────

function LineChart({ chart, primaryColor, subtleColor, textColor }: {
  chart: IrisChartData;
  primaryColor: string;
  subtleColor: string;
  textColor: string;
}) {
  const W = 280, H = 110, PAD_L = 36, PAD_B = 24, PAD_T = 8, PAD_R = 8;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const values = chart.data.map((d) => d.value);
  const maxV = Math.max(...values, 1);
  const minV = Math.min(...values, 0);
  const range = maxV - minV || 1;

  const toX = (i: number) => PAD_L + (i / Math.max(chart.data.length - 1, 1)) * innerW;
  const toY = (v: number) => PAD_T + (1 - (v - minV) / range) * innerH;

  const pathD = chart.data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(d.value).toFixed(1)}`)
    .join(" ");

  return (
    <View style={styles.card}>
      <Svg width={W} height={H}>
        {/* Grid lines */}
        {[0, 0.5, 1].map((t) => {
          const y = PAD_T + t * innerH;
          return <Line key={t} x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke={subtleColor} strokeWidth={0.5} strokeDasharray="3 3" />;
        })}
        {/* Line */}
        <Path d={pathD} stroke={primaryColor} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {chart.data.map((d, i) => (
          <Circle key={i} cx={toX(i)} cy={toY(d.value)} r={d.highlight ? 5 : 3.5}
            fill={d.highlight ? primaryColor : "#fff"} stroke={primaryColor} strokeWidth={2} />
        ))}
        {/* X labels */}
        {chart.data.map((d, i) => (
          <SvgText key={i} x={toX(i)} y={H - 4} fontSize={9} fill={subtleColor} textAnchor="middle">
            {d.label.length > 6 ? d.label.slice(0, 6) : d.label}
          </SvgText>
        ))}
        {/* Y label (max) */}
        <SvgText x={PAD_L - 2} y={PAD_T + 4} fontSize={9} fill={subtleColor} textAnchor="end">
          {maxV >= 1000 ? `${(maxV / 1000).toFixed(0)}K` : maxV}
        </SvgText>
      </Svg>
    </View>
  );
}

// ─── Pie / donut chart ────────────────────────────────────────────────────────

const PIE_COLORS = ["#C77638", "#E2A96B", "#6B9EC7", "#6BC78A", "#C76B9E", "#C7C76B", "#9E6BC7"];

function PieChart({ chart, subtleColor, textColor }: {
  chart: IrisChartData;
  subtleColor: string;
  textColor: string;
}) {
  const SIZE = 140, CX = SIZE / 2, CY = SIZE / 2, R = 52, INNER_R = 30;
  const total = chart.data.reduce((s, d) => s + d.value, 0) || 1;

  let cursor = -Math.PI / 2; // start at top
  const slices = chart.data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = cursor;
    cursor += angle;
    return { ...d, startAngle, endAngle: cursor, color: PIE_COLORS[i % PIE_COLORS.length] };
  });

  function slicePath(startAngle: number, endAngle: number) {
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    const ix1 = CX + INNER_R * Math.cos(endAngle);
    const iy1 = CY + INNER_R * Math.sin(endAngle);
    const ix2 = CX + INNER_R * Math.cos(startAngle);
    const iy2 = CY + INNER_R * Math.sin(startAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${INNER_R} ${INNER_R} 0 ${large} 0 ${ix2} ${iy2} Z`;
  }

  return (
    <View style={[styles.card, styles.pieRow]}>
      <Svg width={SIZE} height={SIZE}>
        <G>
          {slices.map((s, i) => (
            <Path key={i} d={slicePath(s.startAngle, s.endAngle)} fill={s.color} />
          ))}
        </G>
      </Svg>
      {/* Legend */}
      <View style={styles.pieLegend}>
        {slices.map((s, i) => (
          <View key={i} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: s.color }]} />
            <Text style={[styles.legendLabel, { color: textColor }]} numberOfLines={1}>
              {s.label}
            </Text>
            <Text style={[styles.legendValue, { color: subtleColor }]}>
              {((s.value / total) * 100).toFixed(0)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Router ──────────────────────────────────────────────────────────────────

export default function ChartCard({ chart }: Props) {
  const colors = useThemeColors();

  if (chart.type === "line_over_time") {
    return (
      <LineChart
        chart={chart}
        primaryColor={colors.primary}
        subtleColor={colors.textSubtle}
        textColor={colors.textPrimary}
      />
    );
  }

  if (chart.type === "pie_by_category" || chart.type === "pie_by_merchant" as any) {
    return (
      <PieChart
        chart={chart}
        subtleColor={colors.textSubtle}
        textColor={colors.textPrimary}
      />
    );
  }

  // Default: bar chart (bar_by_category | bar_by_merchant)
  return (
    <BarChart
      chart={chart}
      primaryColor={colors.primary}
      subtleColor={colors.textSubtle}
      textColor={colors.textPrimary}
      borderColor={colors.border}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    gap: 8,
  },
  // Bar
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barLabel: {
    width: 90,
    fontSize: 12,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  barValue: {
    width: 48,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "600",
  },
  // Pie
  pieRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pieLegend: {
    flex: 1,
    gap: 6,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
  },
  legendValue: {
    fontSize: 11,
    fontWeight: "600",
  },
});
