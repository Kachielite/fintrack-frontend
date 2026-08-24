export interface IrisSession {
  id: number;
  userId: number;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IrisChartDataPoint {
  label: string;
  value: number;
  highlight: boolean;
}

export interface IrisChartData {
  type: "bar_by_category" | "bar_by_merchant" | "line_over_time" | "pie_by_category" | "pie_by_merchant";
  data: IrisChartDataPoint[];
}

export interface IrisChatMessage {
  id: number;
  sessionId: number;
  role: "user" | "assistant";
  content: string;
  chartData: IrisChartData | null;
  createdAt: Date;
}
