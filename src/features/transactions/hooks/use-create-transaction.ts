import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionService } from "../transactions.service";
import { CreateManualTransactionPayload } from "../transactions.dto";
import { invalidateTransactionQueries } from "../transaction-query-invalidation";

function useInvalidateAfterNewTransaction() {
  const queryClient = useQueryClient();
  return () => invalidateTransactionQueries(queryClient);
}

export function useCreateTransaction() {
  const invalidate = useInvalidateAfterNewTransaction();
  const mutation = useMutation({
    mutationFn: (payload: CreateManualTransactionPayload) =>
      TransactionService.createManualTransaction(payload),
    onSuccess: invalidate,
  });
  return {
    createTransaction: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}

export function useImportTransactionsCsv() {
  const invalidate = useInvalidateAfterNewTransaction();
  const mutation = useMutation({
    mutationFn: (csv: string) => TransactionService.importTransactionsCsv(csv),
    onSuccess: invalidate,
  });
  return {
    importCsv: mutation.mutateAsync,
    isImporting: mutation.isPending,
    error: mutation.error,
  };
}
