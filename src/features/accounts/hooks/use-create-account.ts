import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { CreateAccountSchemaType } from "../accounts.dto";
import { AccountsService } from "../accounts.service";

export function useCreateAccount() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateAccountSchemaType) => AccountsService.createAccount(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] }),
  });

  return {
    createAccount: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
