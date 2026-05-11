import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionQueryParams } from "../transactions.dto";
import { TransactionService } from "../transactions.service";

export function useTransactionsInfinite(
  params?: Omit<TransactionQueryParams, "page">,
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, "infinite", params],
    queryFn: ({ pageParam }) =>
      TransactionService.listTransactions({
        ...params,
        page: pageParam as number,
        limit: 20,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}
