import { useMutation } from "@tanstack/react-query";
import { GoalService } from "../goals.service";

export function useDeleteGoal() {
  const mutation = useMutation({
    mutationFn: (id: number) => GoalService.deleteGoal(id),
  });
  return { deleteGoal: mutation.mutate, isDeleting: mutation.isPending };
}
