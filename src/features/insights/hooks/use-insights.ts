import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { InsightService } from "../insights.service";

// Module-level flag so multiple hook instances never fire generate() simultaneously.
let generationTriggered = false;

export function useInsights() {
  const queryClient = useQueryClient();

  const {
    data: insights,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.INSIGHTS],
    queryFn: () => InsightService.listInsights(),
  });

  useEffect(() => {
    if (!isLoading && insights?.length === 0 && !generationTriggered) {
      generationTriggered = true;
      InsightService.generate()
        .then(() => {
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSIGHTS] });
          }, 8000);
        })
        .catch(() => null);
    }
  }, [isLoading, insights, queryClient]);

  const unreadCount = insights?.filter((i) => !i.isRead).length ?? 0;
  return { insights: insights ?? [], unreadCount, isLoading, error, refetch };
}
