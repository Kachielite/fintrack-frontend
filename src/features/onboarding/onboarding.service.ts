import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import {
  CompleteOnboardingSchemaType,
  OnboardingResponseDto,
} from "./onboarding.dto";
import { UserProfile } from "../user/user.interface";
import { mapOnboardingResponseFromDto } from "./onboarding.mapper";

export const OnboardingService = {
  async completeOnboarding(
    data: CompleteOnboardingSchemaType,
  ): Promise<UserProfile> {
    const { data: dto } = await apiClient.post<OnboardingResponseDto>(
      API_ENDPOINTS.USERS_ME_ONBOARDING,
      data,
    );
    return mapOnboardingResponseFromDto(dto);
  },
};
