export interface InsightDto {
  id: number;
  type: string;
  message: string;
  contextData: Record<string, unknown> | null;
  periodType: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  isRead: boolean;
  expiresAt: string | null;
  createdAt: string;
}
