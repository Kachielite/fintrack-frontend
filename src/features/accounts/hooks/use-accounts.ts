import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { AccountsService } from "../accounts.service";

export function useAccounts() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: () => AccountsService.listAccounts(),
  });
  return { accounts: data ?? [], isLoading, error, refetch };
}
