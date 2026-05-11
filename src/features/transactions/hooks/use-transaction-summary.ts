import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionService } from "../transactions.service";

export function useTransactionSummary(year?: number, month?: number) {
  const {
    data: summary,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION_SUMMARY, year, month],
    queryFn: () => TransactionService.getSummary(year, month),
  });
  return { summary, isLoading, error, refetch };
}
