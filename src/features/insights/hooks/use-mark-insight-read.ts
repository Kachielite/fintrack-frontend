import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { InsightService } from "../insights.service";
import { useInsightsStore } from "../insights.state";

export function useMarkInsightRead() {
  const queryClient = useQueryClient();
  const decrementUnread = useInsightsStore((s) => s.decrementUnread);

  const mutation = useMutation({
    mutationFn: (id: number) => InsightService.markRead(id),
    onSuccess: () => {
      decrementUnread();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSIGHTS] });
    },
  });

  return { markRead: mutation.mutate, isMarking: mutation.isPending };
}
