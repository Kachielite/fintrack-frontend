import { CategoryType } from "../transactions/transactions.interface";

export type BudgetStatus = "healthy" | "warning" | "over";

export interface Budget {
  id: number;
  category: CategoryType;
  limitAmount: number;
  currency: string;
  periodType: "monthly" | "weekly";
  isSuggestedByAi: boolean;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
  daysRemaining: number;
}

export interface BudgetTransactionItem {
  id: number;
  merchant: string;
  bank: string;
  amount: number;
  currency: string;
  refAmount: number;
  time: string;
  status: string;
}

export interface BudgetDetail extends Budget {
  transactionCount: number;
  merchantBreakdown: {
    merchant: string;
    total: number;
    percentageOfBudget: number;
    transactionCount: number;
  }[];
  transactions: { dateGroup: string; items: BudgetTransactionItem[] }[];
}

export interface BudgetSuggestion {
  category: CategoryType;
  suggestedLimit: number;
  message: string;
}
