import { UserProfileDto } from "./user.dto";
import { UserProfile } from "./user.interface";

export function mapUserProfileFromDto(dto: UserProfileDto): UserProfile {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.first_name,
    lastName: dto.last_name,
    refCurrency: dto.ref_currency,
    advisorTone: dto.advisor_tone,
    goalType: dto.goal_type,
    incomeRange: dto.income_range,
    payFrequency: dto.pay_frequency,
    onboardingComplete: dto.onboarding_complete,
    planTier: dto.plan_tier,
    createdAt: new Date(dto.created_at),
  };
}
