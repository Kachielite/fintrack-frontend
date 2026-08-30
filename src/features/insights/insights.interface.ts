export type InsightType =
  | "report"
  // Legacy types — no longer produced by the backend, kept so historical
  // rows still type-check.
  | "spending_pattern"
  | "budget_warning"
  | "goal_progress"
  | "fx_impact"
  | "subscription_alert"
  | "positive_reinforcement";

export interface InsightChartPoint {
  label: string;
  value: number;
  highlight: boolean;
}

export type GoalAlignmentStatus = "on_track" | "ahead" | "behind" | "no_goals";

export interface InsightDetail {
  headline: string;
  findings: string[];
  chart_type: "bar_by_category" | "bar_by_merchant" | null;
  chart_data: InsightChartPoint[] | null;
  closing: string | null;
  goal_alignment: { status: GoalAlignmentStatus; summary: string } | null;
}

export type InsightPeriodType = "weekly" | "monthly";

export interface Insight {
  id: number;
  type: InsightType;
  message: string;
  contextData: InsightDetail | null;
  periodType: InsightPeriodType | null;
  periodStart: Date | null;
  periodEnd: Date | null;
  isRead: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}
