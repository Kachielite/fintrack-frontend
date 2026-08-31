import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TransactionService } from "../transactions.service";
import { CreateManualTransactionPayload, PickedStatementFile } from "../transactions.dto";
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

export function useImportStatementFile() {
  const invalidate = useInvalidateAfterNewTransaction();
  const mutation = useMutation({
    mutationFn: (file: PickedStatementFile) => TransactionService.importStatementFile(file),
    onSuccess: invalidate,
  });
  return {
    importStatementFile: mutation.mutateAsync,
    isImporting: mutation.isPending,
    error: mutation.error,
  };
}
