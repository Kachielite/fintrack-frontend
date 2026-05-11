import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsService } from "../notifications.service";

const KEYS = {
  list: ["notifications"] as const,
  count: ["notifications", "unread-count"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: KEYS.list,
    queryFn: () => NotificationsService.list(),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: KEYS.count,
    queryFn: () => NotificationsService.getUnreadCount(),
    refetchInterval: 60_000, // refresh badge every minute
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => NotificationsService.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list });
      qc.invalidateQueries({ queryKey: KEYS.count });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationsService.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list });
      qc.invalidateQueries({ queryKey: KEYS.count });
    },
  });
}
