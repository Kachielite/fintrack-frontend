import { BudgetDto, BudgetDetailDto, BudgetSuggestionDto } from "./budgets.dto";
import { Budget, BudgetDetail, BudgetSuggestion } from "./budgets.interface";
import { CategoryType } from "../transactions/transactions.interface";

export function mapBudgetFromDto(dto: BudgetDto): Budget {
  return {
    id: dto.id,
    category: dto.category as CategoryType,
    limitAmount: dto.limit_amount,
    currency: dto.currency,
    periodType: dto.period_type as "monthly" | "weekly",
    isSuggestedByAi: dto.is_suggested_by_ai,
    spent: dto.spent,
    remaining: dto.remaining,
    percentage: dto.percentage,
    status: dto.status,
    daysRemaining: dto.days_remaining,
    habitDescription: dto.habit_description ?? null,
  };
}

export function mapBudgetDetailFromDto(dto: BudgetDetailDto): BudgetDetail {
  return {
    ...mapBudgetFromDto(dto),
    transactionCount: dto.transaction_count,
    merchantBreakdown: dto.merchant_breakdown.map((m) => ({
      merchant: m.merchant,
      total: m.total,
      percentageOfBudget: m.percentage_of_budget,
      transactionCount: m.transaction_count,
    })),
    transactions: dto.transactions.map((g) => ({
      dateGroup: g.date_group,
      items: g.items.map((i) => ({
        id: i.id,
        merchant: i.merchant,
        bank: i.bank,
        amount: i.amount,
        currency: i.currency,
        refAmount: i.ref_amount,
        time: i.time,
        status: i.status,
      })),
    })),
  };
}

export function mapBudgetSuggestionFromDto(
  dto: BudgetSuggestionDto,
): BudgetSuggestion {
  return {
    category: dto.category as CategoryType,
    suggestedLimit: dto.suggested_limit,
    message: dto.message,
  };
}
