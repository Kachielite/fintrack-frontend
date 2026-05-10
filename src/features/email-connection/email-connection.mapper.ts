import { EmailConnectionDto, GmailLabelDto } from "./email-connection.dto";
import {
  EmailConnection,
  ConnectionStatus,
  GmailLabel,
} from "./email-connection.interface";

export function mapEmailConnectionFromDto(
  dto: EmailConnectionDto,
): EmailConnection {
  return {
    id: dto.id,
    gmailAddress: dto.gmail_address,
    status: dto.status as ConnectionStatus,
    gmailLabelId: dto.gmail_label_id,
    gmailLabelName: dto.gmail_label_name,
    lastSyncedAt: dto.last_synced_at ? new Date(dto.last_synced_at) : null,
    createdAt: new Date(dto.created_at),
  };
}

export function mapGmailLabelFromDto(dto: GmailLabelDto): GmailLabel {
  return {
    id: dto.id,
    name: dto.name,
    messagesTotal: dto.messages_total,
  };
}
