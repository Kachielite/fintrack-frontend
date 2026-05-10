import { z } from "zod";

export const createBudgetSchema = z.object({
  category: z.enum([
    "food",
    "transit",
    "utility",
    "subs",
    "transfer",
    "fun",
    "health",
    "other",
  ]),
  limit_amount: z.number().positive(),
  currency: z.string(),
  period_type: z.enum(["monthly", "weekly"]),
});

export const updateBudgetSchema = z.object({
  limit_amount: z.number().positive().optional(),
  period_type: z.enum(["monthly", "weekly"]).optional(),
  is_active: z.boolean().optional(),
});

export type CreateBudgetSchemaType = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetSchemaType = z.infer<typeof updateBudgetSchema>;

export interface BudgetDto {
  id: number;
  category: string;
  limit_amount: number;
  currency: string;
  period_type: string;
  is_suggested_by_ai: boolean;
  spent: number;
  remaining: number;
  percentage: number;
  status: "healthy" | "warning" | "over";
  days_remaining: number;
}

export interface BudgetDetailDto extends BudgetDto {
  transaction_count: number;
  merchant_breakdown: {
    merchant: string;
    total: number;
    percentage_of_budget: number;
    transaction_count: number;
  }[];
  transactions: {
    date_group: string;
    items: {
      id: number;
      merchant: string;
      bank: string;
      amount: number;
      currency: string;
      ref_amount: number;
      time: string;
      status: string;
    }[];
  }[];
}

export interface BudgetSuggestionDto {
  category: string;
  suggested_limit: number;
  message: string;
}
