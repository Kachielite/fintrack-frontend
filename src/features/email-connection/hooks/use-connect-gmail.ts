import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { EmailConnectionService } from "../email-connection.service";

const REDIRECT_SCHEME = "fintrack://oauth/gmail";

export function useConnectGmail() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const authUrl = await EmailConnectionService.getAuthUrl();

      // Opens an in-app browser sheet (Safari VC on iOS, Custom Tab on Android).
      // Intercepts the redirect once Google sends the user back to fintrack://.
      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_SCHEME);

      if (result.type === "cancel" || result.type === "dismiss") {
        // User closed the browser without completing — not an error, just a no-op.
        return null;
      }

      if (result.type !== "success") {
        throw new Error("OAuth flow did not complete");
      }

      const redirectUrl = new URL(result.url);
      const oauthError = redirectUrl.searchParams.get("error");
      if (oauthError) throw new Error(oauthError);

      const connectionId = Number(redirectUrl.searchParams.get("connection_id"));
      if (!connectionId) throw new Error("No connection_id returned from server");

      const alreadyConnected = redirectUrl.searchParams.get("already_connected") === "1";
      return { connectionId, alreadyConnected };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMAIL_CONNECTIONS] });
    },
  });

  return {
    connectGmail: (options?: { onSuccess?: (alreadyConnected: boolean) => void }) =>
      mutation.mutate(undefined, {
        onSuccess: (data) => {
          if (data !== null) options?.onSuccess?.(data.alreadyConnected);
        },
      }),
    isConnecting: mutation.isPending,
    isSuccess: mutation.isSuccess && mutation.data !== null,
    alreadyConnected: mutation.data?.alreadyConnected ?? false,
    error: mutation.error,
  };
}
