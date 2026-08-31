import { z } from "zod";

export const updateAccountSchema = z
  .object({
    label: z.string().min(1).max(100).optional(),
    is_active: z.boolean().optional(),
    merge_into_account_id: z.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateAccountSchemaType = z.infer<typeof updateAccountSchema>;

export const createAccountSchema = z.object({
  currency: z.string().length(3),
  bank_id: z.number().int().positive().optional(),
  label: z.string().min(1).max(100).optional(),
  account_number: z.string().min(1).max(50).optional(),
});

export type CreateAccountSchemaType = z.infer<typeof createAccountSchema>;

export interface AccountDto {
  id: number;
  bank_id: number | null;
  bank_name: string | null;
  bank_logo_url: string | null;
  currency: string;
  label: string;
  account_number_mask: string | null;
  is_active: boolean;
  balance: number | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface RescanTransfersResult {
  success: boolean;
  message: string;
  data: null;
}
