import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { InsightService } from "../insights.service";

export function useInsights() {
  const {
    data: insights,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.INSIGHTS],
    queryFn: () => InsightService.listInsights(),
  });
  const unreadCount = insights?.filter((i) => !i.isRead).length ?? 0;
  return { insights: insights ?? [], unreadCount, isLoading, error, refetch };
}
