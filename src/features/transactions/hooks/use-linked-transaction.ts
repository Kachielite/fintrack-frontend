import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionService } from "../transactions.service";

export function useLinkedTransaction(transactionId: number, enabled: boolean) {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.LINKED_TRANSACTION, transactionId],
    queryFn: () => TransactionService.getLinkedTransaction(transactionId),
    enabled,
  });
  return { linkedTransaction: data ?? null, isLoading, error };
}
