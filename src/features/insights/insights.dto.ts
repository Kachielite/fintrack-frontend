export interface InsightDto {
  id: number;
  type: string;
  message: string;
  contextData: Record<string, unknown> | null;
  isRead: boolean;
  expiresAt: string | null;
  createdAt: string;
}
