import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { AuthService } from "../auth.service";
import { useAuthStore } from "../auth.state";
import { loginSchema, LoginSchemaType } from "../auth.dto";

export function useSignIn() {
  const setSession = useAuthStore((s) => s.setSession);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginSchemaType) => AuthService.login(data.email, data.password),
    onSuccess: (session) => setSession(session),
    onError: (error: Error) => {
      Toast.show({ type: "error", text1: error.message ?? "Sign in failed" });
    },
  });

  return {
    form,
    isLoading: mutation.isPending,
    signIn: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
