import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateAccountSchemaType } from "../accounts.dto";
import { AccountsService } from "../accounts.service";
import { invalidateTransactionQueries } from "@/features/transactions/transaction-query-invalidation";

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAccountSchemaType }) =>
      AccountsService.updateAccount(id, data),
    onSuccess: () => invalidateTransactionQueries(queryClient),
  });

  return {
    updateAccount: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
