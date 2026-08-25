import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { CategoriesService } from "../categories.service";
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../categories.interface";

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories();
  const mutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      CategoriesService.createCategory(payload),
    onSuccess: invalidate,
  });
  return {
    createCategory: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories();
  const mutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateCategoryPayload;
    }) => CategoriesService.updateCategory(id, payload),
    onSuccess: invalidate,
  });
  return {
    updateCategory: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories();
  const mutation = useMutation({
    mutationFn: (id: number) => CategoriesService.deleteCategory(id),
    onSuccess: invalidate,
  });
  return {
    deleteCategory: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}
