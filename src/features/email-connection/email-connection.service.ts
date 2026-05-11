import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import {
  EmailConnectionDto,
  GmailLabelDto,
  GmailAuthUrlDto,
  SetLabelSchemaType,
} from "./email-connection.dto";
import { EmailConnection, GmailLabel } from "./email-connection.interface";
import {
  mapEmailConnectionFromDto,
  mapGmailLabelFromDto,
} from "./email-connection.mapper";

export const EmailConnectionService = {
  async getAuthUrl(): Promise<string> {
    const { data } = await apiClient.get<GmailAuthUrlDto>(API_ENDPOINTS.GMAIL_AUTH_URL);
    return data.url;
  },

  async handleCallback(
    code: string,
    redirectUri: string,
  ): Promise<EmailConnection> {
    const { data } = await apiClient.post<EmailConnectionDto>(
      API_ENDPOINTS.GMAIL_CALLBACK,
      {
        code,
        redirect_uri: redirectUri,
      },
    );
    return mapEmailConnectionFromDto(data);
  },

  async listConnections(): Promise<EmailConnection[]> {
    const { data } = await apiClient.get<EmailConnectionDto[]>(
      API_ENDPOINTS.EMAIL_CONNECTIONS,
    );
    return data.map(mapEmailConnectionFromDto);
  },

  async getConnection(id: number): Promise<EmailConnection> {
    const { data } = await apiClient.get<EmailConnectionDto>(
      API_ENDPOINTS.EMAIL_CONNECTION_DETAIL(id),
    );
    return mapEmailConnectionFromDto(data);
  },

  async listLabels(connectionId: number): Promise<GmailLabel[]> {
    const { data } = await apiClient.get<GmailLabelDto[]>(
      API_ENDPOINTS.EMAIL_CONNECTION_LABELS(connectionId),
    );
    return data.map(mapGmailLabelFromDto);
  },

  async setLabel(
    connectionId: number,
    payload: SetLabelSchemaType,
  ): Promise<EmailConnection> {
    const { data } = await apiClient.patch<EmailConnectionDto>(
      API_ENDPOINTS.EMAIL_CONNECTION_LABEL(connectionId),
      payload,
    );
    return mapEmailConnectionFromDto(data);
  },

  async triggerSync(connectionId: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.EMAIL_CONNECTION_SYNC(connectionId));
  },

  async deleteConnection(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.EMAIL_CONNECTION_DETAIL(id));
  },
};
