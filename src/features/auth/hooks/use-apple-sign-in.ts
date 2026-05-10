import { useMutation } from "@tanstack/react-query";
import appleAuth from "@invertase/react-native-apple-authentication";
import { AuthService } from "../auth.service";
import { useAuthStore } from "../auth.state";

export function useAppleSignIn() {
  const setSession = useAuthStore((s) => s.setSession);

  const mutation = useMutation({
    mutationFn: async () => {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const { identityToken, fullName } = appleAuthRequestResponse;
      if (!identityToken)
        throw new Error("No identity token returned from Apple");
      return AuthService.signInWithApple({
        id_token: identityToken,
        first_name: fullName?.givenName ?? undefined,
        last_name: fullName?.familyName ?? undefined,
      });
    },
    onSuccess: (session) => {
      setSession(session);
    },
  });

  return { signIn: mutation.mutate, isLoading: mutation.isPending };
}
