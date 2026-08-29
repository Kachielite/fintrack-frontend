import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import {
  AccountDto,
  RescanTransfersResult,
  UpdateAccountSchemaType,
} from "./accounts.dto";
import { Account } from "./accounts.interface";
import { mapAccountFromDto } from "./accounts.mapper";

export const AccountsService = {
  async listAccounts(): Promise<Account[]> {
    const { data } = await apiClient.get<AccountDto[]>(API_ENDPOINTS.ACCOUNTS);
    return data.map(mapAccountFromDto);
  },

  async updateAccount(
    id: number,
    payload: UpdateAccountSchemaType,
  ): Promise<Account> {
    const { data } = await apiClient.patch<AccountDto>(
      API_ENDPOINTS.ACCOUNT_DETAIL(id),
      payload,
    );
    return mapAccountFromDto(data);
  },

  async rescanTransfers(): Promise<RescanTransfersResult> {
    // Walks the user's full transaction history server-side — can run well
    // past the global request timeout for accounts with real history, even
    // though it always completes. Give it room instead of the default.
    const { data } = await apiClient.post<RescanTransfersResult>(
      API_ENDPOINTS.ACCOUNTS_RESCAN_TRANSFERS,
      undefined,
      { timeout: 120000 },
    );
    return data;
  },
};
