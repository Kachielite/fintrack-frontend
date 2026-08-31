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
  // No cache invalidation on success here — accepting the upload doesn't
  // change any data yet. The real invalidation happens once the backend's
  // import_complete notification arrives (useTransactionSyncWatcher).
  const mutation = useMutation({
    mutationFn: (file: PickedStatementFile) => TransactionService.importStatementFile(file),
  });
  return {
    importStatementFile: mutation.mutateAsync,
    isImporting: mutation.isPending,
    error: mutation.error,
  };
}
