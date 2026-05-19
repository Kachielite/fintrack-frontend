import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import {
  IrisSessionDto,
  IrisChatMessageDto,
  IrisSuggestionsDto,
} from "./iris.dto";
import { IrisSession, IrisChatMessage } from "./iris.interface";
import { mapSessionFromDto, mapMessageFromDto } from "./iris.mapper";

export const IrisService = {
  async getStatus(): Promise<{ ready: boolean }> {
    const { data } = await apiClient.get<{ ready: boolean }>(
      API_ENDPOINTS.IRIS_STATUS,
    );
    return data;
  },

  async initialize(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.IRIS_INITIALIZE);
  },

  async createSession(): Promise<IrisSession> {
    const { data } = await apiClient.post<IrisSessionDto>(
      API_ENDPOINTS.IRIS_SESSIONS,
    );
    return mapSessionFromDto(data);
  },

  async listSessions(): Promise<IrisSession[]> {
    const { data } = await apiClient.get<IrisSessionDto[]>(
      API_ENDPOINTS.IRIS_SESSIONS,
    );
    return data.map(mapSessionFromDto);
  },

  async deleteSession(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.IRIS_SESSION_DETAIL(id));
  },

  async getMessages(sessionId: number): Promise<IrisChatMessage[]> {
    const { data } = await apiClient.get<IrisChatMessageDto[]>(
      API_ENDPOINTS.IRIS_SESSION_MESSAGES(sessionId),
    );
    return data.map(mapMessageFromDto);
  },

  async sendMessage(
    sessionId: number,
    content: string,
  ): Promise<IrisChatMessage> {
    const { data } = await apiClient.post<IrisChatMessageDto>(
      API_ENDPOINTS.IRIS_SESSION_MESSAGES(sessionId),
      { content },
    );
    return mapMessageFromDto(data);
  },

  async getSuggestions(): Promise<string[]> {
    const { data } = await apiClient.get<IrisSuggestionsDto>(
      API_ENDPOINTS.IRIS_SUGGESTIONS,
    );
    return data.suggestions;
  },
};
