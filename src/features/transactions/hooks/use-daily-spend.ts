import { useQuery } from "@tanstack/react-query";
import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";

export interface DailySpendPoint {
  date: string;
  spend: number;
  income: number;
  net: number;
}

export interface MonthSpendSummary {
  spend: number;
  income: number;
  net: number;
}

interface DailySpendResponse {
  month: MonthSpendSummary;
  days: DailySpendPoint[];
}

const EMPTY_MONTH: MonthSpendSummary = { spend: 0, income: 0, net: 0 };

/**
 * year is calendar year, month is 1-12 — matches GET /transactions/daily-spend.
 * Both month and day figures are converted to the user's ref currency and
 * computed on the backend, so they're accurate across mixed-currency data.
 */
export function useDailySpend(year: number, month: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.DAILY_SPEND, year, month],
    queryFn: async () => {
      const { data } = await apiClient.get<DailySpendResponse>(
        API_ENDPOINTS.TRANSACTIONS_DAILY_SPEND,
        {
          params: { year, month },
        },
      );
      return data;
    },
  });
  return {
    dailySpend: data?.days ?? [],
    monthTotals: data?.month ?? EMPTY_MONTH,
    isLoading,
    error,
    refetch,
  };
}
