import { UserProfileDto } from "../user/user.dto";
import { UserProfile } from "../user/user.interface";
import { mapUserProfileFromDto } from "../user/user.mapper";

export function mapOnboardingResponseFromDto(dto: UserProfileDto): UserProfile {
  return mapUserProfileFromDto(dto);
}
