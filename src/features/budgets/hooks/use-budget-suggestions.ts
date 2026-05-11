import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { BudgetService } from "../budgets.service";

export function useBudgetSuggestions() {
  const {
    data: suggestions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.BUDGET_SUGGESTIONS],
    queryFn: () => BudgetService.getSuggestions(),
  });
  return { suggestions: suggestions ?? [], isLoading, error, refetch };
}
