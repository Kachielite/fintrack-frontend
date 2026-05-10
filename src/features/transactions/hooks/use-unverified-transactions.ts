import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionService } from "../transactions.service";

export function useUnverifiedTransactions() {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.UNVERIFIED_TRANSACTIONS],
    queryFn: () => TransactionService.getUnverified(),
  });
  return { transactions: data ?? [], count: data?.length ?? 0, isLoading };
}
