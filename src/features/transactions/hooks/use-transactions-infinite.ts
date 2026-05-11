import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionQueryParams } from "../transactions.dto";
import { TransactionService } from "../transactions.service";

export function useTransactionsInfinite(
  params?: Omit<TransactionQueryParams, "page">,
) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useInfiniteQuery({
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

  return { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error };
}
