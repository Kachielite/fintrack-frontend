import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionService } from "../transactions.service";

/** Flipping exclude_from_totals changes every spend/income figure downstream — invalidate broadly. */
function useInvalidateAfterTransferChange() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.TRANSACTION_DETAIL],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.LINKED_TRANSACTION],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.TRANSACTION_SUMMARY],
    });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHART_DATA] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INSIGHTS] });
  };
}

export function useMarkTransfer() {
  const invalidate = useInvalidateAfterTransferChange();
  const mutation = useMutation({
    mutationFn: ({
      id,
      linkedTransactionId,
      remember,
    }: {
      id: number;
      linkedTransactionId?: number;
      remember?: boolean;
    }) => TransactionService.markTransfer(id, linkedTransactionId, remember),
    onSuccess: invalidate,
  });
  return { markTransfer: mutation.mutateAsync, isMarking: mutation.isPending };
}

export function useUnmarkTransfer() {
  const invalidate = useInvalidateAfterTransferChange();
  const mutation = useMutation({
    mutationFn: ({ id, remember }: { id: number; remember?: boolean }) =>
      TransactionService.unmarkTransfer(id, remember),
    onSuccess: invalidate,
  });
  return {
    unmarkTransfer: mutation.mutateAsync,
    isUnmarking: mutation.isPending,
  };
}
