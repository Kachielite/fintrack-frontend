import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsService } from "../notifications.service";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";

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

// Watches for new unread notifications. When the count rises, check if any
// are sync_complete and invalidate transaction-related queries so the lists
// refresh automatically without a manual pull-to-refresh.
export function useTransactionSyncWatcher() {
  const qc = useQueryClient();
  const { data: countData } = useUnreadCount();
  const prevCount = useRef<number | null>(null);

  useEffect(() => {
    const count = countData?.count ?? 0;
    if (prevCount.current !== null && count > prevCount.current) {
      NotificationsService.list().then((notifications) => {
        const hasSync = notifications.some(
          (n) => n.type === "sync_complete" && n.readAt === null,
        );
        if (hasSync) {
          qc.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
          qc.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTION_SUMMARY] });
          qc.invalidateQueries({ queryKey: [QUERY_KEYS.CHART_DATA] });
          qc.invalidateQueries({ queryKey: [QUERY_KEYS.UNVERIFIED_TRANSACTIONS] });
          qc.invalidateQueries({ queryKey: KEYS.list });
        }
      });
    }
    prevCount.current = count;
  }, [countData?.count]);
}
