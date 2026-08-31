import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { Bank } from "./bank.interface";

interface BankDto {
  id: number;
  name: string;
  short_code: string;
  logo_url: string | null;
}

function mapBankFromDto(dto: BankDto): Bank {
  return { id: dto.id, name: dto.name, shortCode: dto.short_code, logoUrl: dto.logo_url };
}

export const BankService = {
  async listBanks(): Promise<Bank[]> {
    const { data } = await apiClient.get<BankDto[]>(API_ENDPOINTS.BANKS);
    return data.map(mapBankFromDto);
  },

  async reportSender(
    senderEmail: string,
    bankName?: string,
  ): Promise<{ matched: boolean; bankName: string | null }> {
    const { data } = await apiClient.post(API_ENDPOINTS.BANKS_REPORT_SENDER, {
      sender_email: senderEmail,
      bank_name: bankName || undefined,
    });
    return data;
  },
};
