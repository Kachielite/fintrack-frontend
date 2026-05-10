import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { GoalService } from "../goals.service";

export function useGoalDetail(id: number) {
  const {
    data: goal,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.GOAL_DETAIL, id],
    queryFn: () => GoalService.getGoal(id),
  });
  return { goal, isLoading, error };
}
