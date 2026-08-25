export interface Account {
  id: number;
  bankId: number | null;
  bankName: string | null;
  bankLogoUrl: string | null;
  currency: string;
  label: string;
  accountNumberMask: string | null;
  isActive: boolean;
  balance: number | null;
  lastSyncedAt: Date | null;
  createdAt: Date;
}
