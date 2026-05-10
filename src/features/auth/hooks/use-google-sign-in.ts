import { useMutation } from "@tanstack/react-query";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AuthService } from "../auth.service";
import { useAuthStore } from "../auth.state";

export function useGoogleSignIn() {
  const setSession = useAuthStore((s) => s.setSession);

  const mutation = useMutation({
    mutationFn: async () => {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error("No id token returned from Google");
      return AuthService.signInWithGoogle(idToken);
    },
    onSuccess: (session) => {
      setSession(session);
    },
  });

  return { signIn: mutation.mutate, isLoading: mutation.isPending };
}
