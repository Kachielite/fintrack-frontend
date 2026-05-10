import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { GoalService } from "../goals.service";

export function useGoals() {
  const {
    data: goals,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.GOALS],
    queryFn: () => GoalService.listGoals(),
  });
  return { goals: goals ?? [], isLoading, error, refetch };
}
