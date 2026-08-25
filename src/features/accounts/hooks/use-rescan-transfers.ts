import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { AccountsService } from "../accounts.service";

/**
 * Triggers BE-1.8's on-demand transfer rescan over the user's full history.
 * A match flips exclude_from_totals on the affected transactions, which
 * changes every spend/income figure downstream — so invalidate broadly.
 */
export function useRescanTransfers() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => AccountsService.rescanTransfers(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTION_SUMMARY],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHART_DATA] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSIGHTS] });
    },
  });

  return {
    rescan: mutation.mutateAsync,
    isRescanning: mutation.isPending,
    result: mutation.data,
    error: mutation.error,
  };
}
