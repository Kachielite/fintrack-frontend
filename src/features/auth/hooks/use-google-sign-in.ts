import { useMutation } from "@tanstack/react-query";
import { Toast } from "toastify-react-native";
import { AuthService } from "../auth.service";
import { useAuthStore } from "../auth.state";

export function useGoogleSignIn() {
  const setSession = useAuthStore((s) => s.setSession);

  const mutation = useMutation({
    mutationFn: () => AuthService.loginGoogle(),
    onSuccess: (session) => setSession(session),
    onError: (error: Error) => {
      console.log("[GoogleSignIn] error:", error);
      Toast.error(error.message ?? "Google sign-in failed");
    },
  });

  return { signIn: mutation.mutate, isLoading: mutation.isPending };
}
