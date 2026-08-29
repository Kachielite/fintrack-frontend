import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { AuthService } from "../auth.service";
import { useAuthStore } from "../auth.state";
import { signUpSchema, SignUpSchemaType } from "../auth.dto";

export function useSignUp() {
  const setSession = useAuthStore((s) => s.setSession);

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: SignUpSchemaType) =>
      AuthService.register({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      }),
    onSuccess: (session) => setSession(session),
    onError: (error: Error) => {
      Toast.show({ type: "error", text1: error.message ?? "Sign up failed" });
    },
  });

  return {
    form,
    isLoading: mutation.isPending,
    signUp: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
