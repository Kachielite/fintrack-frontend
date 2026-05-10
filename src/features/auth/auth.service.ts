import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { AuthResponseDto } from "./auth.dto";
import { AuthSession } from "./auth.interface";
import { mapAuthSessionFromDto } from "./auth.mapper";

export const AuthService = {
  async signInWithGoogle(idToken: string): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthResponseDto>(
      API_ENDPOINTS.AUTH_GOOGLE,
      {
        id_token: idToken,
      },
    );
    return mapAuthSessionFromDto(data);
  },

  async signInWithApple(payload: {
    id_token: string;
    first_name?: string;
    last_name?: string;
  }): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthResponseDto>(
      API_ENDPOINTS.AUTH_APPLE,
      payload,
    );
    return mapAuthSessionFromDto(data);
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const { data } = await apiClient.post<{ access_token: string }>(
      API_ENDPOINTS.AUTH_REFRESH,
      {
        refresh_token: refreshToken,
      },
    );
    return { accessToken: data.access_token };
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
  },
};
