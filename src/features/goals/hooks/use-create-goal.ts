import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { createGoalSchema, CreateGoalSchemaType } from "../goals.dto";
import { GoalService } from "../goals.service";

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const form = useForm<CreateGoalSchemaType>({
    resolver: zodResolver(createGoalSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateGoalSchemaType) => GoalService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GOALS] });
    },
  });

  return {
    form,
    isCreating: mutation.isPending,
    createGoal: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
