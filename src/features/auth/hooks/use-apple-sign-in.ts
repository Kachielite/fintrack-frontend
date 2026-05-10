import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AuthService } from "../auth.service";
import { useAuthStore } from "../auth.state";

export function useAppleSignIn() {
  const setSession = useAuthStore((s) => s.setSession);

  const mutation = useMutation({
    mutationFn: () => AuthService.loginApple(),
    onSuccess: (session) => setSession(session),
    onError: (error: Error) => {
      console.log("[AppleSignIn] error:", error);
      Toast.show({ type: "error", text1: error.message ?? "Apple sign-in failed" });
    },
  });

  return { signIn: mutation.mutate, isLoading: mutation.isPending };
}
