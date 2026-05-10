import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { UpdateUserSchemaType, UserProfileDto } from "./user.dto";
import { UserProfile } from "./user.interface";
import { mapUserProfileFromDto } from "./user.mapper";

export const UserService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get<UserProfileDto>(
      API_ENDPOINTS.USERS_ME,
    );
    return mapUserProfileFromDto(data);
  },

  async updateProfile(payload: UpdateUserSchemaType): Promise<UserProfile> {
    const { data } = await apiClient.patch<UserProfileDto>(
      API_ENDPOINTS.USERS_ME,
      payload,
    );
    return mapUserProfileFromDto(data);
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USERS_ME);
  },
};
