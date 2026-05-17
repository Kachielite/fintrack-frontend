import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AuthService } from "../auth.service";
import { useAuthStore } from "../auth.state";

export const DEMO_EMAIL = "demo@fintrack.app";
export const DEMO_PASSWORD = "Demo1234!";

export function useDemoSignIn() {
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);

  const mutation = useMutation({
    mutationFn: () => AuthService.loginDemo(email, password),
    onSuccess: (session) => setSession(session),
    onError: () => {
      Toast.show({ type: "error", text1: "Demo sign-in failed. Check credentials." });
    },
  });

  return {
    email,
    setEmail,
    password,
    setPassword,
    signIn: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
