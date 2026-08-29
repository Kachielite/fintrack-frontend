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

  // Runs in the background server-side and acknowledges immediately — the
  // result arrives later as a transfer_scan_complete/failed notification,
  // so this only confirms the scan started.
  async rescanTransfers(): Promise<RescanTransfersResult> {
    const { data } = await apiClient.post<RescanTransfersResult>(
      API_ENDPOINTS.ACCOUNTS_RESCAN_TRANSFERS,
    );
    return data;
  },
};
