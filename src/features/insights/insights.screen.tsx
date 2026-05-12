import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  Alert,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { TransactionQueryParams } from "@/features/transactions/transactions.dto";
import { Transaction } from "@/features/transactions/transactions.interface";
import { CATEGORY_LABELS, CATEGORY_ICON_NAMES } from "@/features/transactions/transactions.constants";
import DrilldownSheet from "./components/drilldown-sheet";
import TransactionDetailSheet from "@/features/transactions/components/transaction-detail-sheet";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Text as SvgText,
} from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useThemeColors } from "@/core/common/hooks/use-theme-colors";
import {
  FONTS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  CATEGORY_COLORS,
} from "@/core/common/constants/theme";
import { currencySymbol } from "@/core/common/utils/currency";
import { RootStackParamList } from "@/core/navigation/root-navigator";
import GlassCard from "@/core/common/components/GlassCard";
import DonutChart from "@/core/common/components/DonutChart";
import { useInsights } from "./hooks/use-insights";
import { useMarkInsightRead } from "./hooks/use-mark-insight-read";
import {
  useChartData,
  Period,
  DailyPoint,
  CategoryPoint,
  MonthlyPoint,
  DayPoint,
  CurrencyPoint,
  MerchantPoint,
} from "./hooks/use-chart-data";

// ──────────────────────────────────────────────────────────
// Period options
// ──────────────────────────────────────────────────────────
type UIPeriod = "1m" | "3m" | "6m" | "year" | "all";

interface PeriodOption {
  value: UIPeriod;
  label: string;
  locked: boolean;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: "1m",   label: "1 Month",   locked: false },
  { value: "3m",   label: "3 Months",  locked: false },
  { value: "6m",   label: "6 Months",  locked: true  },
  { value: "year", label: "This Year", locked: true  },
  { value: "all",  label: "All Time",  locked: true  },
];

const PERIOD_LABEL: Record<UIPeriod, string> = {
  "1m": "1M", "3m": "3M", "6m": "6M", "year": "Year", "all": "All",
};

function toApiPeriod(p: UIPeriod): Period {
  if (p === "3m") return "3m";
  return "1m"; // locked options never actually fetch
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
function fmtK(val: number, currency?: string): string {
  const sym = currency ? currencySymbol(currency) : "";
  if (val >= 1_000_000) return `${sym}${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${sym}${(val / 1_000).toFixed(0)}K`;
  return `${sym}${val.toFixed(0)}`;
}

const CURRENCY_PALETTE = [
  "#C77638", "#5A84B8", "#5AADA0", "#8A6EB0",
  "#7BAE6B", "#D48A5A", "#D45A7A", "#9A9A8A",
];

// ──────────────────────────────────────────────────────────
// Card question label (inside card, above chart)
// ──────────────────────────────────────────────────────────
function CardQuestion({ text }: { text: string }) {
  const colors = useThemeColors();
  return (
    <Text style={[styles.cardQuestion, { color: colors.textPrimary, fontFamily: FONTS.semiBold }]}>
      {text}
    </Text>
  );
}

// ──────────────────────────────────────────────────────────
// Iris AI card
// ──────────────────────────────────────────────────────────
function InsightBarChart({ data }: { data: { label: string; value: number; highlight: boolean }[] }) {
  const colors = useThemeColors();
  const max = Math.max(...data.map((d) => d.value), 1);
  const fmt = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
    return String(Math.round(v));
  };
  return (
    <View style={[styles.insightChartCard, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
      <View style={styles.insightChartBars}>
        {data.map((d) => {
          const pct = (d.value / max) * 100;
          return (
            <View key={d.label} style={styles.insightBarCol}>
              <Text style={[styles.insightBarValue, { color: d.highlight ? colors.primary : colors.textSubtle, fontFamily: FONTS.semiBold }]} numberOfLines={1}>
                {fmt(d.value)}
              </Text>
              <View style={styles.insightBarTrack}>
                <View style={[styles.insightBarFill, { height: `${Math.max(pct, 4)}%` as any, backgroundColor: d.highlight ? colors.primary : colors.border }]} />
              </View>
              <Text style={[styles.insightBarLabel, { color: d.highlight ? colors.primary : colors.textSubtle, fontFamily: d.highlight ? FONTS.bold : FONTS.semiBold }]} numberOfLines={1}>
                {d.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function IrisAICard() {
  const colors = useThemeColors();
  const { insights, isLoading } = useInsights();
  const { markRead, isMarking } = useMarkInsightRead();
  const insight = insights[0] ?? null;

  if (isLoading) {
    return (
      <GlassCard style={styles.irisCard}>
        <ActivityIndicator color={colors.primary} />
      </GlassCard>
    );
  }
  if (!insight) return null;

  const detail = insight.contextData && (insight.contextData as any).title
    ? (insight.contextData as any) : null;

  return (
    <GlassCard style={styles.irisCard}>
      <View style={styles.irisHeader}>
        <View style={[styles.irisBadge, { backgroundColor: colors.primaryMid }]}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
          <Text style={[styles.irisBadgeLabel, { color: colors.primary, fontFamily: FONTS.semiBold }]}>Iris AI</Text>
        </View>
        {!insight.isRead && (
          <Pressable onPress={() => markRead(insight.id)} hitSlop={8} disabled={isMarking}>
            <Text style={[styles.markRead, { color: colors.textSubtle, fontFamily: FONTS.medium }]}>Mark read</Text>
          </Pressable>
        )}
      </View>

      <Text style={[styles.irisMessage, { color: colors.textPrimary, fontFamily: FONTS.medium }]}>
        {insight.message}
      </Text>

      {detail && (
        <>
          {detail.title && (
            <Text style={[styles.irisDetailTitle, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>{detail.title}</Text>
          )}
          {detail.body && (
            <Text style={[styles.irisDetailBody, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>{detail.body}</Text>
          )}
          {detail.chart_data?.length > 0 && <InsightBarChart data={detail.chart_data} />}
          {detail.action_text && (
            <View style={[styles.irisTip, { backgroundColor: colors.primaryLight, borderColor: colors.primaryMid }]}>
              <Text style={[styles.irisTipText, { color: colors.textPrimary, fontFamily: FONTS.regular }]}>{detail.action_text}</Text>
            </View>
          )}
        </>
      )}

      {!detail && (
        <View style={[styles.irisEmptyHint, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
          <Text style={[styles.irisEmptyText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
            Full analysis refreshes nightly at 2:30 AM
          </Text>
        </View>
      )}

      {insight.expiresAt && (
        <Text style={[styles.irisExpiry, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
          Expires {new Date(insight.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </Text>
      )}
    </GlassCard>
  );
}

// ──────────────────────────────────────────────────────────
// Q1: Daily spending — area chart + peak callout
// ──────────────────────────────────────────────────────────
function DailySpendChart({ data, refCurrency, screenWidth }: { data: DailyPoint[]; refCurrency: string; screenWidth: number }) {
  const colors = useThemeColors();
  const W = screenWidth - 2 * SPACING.base;
  const H = 160;
  const PAD_L = 44, PAD_R = 8, PAD_T = 24, PAD_B = 24;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  if (!data.length) {
    return (
      <View style={styles.emptyChart}>
        <Text style={[styles.emptyText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>No transactions in this period</Text>
      </View>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.spend), 1);
  const n = data.length;
  const xOf = (i: number) => PAD_L + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
  const yOf = (v: number) => PAD_T + plotH - (v / maxVal) * plotH;
  const bottom = PAD_T + plotH;

  const pts = data.map((d, i) => ({ x: xOf(i), y: yOf(d.spend) }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)} ${bottom} L${pts[0].x.toFixed(1)} ${bottom} Z`;
  const midY = yOf(maxVal / 2);

  const peakIdx = data.reduce((mi, d, i) => d.spend > data[mi].spend ? i : mi, 0);
  const pk = pts[peakIdx];
  const peakAnchor = pk.x < PAD_L + 36 ? "start" : pk.x > W - 36 ? "end" : "middle";

  const xLabels: { label: string; x: number }[] = [];
  if (n === 1) {
    xLabels.push({ label: data[0].date.slice(5), x: xOf(0) });
  } else {
    xLabels.push({ label: data[0].date.slice(5), x: xOf(0) });
    if (n > 4) xLabels.push({ label: data[Math.floor(n / 2)].date.slice(5), x: xOf(Math.floor(n / 2)) });
    xLabels.push({ label: data[n - 1].date.slice(5), x: xOf(n - 1) });
  }

  return (
    <Svg width={W} height={H}>
      <Defs>
        <LinearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.primary} stopOpacity="0.28" />
          <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Line x1={PAD_L} y1={PAD_T} x2={W - PAD_R} y2={PAD_T} stroke={colors.border} strokeWidth="1" />
      <Line x1={PAD_L} y1={midY} x2={W - PAD_R} y2={midY} stroke={colors.border} strokeWidth="1" strokeDasharray="3 3" />
      <Line x1={PAD_L} y1={bottom} x2={W - PAD_R} y2={bottom} stroke={colors.border} strokeWidth="1" />
      <SvgText x={PAD_L - 4} y={PAD_T + 4} fontSize="9" fill={colors.textSubtle} textAnchor="end" fontFamily={FONTS.regular}>{fmtK(maxVal, refCurrency)}</SvgText>
      <SvgText x={PAD_L - 4} y={midY + 4} fontSize="9" fill={colors.textSubtle} textAnchor="end" fontFamily={FONTS.regular}>{fmtK(maxVal / 2, refCurrency)}</SvgText>
      <SvgText x={PAD_L - 4} y={bottom + 1} fontSize="9" fill={colors.textSubtle} textAnchor="end" fontFamily={FONTS.regular}>0</SvgText>
      <Path d={areaPath} fill="url(#dailyGrad)" />
      <Path d={linePath} stroke={colors.primary} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={pk.x} cy={pk.y} r="4" fill={colors.primary} />
      <SvgText x={pk.x} y={pk.y - 9} fontSize="9" fill={colors.primary} textAnchor={peakAnchor} fontFamily={FONTS.semiBold}>{fmtK(data[peakIdx].spend, refCurrency)}</SvgText>
      {xLabels.map((l, i) => (
        <SvgText key={i} x={l.x} y={H - 4} fontSize="9" fill={colors.textSubtle} textAnchor="middle" fontFamily={FONTS.regular}>{l.label}</SvgText>
      ))}
    </Svg>
  );
}

// ──────────────────────────────────────────────────────────
// Q2: Category bars with icons
// ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, { label: string; icon: string }> = Object.fromEntries(
  Object.keys(CATEGORY_LABELS).map((key) => [
    key,
    { label: CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS], icon: CATEGORY_ICON_NAMES[key as keyof typeof CATEGORY_ICON_NAMES] ?? "ellipsis-horizontal-outline" },
  ])
);

function CategoryChart({ data, refCurrency, onCategoryPress }: { data: CategoryPoint[]; refCurrency: string; onCategoryPress?: (category: string) => void }) {
  const colors = useThemeColors();
  const maxTotal = data[0]?.total ?? 1;

  if (!data.length) {
    return (
      <View style={[styles.emptyChart, { paddingHorizontal: SPACING.base }]}>
        <Text style={[styles.emptyText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>No spend data for this period</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: SPACING.base, paddingBottom: SPACING.base, gap: 10 }}>
      {data.slice(0, 6).map((item) => {
        const color = CATEGORY_COLORS[item.category as keyof typeof CATEGORY_COLORS] ?? "#9A9A8A";
        const pct = (item.total / maxTotal) * 100;
        const cfg = CATEGORY_CONFIG[item.category] ?? { label: item.category, icon: "ellipsis-horizontal-outline" };
        return (
          <Pressable
            key={item.category}
            onPress={() => onCategoryPress?.(item.category)}
            style={({ pressed }) => [{ gap: 4, opacity: pressed ? 0.65 : 1 }]}
          >
            <View style={styles.catRow}>
              <Ionicons name={cfg.icon as any} size={13} color={color} />
              <Text style={[styles.catLabel, { color: colors.textPrimary, fontFamily: FONTS.medium, flex: 1 }]}>{cfg.label}</Text>
              <Text style={[styles.catAmount, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>{fmtK(item.total, refCurrency)}</Text>
              <Ionicons name="chevron-forward" size={12} color={colors.textSubtle} />
            </View>
            <View style={[styles.catTrack, { backgroundColor: colors.surface2 }]}>
              <View style={[styles.catBar, { width: `${Math.max(pct, 2)}%` as any, backgroundColor: color }]} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// Q3: Weekday vs Weekend — donut + legend
// ──────────────────────────────────────────────────────────
function WeekdayChart({ weekday, weekend, refCurrency }: { weekday: number; weekend: number; refCurrency: string }) {
  const colors = useThemeColors();
  const total = weekday + weekend || 1;
  const wdPct = Math.round((weekday / total) * 100);
  const wePct = 100 - wdPct;
  const dominant = weekday >= weekend ? "weekday" : "weekend";

  return (
    <View style={[styles.donutRow, { paddingHorizontal: SPACING.base, paddingBottom: SPACING.base }]}>
      <DonutChart data={[{ value: weekday, color: colors.primary }, { value: weekend, color: colors.success }]} size={110} thickness={18}>
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.donutPct, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>{dominant === "weekday" ? wdPct : wePct}%</Text>
          <Text style={[styles.donutSub, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>{dominant}</Text>
        </View>
      </DonutChart>
      <View style={styles.donutLegend}>
        <LegendRow color={colors.primary} label="Weekday" value={fmtK(weekday, refCurrency)} pct={wdPct} colors={colors} />
        <LegendRow color={colors.success} label="Weekend" value={fmtK(weekend, refCurrency)} pct={wePct} colors={colors} />
      </View>
    </View>
  );
}

function LegendRow({ color, label, value, pct, colors }: { color: string; label: string; value: string; pct: number; colors: ReturnType<typeof useThemeColors> }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.legendLabel, { color: colors.textPrimary, fontFamily: FONTS.medium }]}>{label}</Text>
        <Text style={[styles.legendValue, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>{value} · {pct}%</Text>
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// Q4: Income vs Spend — 6-month grouped bars
// ──────────────────────────────────────────────────────────
function MonthlyTrendChart({ data }: { data: MonthlyPoint[] }) {
  const colors = useThemeColors();
  const maxVal = Math.max(...data.flatMap((d) => [d.spend, d.income]), 1);
  const BAR_H = 80;

  return (
    <View style={{ paddingHorizontal: SPACING.base, paddingBottom: SPACING.base }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
        {data.map((item) => {
          const spendH = Math.max((item.spend / maxVal) * BAR_H, item.spend > 0 ? 2 : 0);
          const incomeH = Math.max((item.income / maxVal) * BAR_H, item.income > 0 ? 2 : 0);
          return (
            <View key={item.month} style={{ flex: 1, alignItems: "center", gap: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 1, height: BAR_H }}>
                <View style={{ width: 7, height: incomeH, backgroundColor: colors.success, borderRadius: 2 }} />
                <View style={{ width: 7, height: spendH, backgroundColor: colors.primary, borderRadius: 2 }} />
              </View>
              <Text style={[styles.barLabel, { color: colors.textSubtle, fontFamily: FONTS.regular }]} numberOfLines={1}>
                {item.month.split(" ")[0]}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.trendLegend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendLabel, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>Income</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendLabel, { color: colors.textSecondary, fontFamily: FONTS.regular }]}>Spend</Text>
        </View>
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// Q5: Day of week — bars, peak highlighted
// ──────────────────────────────────────────────────────────
function DayOfWeekChart({ data }: { data: DayPoint[] }) {
  const colors = useThemeColors();
  const maxVal = Math.max(...data.map((d) => d.spend), 1);
  const peakIdx = data.reduce((mi, d, i) => d.spend > data[mi].spend ? i : mi, 0);
  const BAR_H = 72;

  return (
    <View style={{ paddingHorizontal: SPACING.base, paddingBottom: SPACING.base }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
        {data.map((item, i) => {
          const h = Math.max((item.spend / maxVal) * BAR_H, item.spend > 0 ? 3 : 0);
          const isWeekend = i === 5 || i === 6;
          const isPeak = i === peakIdx;
          const barColor = isWeekend ? colors.success : colors.primary;
          return (
            <View key={item.day} style={{ flex: 1, alignItems: "center", gap: 3 }}>
              <View style={{ height: 14, justifyContent: "center", alignItems: "center" }}>
                {isPeak && <Text style={[styles.peakIndicator, { color: barColor }]}>▲</Text>}
              </View>
              <View style={{ width: "100%", height: h || 3, backgroundColor: barColor, borderRadius: 4, opacity: isPeak ? 1 : item.spend === 0 ? 0.12 : 0.45 }} />
              <Text style={[styles.barLabel, { color: isPeak ? colors.textPrimary : colors.textSubtle, fontFamily: isPeak ? FONTS.semiBold : FONTS.regular }]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// Q6: Currency split — stacked bar + symbol legend
// ──────────────────────────────────────────────────────────
function CurrencySplitChart({ data }: { data: CurrencyPoint[] }) {
  const colors = useThemeColors();
  const total = data.reduce((s, d) => s + d.amount, 0) || 1;

  if (!data.length) {
    return (
      <View style={[styles.emptyChart, { paddingHorizontal: SPACING.base }]}>
        <Text style={[styles.emptyText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>No data</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: SPACING.base, paddingBottom: SPACING.base, gap: SPACING.md }}>
      <View style={[styles.stackBar, { backgroundColor: colors.surface2 }]}>
        {data.map((item, i) => (
          <View key={item.currency} style={{ width: `${(item.amount / total) * 100}%` as any, height: "100%", backgroundColor: CURRENCY_PALETTE[i % CURRENCY_PALETTE.length] }} />
        ))}
      </View>
      <View style={styles.currencyLegend}>
        {data.map((item, i) => (
          <View key={item.currency} style={styles.currencyLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: CURRENCY_PALETTE[i % CURRENCY_PALETTE.length] }]} />
            <Text style={[styles.legendLabel, { color: colors.textPrimary, fontFamily: FONTS.medium }]}>
              {currencySymbol(item.currency)}
            </Text>
            <Text style={[styles.legendValue, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>
              {Math.round((item.amount / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// Q7: Top 5 merchants — ranked bars
// ──────────────────────────────────────────────────────────
function TopMerchantsChart({ data, refCurrency, onMerchantPress }: { data: MerchantPoint[]; refCurrency: string; onMerchantPress?: (merchant: string) => void }) {
  const colors = useThemeColors();
  const top = data.slice(0, 5);
  const maxTotal = top[0]?.total ?? 1;

  if (!top.length) {
    return (
      <View style={[styles.emptyChart, { paddingHorizontal: SPACING.base }]}>
        <Text style={[styles.emptyText, { color: colors.textSubtle, fontFamily: FONTS.regular }]}>No merchant data for this period</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: SPACING.base, paddingBottom: SPACING.base, gap: 10 }}>
      {top.map((item, i) => {
        const pct = (item.total / maxTotal) * 100;
        return (
          <Pressable
            key={item.merchant}
            onPress={() => onMerchantPress?.(item.merchant)}
            style={({ pressed }) => [{ gap: 4, opacity: pressed ? 0.65 : 1 }]}
          >
            <View style={styles.merchantRow}>
              <Text style={[styles.merchantRank, { color: colors.textSubtle, fontFamily: FONTS.bold }]}>{i + 1}</Text>
              <Text style={[styles.merchantName, { color: colors.textPrimary, fontFamily: FONTS.medium }]} numberOfLines={1}>{item.merchant}</Text>
              <Text style={[styles.merchantAmount, { color: colors.textSecondary, fontFamily: FONTS.mono }]}>{fmtK(item.total, refCurrency)}</Text>
              <Ionicons name="chevron-forward" size={12} color={colors.textSubtle} />
            </View>
            <View style={{ paddingLeft: 24 }}>
              <View style={{ height: 4, backgroundColor: colors.surface2, borderRadius: 2 }}>
                <View style={{ height: 4, width: `${Math.max(pct, 2)}%` as any, backgroundColor: colors.primary, borderRadius: 2 }} />
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// Loading placeholder
// ──────────────────────────────────────────────────────────
function ChartLoading({ question }: { question: string }) {
  const colors = useThemeColors();
  return (
    <GlassCard>
      <CardQuestion text={question} />
      <View style={styles.emptyChart}>
        <ActivityIndicator color={colors.primary} />
      </View>
    </GlassCard>
  );
}

// ──────────────────────────────────────────────────────────
// Period filter dropdown
// ──────────────────────────────────────────────────────────
function PeriodDropdown({
  visible,
  selected,
  onSelect,
  onClose,
  topOffset,
}: {
  visible: boolean;
  selected: UIPeriod;
  onSelect: (p: UIPeriod) => void;
  onClose: () => void;
  topOffset: number;
}) {
  const colors = useThemeColors();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      <View
        style={[
          styles.dropdown,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            top: topOffset,
          },
        ]}
      >
        {PERIOD_OPTIONS.map((opt, i) => (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              styles.dropdownRow,
              i < PERIOD_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.dropdownLabel, { color: opt.locked ? colors.textSubtle : colors.textPrimary, fontFamily: FONTS.medium }]}>
                {opt.label}
              </Text>
            </View>
            {opt.locked ? (
              <View style={[styles.proBadge, { backgroundColor: colors.primaryMid }]}>
                <Text style={[styles.proLabel, { color: colors.primary, fontFamily: FONTS.bold }]}>Pro</Text>
              </View>
            ) : selected === opt.value ? (
              <Ionicons name="checkmark" size={16} color={colors.primary} />
            ) : null}
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

// ──────────────────────────────────────────────────────────
// Main screen
// ──────────────────────────────────────────────────────────
export default function InsightsScreen() {
  const colors = useThemeColors();
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const [uiPeriod, setUiPeriod] = useState<UIPeriod>("1m");
  const [filterOpen, setFilterOpen] = useState(false);
  const { chartData, isLoading, refetch: refetchChart } = useChartData(toApiPeriod(uiPeriod));
  const { refetch: refetchInsights } = useInsights();
  const [refreshing, setRefreshing] = useState(false);

  interface DrilldownState {
    title: string;
    icon: string;
    iconColor: string;
    params: TransactionQueryParams;
  }
  const [drilldown, setDrilldown] = useState<DrilldownState | null>(null);

  const handleCategoryPress = useCallback((category: string) => {
    const cfg = CATEGORY_CONFIG[category] ?? { label: category, icon: "ellipsis-horizontal-outline" };
    const color = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? "#9A9A8A";
    setDrilldown({
      title: cfg.label,
      icon: cfg.icon,
      iconColor: color,
      params: {
        category,
        date_from: chartData?.period_start,
        date_to: chartData?.period_end,
      },
    });
  }, [chartData]);

  const handleMerchantPress = useCallback((merchant: string) => {
    setDrilldown({
      title: merchant,
      icon: "storefront-outline",
      iconColor: colors.primary,
      params: {
        search: merchant,
        date_from: chartData?.period_start,
        date_to: chartData?.period_end,
      },
    });
  }, [chartData, colors.primary]);

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const handleTransactionPress = useCallback((tx: Transaction) => {
    setDrilldown(null);
    setSelectedTx(tx);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchChart(), refetchInsights()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchChart, refetchInsights]);

  function handlePeriodSelect(p: UIPeriod) {
    const opt = PERIOD_OPTIONS.find((o) => o.value === p);
    if (opt?.locked) {
      setFilterOpen(false);
      Alert.alert(
        "Fintrack Pro",
        "Extended period analysis (6 months, this year, and all time) is available on Fintrack Pro.",
        [{ text: "OK" }],
      );
      return;
    }
    setUiPeriod(p);
    setFilterOpen(false);
  }

  const ref = chartData?.ref_currency ?? "NGN";

  // Position the dropdown just below the header
  const dropdownTop = insets.top + 60;

  const Q1 = "How has my spending moved day by day?";
  const Q2 = "Where did most of my money go?";
  const Q3 = "Am I a weekday spender or a weekend spender?";
  const Q4 = "Am I living within my means each month?";
  const Q5 = "Which day of the week do I spend most?";
  const Q6 = "How is my spending split across currencies?";
  const Q7 = "Who's getting most of my money?";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: FONTS.bold }]}>Insights</Text>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => setFilterOpen(true)}
          style={[styles.filterBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="options-outline" size={17} color={colors.textPrimary} />
          {uiPeriod !== "1m" && (
            <Text style={[styles.filterBtnLabel, { color: colors.primary, fontFamily: FONTS.semiBold }]}>
              {PERIOD_LABEL[uiPeriod]}
            </Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
      >
        <IrisAICard />

        {isLoading ? <ChartLoading question={Q1} /> : (
          <GlassCard style={{ overflow: "hidden" }}>
            <CardQuestion text={Q1} />
            <DailySpendChart data={chartData?.daily_spend ?? []} refCurrency={ref} screenWidth={screenWidth} />
          </GlassCard>
        )}

        {isLoading ? <ChartLoading question={Q2} /> : (
          <GlassCard>
            <CardQuestion text={Q2} />
            <CategoryChart data={chartData?.by_category ?? []} refCurrency={ref} onCategoryPress={handleCategoryPress} />
          </GlassCard>
        )}

        {isLoading ? <ChartLoading question={Q3} /> : (
          <GlassCard>
            <CardQuestion text={Q3} />
            <WeekdayChart weekday={chartData?.weekday_vs_weekend.weekday ?? 0} weekend={chartData?.weekday_vs_weekend.weekend ?? 0} refCurrency={ref} />
          </GlassCard>
        )}

        {isLoading ? <ChartLoading question={Q4} /> : (
          <GlassCard>
            <CardQuestion text={Q4} />
            <MonthlyTrendChart data={chartData?.monthly_trend ?? []} />
          </GlassCard>
        )}

        {isLoading ? <ChartLoading question={Q5} /> : (
          <GlassCard>
            <CardQuestion text={Q5} />
            <DayOfWeekChart data={chartData?.day_of_week ?? []} />
          </GlassCard>
        )}

        {isLoading ? <ChartLoading question={Q6} /> : (
          <GlassCard>
            <CardQuestion text={Q6} />
            <CurrencySplitChart data={chartData?.by_currency ?? []} />
          </GlassCard>
        )}

        {isLoading ? <ChartLoading question={Q7} /> : (
          <GlassCard style={{ marginBottom: SPACING.xxl }}>
            <CardQuestion text={Q7} />
            <TopMerchantsChart data={chartData?.top_merchants ?? []} refCurrency={ref} onMerchantPress={handleMerchantPress} />
          </GlassCard>
        )}
      </ScrollView>

      <PeriodDropdown
        visible={filterOpen}
        selected={uiPeriod}
        onSelect={handlePeriodSelect}
        onClose={() => setFilterOpen(false)}
        topOffset={dropdownTop}
      />

      <DrilldownSheet
        visible={drilldown !== null}
        onClose={() => setDrilldown(null)}
        title={drilldown?.title ?? ""}
        icon={drilldown?.icon ?? "ellipsis-horizontal-outline"}
        iconColor={drilldown?.iconColor ?? colors.primary}
        params={drilldown?.params ?? {}}
        refCurrency={ref}
        onTransactionPress={handleTransactionPress}
      />

      {selectedTx && (
        <TransactionDetailSheet
          visible={selectedTx !== null}
          onClose={() => setSelectedTx(null)}
          transaction={selectedTx}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
    gap: SPACING.xs,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  title: { fontSize: FONT_SIZE.h1, letterSpacing: -0.6 },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  filterBtnLabel: { fontSize: 12 },

  // Scroll content
  content: { paddingHorizontal: SPACING.base, paddingBottom: SPACING.base, gap: SPACING.xl },

  // Card question label
  cardQuestion: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.2,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base, // full base gap before chart
  },

  // Period dropdown
  dropdown: {
    position: "absolute",
    right: SPACING.base,
    width: 200,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.base,
    paddingVertical: 13,
  },
  dropdownLabel: { fontSize: 14 },
  proBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADIUS.full },
  proLabel: { fontSize: 10, letterSpacing: 0.2 },

  // Iris card
  irisCard: { padding: SPACING.base, gap: SPACING.sm },
  irisHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  irisBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  irisBadgeLabel: { fontSize: 11 },
  markRead: { fontSize: 12 },
  irisMessage: { fontSize: FONT_SIZE.body, lineHeight: 22 },
  irisDetailTitle: { fontSize: 18, lineHeight: 26, letterSpacing: -0.4 },
  irisDetailBody: { fontSize: 14, lineHeight: 22 },
  irisTip: { borderRadius: RADIUS.lg, borderWidth: 1, padding: SPACING.md },
  irisTipText: { fontSize: 14, lineHeight: 22 },
  irisEmptyHint: { borderRadius: RADIUS.md, borderWidth: 1, padding: SPACING.md, alignItems: "center" },
  irisEmptyText: { fontSize: 13 },
  irisExpiry: { fontSize: 12 },
  insightChartCard: { borderRadius: RADIUS.lg, borderWidth: 1, padding: SPACING.base },
  insightChartBars: { flexDirection: "row", alignItems: "flex-end", height: 100, gap: 6 },
  insightBarCol: { flex: 1, alignItems: "center", gap: 4, height: "100%" as any },
  insightBarValue: { fontSize: 9, textAlign: "center" },
  insightBarTrack: { flex: 1, width: "100%", justifyContent: "flex-end" },
  insightBarFill: { width: "100%", borderRadius: 4, minHeight: 4 },
  insightBarLabel: { fontSize: 11, textAlign: "center" },

  // Empty state
  emptyChart: { height: 80, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 13 },

  // Category
  catRow: { flexDirection: "row", alignItems: "center", gap: SPACING.xs },
  catLabel: { fontSize: 13 },
  catAmount: { fontSize: 12 },
  catTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  catBar: { height: 6, borderRadius: 3 },

  // Donut
  donutRow: { flexDirection: "row", alignItems: "center", gap: SPACING.xl },
  donutLegend: { flex: 1, gap: SPACING.md },
  donutPct: { fontSize: 18 },
  donutSub: { fontSize: 10, marginTop: 2 },

  // Legend shared
  legendRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 13 },
  legendValue: { fontSize: 11 },

  // Monthly trend
  trendLegend: { flexDirection: "row", gap: SPACING.base, marginTop: SPACING.sm },

  // Bar labels
  barLabel: { fontSize: 10 },
  peakIndicator: { fontSize: 8, textAlign: "center" },

  // Currency split
  stackBar: { height: 14, borderRadius: 7, flexDirection: "row", overflow: "hidden" },
  currencyLegend: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  currencyLegendItem: { flexDirection: "row", alignItems: "center", gap: 4 },

  // Merchants
  merchantRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  merchantRank: { fontSize: 12, width: 16, textAlign: "right" },
  merchantName: { flex: 1, fontSize: 13 },
  merchantAmount: { fontSize: 12 },
});
