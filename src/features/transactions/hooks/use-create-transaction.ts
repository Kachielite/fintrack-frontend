import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionService } from "../transactions.service";
import { CreateManualTransactionPayload } from "../transactions.dto";

function useInvalidateAfterNewTransaction() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.TRANSACTION_SUMMARY],
    });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHART_DATA] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DAILY_SPEND] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
  };
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
