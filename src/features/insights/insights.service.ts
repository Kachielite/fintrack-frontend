import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { InsightDto } from "./insights.dto";
import { Insight } from "./insights.interface";
import { mapInsightFromDto } from "./insights.mapper";

export const InsightService = {
  async listInsights(unreadOnly?: boolean): Promise<Insight[]> {
    const { data } = await apiClient.get<InsightDto[]>(API_ENDPOINTS.INSIGHTS, {
      params: { unread_only: unreadOnly },
    });
    return data.map(mapInsightFromDto);
  },

  async markRead(id: number): Promise<Insight> {
    const { data } = await apiClient.patch<InsightDto>(
      API_ENDPOINTS.INSIGHT_READ(id),
    );
    return mapInsightFromDto(data);
  },
};
