export interface IrisSessionDto {
  id: number;
  userId: number;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IrisChartDataPointDto {
  label: string;
  value: number;
  highlight: boolean;
}

export interface IrisChartDataDto {
  type: "bar_by_category" | "bar_by_merchant" | "line_over_time" | "pie_by_category" | "pie_by_merchant";
  data: IrisChartDataPointDto[];
}

export interface IrisChatMessageDto {
  id: number;
  sessionId: number;
  role: "user" | "assistant";
  content: string;
  chartData: IrisChartDataDto | null;
  createdAt: string;
}

export interface IrisSuggestionsDto {
  suggestions: string[];
}
