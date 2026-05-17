import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";

export const BankService = {
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
