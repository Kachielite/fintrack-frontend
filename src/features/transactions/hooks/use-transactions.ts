import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionQueryParams } from "../transactions.dto";
import { TransactionService } from "../transactions.service";

export function useTransactions(params?: TransactionQueryParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, params],
    queryFn: () => TransactionService.listTransactions(params),
  });
  return { transactions: data, isLoading, error, refetch };
}
