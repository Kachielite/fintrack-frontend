import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import {
  BudgetDto,
  BudgetDetailDto,
  BudgetSuggestionDto,
  CreateBudgetSchemaType,
  UpdateBudgetSchemaType,
} from "./budgets.dto";
import { Budget, BudgetDetail, BudgetSuggestion } from "./budgets.interface";
import {
  mapBudgetFromDto,
  mapBudgetDetailFromDto,
  mapBudgetSuggestionFromDto,
} from "./budgets.mapper";

export const BudgetService = {
  async listBudgets(): Promise<Budget[]> {
    const { data } = await apiClient.get<BudgetDto[]>(API_ENDPOINTS.BUDGETS);
    return data.map(mapBudgetFromDto);
  },

  async getBudgetDetail(id: number): Promise<BudgetDetail> {
    const { data } = await apiClient.get<BudgetDetailDto>(
      API_ENDPOINTS.BUDGET_CATEGORY_DETAIL(id),
    );
    return mapBudgetDetailFromDto(data);
  },

  async createBudget(payload: CreateBudgetSchemaType): Promise<Budget> {
    const { data } = await apiClient.post<BudgetDto>(
      API_ENDPOINTS.BUDGETS,
      payload,
    );
    return mapBudgetFromDto(data);
  },

  async updateBudget(
    id: number,
    payload: UpdateBudgetSchemaType,
  ): Promise<Budget> {
    const { data } = await apiClient.patch<BudgetDto>(
      API_ENDPOINTS.BUDGET_DETAIL(id),
      payload,
    );
    return mapBudgetFromDto(data);
  },

  async deleteBudget(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.BUDGET_DETAIL(id));
  },

  async getSuggestions(): Promise<BudgetSuggestion[]> {
    const { data } = await apiClient.get<BudgetSuggestionDto[]>(
      API_ENDPOINTS.BUDGET_SUGGESTIONS,
    );
    return data.map(mapBudgetSuggestionFromDto);
  },
};
