export type InsightType =
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

export interface InsightDetail {
  title: string;
  body: string | null;
  action_text: string | null;
  chart_type: "bar_by_category" | "bar_by_merchant" | null;
  chart_data: InsightChartPoint[] | null;
}

export interface Insight {
  id: number;
  type: InsightType;
  message: string;
  contextData: InsightDetail | null;
  isRead: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}
