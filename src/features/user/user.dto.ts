import { z } from "zod";

export const updateUserSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  ref_currency: z
    .enum(["NGN", "USD", "GBP", "EUR", "GHS", "KES", "ZAR"])
    .optional(),
  advisor_tone: z.enum(["encouraging", "direct", "analytical"]).optional(),
  goal_type: z.enum(["save", "debt", "daily", "specific"]).optional(),
  income_range: z.string().min(1).optional(),
  pay_frequency: z
    .enum(["weekly", "biweekly", "monthly", "irregular"])
    .optional(),
});

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;

export interface UserProfileDto {
  id: number;
  email: string;
  first_name: string;
  last_name: string | null;
  ref_currency: string;
  advisor_tone: string;
  goal_type: string | null;
  income_range: string | null;
  pay_frequency: string | null;
  onboarding_complete: boolean;
  plan_tier: string;
  created_at: string;
}
