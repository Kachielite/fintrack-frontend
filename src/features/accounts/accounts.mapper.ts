import { AccountDto } from "./accounts.dto";
import { Account } from "./accounts.interface";

export function mapAccountFromDto(dto: AccountDto): Account {
  return {
    id: dto.id,
    bankId: dto.bank_id,
    bankName: dto.bank_name,
    bankLogoUrl: dto.bank_logo_url,
    currency: dto.currency,
    label: dto.label,
    accountNumberMask: dto.account_number_mask,
    isActive: dto.is_active,
    balance: dto.balance,
    lastSyncedAt: dto.last_synced_at ? new Date(dto.last_synced_at) : null,
    createdAt: new Date(dto.created_at),
  };
}
