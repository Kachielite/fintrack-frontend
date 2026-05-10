import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import {
  GoalDto,
  CreateGoalSchemaType,
  UpdateGoalSchemaType,
} from "./goals.dto";
import { Goal } from "./goals.interface";
import { mapGoalFromDto } from "./goals.mapper";

export const GoalService = {
  async listGoals(): Promise<Goal[]> {
    const { data } = await apiClient.get<GoalDto[]>(API_ENDPOINTS.GOALS);
    return data.map(mapGoalFromDto);
  },

  async getGoal(id: number): Promise<Goal> {
    const { data } = await apiClient.get<GoalDto>(
      API_ENDPOINTS.GOAL_DETAIL(id),
    );
    return mapGoalFromDto(data);
  },

  async createGoal(payload: CreateGoalSchemaType): Promise<Goal> {
    const { data } = await apiClient.post<GoalDto>(
      API_ENDPOINTS.GOALS,
      payload,
    );
    return mapGoalFromDto(data);
  },

  async updateGoal(id: number, payload: UpdateGoalSchemaType): Promise<Goal> {
    const { data } = await apiClient.patch<GoalDto>(
      API_ENDPOINTS.GOAL_DETAIL(id),
      payload,
    );
    return mapGoalFromDto(data);
  },

  async deleteGoal(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.GOAL_DETAIL(id));
  },
};
