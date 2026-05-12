import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";

export interface DailyPoint {
  date: string;
  spend: number;
  income: number;
}

export interface CategoryPoint {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyPoint {
  month: string;
  spend: number;
  income: number;
}

export interface DayPoint {
  day: string;
  spend: number;
}

export interface CurrencyPoint {
  currency: string;
  amount: number;
}

export interface MerchantPoint {
  merchant: string;
  total: number;
  count: number;
}

export interface ChartData {
  ref_currency: string;
  daily_spend: DailyPoint[];
  by_category: CategoryPoint[];
  weekday_vs_weekend: { weekday: number; weekend: number };
  monthly_trend: MonthlyPoint[];
  day_of_week: DayPoint[];
  by_currency: CurrencyPoint[];
  top_merchants: MerchantPoint[];
  period_start: string;
  period_end: string;
}

export type Period = "1m" | "3m" | "6m";

export function useChartData(period: Period) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.CHART_DATA, period],
    queryFn: async () => {
      const { data } = await apiClient.get<ChartData>(
        API_ENDPOINTS.TRANSACTIONS_CHART_DATA,
        { params: { period } },
      );
      return data;
    },
  });
  return { chartData: data, isLoading, refetch };
}
