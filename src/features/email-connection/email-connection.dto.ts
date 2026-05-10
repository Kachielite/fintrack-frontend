import { z } from "zod";

export const setLabelSchema = z.object({
  label_id: z.string().min(1),
  label_name: z.string().min(1),
});

export type SetLabelSchemaType = z.infer<typeof setLabelSchema>;

export interface EmailConnectionDto {
  id: number;
  gmail_address: string;
  status: string;
  gmail_label_id: string | null;
  gmail_label_name: string | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface GmailLabelDto {
  id: string;
  name: string;
  messages_total?: number;
}

export interface GmailAuthUrlDto {
  url: string;
}
