import { useQuery } from "@tanstack/react-query";
import { IrisService } from "../iris.service";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";

export function useIrisSuggestions() {
  return useQuery({
    queryKey: [QUERY_KEYS.IRIS_SUGGESTIONS],
    queryFn: () => IrisService.getSuggestions(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: [
      "How much did I spend this month?",
      "Which category do I overspend in?",
      "How are my budgets doing?",
      "Am I on track with my goals?",
    ],
  });
}
