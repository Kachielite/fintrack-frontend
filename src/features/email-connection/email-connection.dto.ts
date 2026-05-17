export interface EmailConnectionDto {
  id: number;
  gmail_address: string;
  status: string;
  gmail_label_id: string | null;
  gmail_label_name: string | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface GmailAuthUrlDto {
  url: string;
}
