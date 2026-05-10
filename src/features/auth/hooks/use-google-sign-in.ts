import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../auth.service";
import { useAuthStore } from "../auth.state";

export function useGoogleSignIn() {
  const setSession = useAuthStore((s) => s.setSession);

  const mutation = useMutation({
    mutationFn: () => AuthService.loginGoogle(),
    onSuccess: (session) => setSession(session),
  });

  return { signIn: mutation.mutate, isLoading: mutation.isPending };
}
