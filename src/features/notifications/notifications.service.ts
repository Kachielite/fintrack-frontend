import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { AppNotification, UnreadCount } from "./notifications.interface";

export const NotificationsService = {
  async list(): Promise<AppNotification[]> {
    const { data } = await apiClient.get<AppNotification[]>(API_ENDPOINTS.NOTIFICATIONS);
    return data;
  },

  async getUnreadCount(): Promise<UnreadCount> {
    const { data } = await apiClient.get<UnreadCount>(
      API_ENDPOINTS.NOTIFICATION_UNREAD_COUNT,
    );
    return data;
  },

  async markRead(id: number): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.NOTIFICATION_READ(id));
  },

  async markAllRead(): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS_READ_ALL);
  },

  async registerDeviceToken(playerId: string, platform: "ios" | "android"): Promise<void> {
    await apiClient.post(API_ENDPOINTS.NOTIFICATIONS_DEVICE_TOKEN, {
      player_id: playerId,
      platform,
    });
  },

  async removeDeviceToken(playerId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS_DEVICE_TOKEN_DELETE(playerId));
  },
};
