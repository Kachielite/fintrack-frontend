import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionService } from "../transactions.service";
import { invalidateTransactionQueries } from "../transaction-query-invalidation";

/** Flipping exclude_from_totals changes every spend/income figure downstream — invalidate broadly. */
function useInvalidateAfterTransferChange() {
  const queryClient = useQueryClient();
  return () => invalidateTransactionQueries(queryClient);
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
