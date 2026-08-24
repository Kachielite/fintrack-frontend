import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IrisService } from "../iris.service";
import { useIrisStore } from "../iris.state";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { IrisChatMessage } from "../iris.interface";

export function useLoadMessages(sessionId: number | null) {
  const { setMessages } = useIrisStore();

  const query = useQuery({
    queryKey: [QUERY_KEYS.IRIS_MESSAGES, sessionId],
    queryFn: () => IrisService.getMessages(sessionId!),
    enabled: sessionId !== null,
    staleTime: Infinity, // store is source of truth after initial load
  });

  useEffect(() => {
    if (query.data) setMessages(query.data);
  }, [query.data]);

  return query;
}

export function useSendMessage() {
  return useMutation({
    mutationFn: async (content: string): Promise<IrisChatMessage> => {
      // Always read current state — avoids stale closure from render cycle
      const sessionId = useIrisStore.getState().sessionId;
      if (!sessionId) throw new Error("No active session");
      return IrisService.sendMessage(sessionId, content);
    },
    onMutate: (content) => {
      const { sessionId, appendMessage, setIsSending } = useIrisStore.getState();
      if (!sessionId) return;
      const optimistic: IrisChatMessage = {
        id: Date.now(),
        sessionId,
        role: "user",
        content,
        chartData: null,
        createdAt: new Date(),
      };
      appendMessage(optimistic);
      setIsSending(true);
    },
    onSuccess: (assistantMessage) => {
      const { appendMessage, setIsSending } = useIrisStore.getState();
      appendMessage(assistantMessage);
      setIsSending(false);
    },
    onError: () => {
      useIrisStore.getState().setIsSending(false);
    },
  });
}
