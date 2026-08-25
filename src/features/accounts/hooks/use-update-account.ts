import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { UpdateAccountSchemaType } from "../accounts.dto";
import { AccountsService } from "../accounts.service";

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAccountSchemaType }) =>
      AccountsService.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    },
  });

  return {
    updateAccount: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
