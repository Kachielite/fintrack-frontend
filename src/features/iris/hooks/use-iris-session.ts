import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IrisService } from "../iris.service";
import { useIrisStore } from "../iris.state";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";

export function useCreateIrisSession() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => IrisService.createSession(),
    onSuccess: (session) => {
      const { setSession, setMessages } = useIrisStore.getState();
      setSession(session.id);
      setMessages([]);
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.IRIS_SESSIONS] });
    },
  });
}

export function useDeleteIrisSession() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => IrisService.deleteSession(id),
    onSuccess: () => {
      useIrisStore.getState().reset();
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.IRIS_SESSIONS] });
    },
  });
}
