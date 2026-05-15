export type ConnectionStatus = "active" | "expired" | "revoked";

export interface EmailConnection {
  id: number;
  gmailAddress: string;
  status: ConnectionStatus;
  gmailLabelId: string | null;
  gmailLabelName: string | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
}

export interface ConnectionStats {
  emailsScanned: number;
  transactionsExtracted: number;
  nonTransactions: number;
  failed: number;
  byRegex: number;
  byAi: number;
}
