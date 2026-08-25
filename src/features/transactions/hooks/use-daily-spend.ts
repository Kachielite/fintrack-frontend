import { useQuery } from "@tanstack/react-query";
import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";

export interface DailySpendPoint {
  date: string;
  spend: number;
  income: number;
}

/** year is calendar year, month is 1-12 — matches GET /transactions/daily-spend. */
export function useDailySpend(year: number, month: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.DAILY_SPEND, year, month],
    queryFn: async () => {
      const { data } = await apiClient.get<DailySpendPoint[]>(
        API_ENDPOINTS.TRANSACTIONS_DAILY_SPEND,
        {
          params: { year, month },
        },
      );
      return data;
    },
  });
  return { dailySpend: data ?? [], isLoading, error };
}
