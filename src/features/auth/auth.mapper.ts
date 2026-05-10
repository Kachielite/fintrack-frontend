import { AuthUserDto, AuthResponseDto } from "./auth.dto";
import { AuthUser, AuthSession } from "./auth.interface";

export function mapAuthUserFromDto(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.first_name,
    onboardingComplete: dto.onboarding_complete,
  };
}

export function mapAuthSessionFromDto(dto: AuthResponseDto): AuthSession {
  return {
    accessToken: dto.access_token,
    refreshToken: dto.refresh_token,
    user: mapAuthUserFromDto(dto.user),
  };
}
