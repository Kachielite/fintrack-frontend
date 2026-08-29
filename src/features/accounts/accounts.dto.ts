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
