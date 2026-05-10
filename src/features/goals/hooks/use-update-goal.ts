import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { updateGoalSchema, UpdateGoalSchemaType } from "../goals.dto";
import { GoalService } from "../goals.service";

export function useUpdateGoal(id: number) {
  const queryClient = useQueryClient();
  const form = useForm<UpdateGoalSchemaType>({
    resolver: zodResolver(updateGoalSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateGoalSchemaType) =>
      GoalService.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOALS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOAL_DETAIL, id] });
    },
  });

  return {
    form,
    isUpdating: mutation.isPending,
    updateGoal: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
