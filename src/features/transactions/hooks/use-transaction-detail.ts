import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionService } from "../transactions.service";

export function useTransactionDetail(id: number) {
  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION_DETAIL, id],
    queryFn: () => TransactionService.getTransaction(id),
  });
  return { transaction, isLoading, error };
}
