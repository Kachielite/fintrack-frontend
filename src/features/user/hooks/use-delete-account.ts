import { useMutation } from "@tanstack/react-query";
import { UserService } from "../user.service";
import { useAuthStore } from "@/features/auth/auth.state";

export function useDeleteAccount() {
  const clearSession = useAuthStore((s) => s.clearSession);

  const mutation = useMutation({
    mutationFn: () => UserService.deleteAccount(),
    onSuccess: () => {
      clearSession();
    },
  });

  return { deleteAccount: mutation.mutate, isDeleting: mutation.isPending };
}
