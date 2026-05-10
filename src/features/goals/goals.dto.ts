import { z } from "zod";

export const createGoalSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["save", "debt", "daily", "specific"]),
  target_amount: z.number().positive().optional(),
  currency: z.string(),
  target_date: z.string().datetime().optional(),
});

export const updateGoalSchema = z.object({
  name: z.string().optional(),
  target_amount: z.number().positive().optional(),
  saved_amount: z.number().optional(),
  target_date: z.string().optional(),
});

export type CreateGoalSchemaType = z.infer<typeof createGoalSchema>;
export type UpdateGoalSchemaType = z.infer<typeof updateGoalSchema>;

export interface GoalDto {
  id: number;
  name: string;
  type: string;
  targetAmount: number | null;
  savedAmount: number;
  currency: string;
  targetDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
