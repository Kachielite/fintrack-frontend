import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { TransactionService } from "../transactions.service";

// No backend filter for exclude_from_totals yet, so this pulls a single large
// page and filters client-side. Fine for a "review once" surface at typical
// history sizes; would need a real filter if this becomes a recurring view.
const REVIEW_FETCH_LIMIT = 500;

export function useTransfersToReview() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, "review-transfers"],
    queryFn: () =>
      TransactionService.listTransactions({
        limit: REVIEW_FETCH_LIMIT,
        page: 1,
      }),
  });

  const transfers = (data?.data ?? []).filter((t) => t.excludeFromTotals);
  const truncated = (data?.total ?? 0) > REVIEW_FETCH_LIMIT;

  return { transfers, isLoading, error, refetch, truncated };
}
