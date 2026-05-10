import { z } from "zod";
import { UserProfileDto } from "../user/user.dto";

export const completeOnboardingSchema = z.object({
  goal_type: z.enum(["save", "debt", "daily", "specific"]),
  income_range: z.string().min(1),
  pay_frequency: z.enum(["weekly", "biweekly", "monthly", "irregular"]),
  ref_currency: z.enum(["NGN", "USD", "GBP", "EUR", "GHS", "KES", "ZAR"]),
});

export type CompleteOnboardingSchemaType = z.infer<
  typeof completeOnboardingSchema
>;

export interface OnboardingResponseDto extends UserProfileDto {}
