export interface Goal {
  id: number;
  name: string;
  type: string;
  targetAmount: number | null;
  savedAmount: number;
  currency: string;
  targetDate: Date | null;
  isActive: boolean;
  progressPct: number | null;
  createdAt: Date;
  updatedAt: Date;
}
