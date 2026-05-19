export type NotificationType =
  | "sync_complete"
  | "sync_skipped"
  | "sync_failed"
  | "insight_generated"
  | "budget_warning"
  | "budget_exceeded"
  | "iris_ready";

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface UnreadCount {
  count: number;
}
