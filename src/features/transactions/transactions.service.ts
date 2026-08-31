import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { PaginatedResponse } from "@/core/common/interface/pagination.interface";
import {
  TransactionDto,
  TransactionQueryParams,
  TransactionSummaryDto,
  CorrectTransactionSchemaType,
  CreateManualTransactionPayload,
  ImportQueuedDto,
  PickedStatementFile,
} from "./transactions.dto";
import { Transaction, TransactionSummary } from "./transactions.interface";
import {
  mapTransactionFromDto,
  mapTransactionSummaryFromDto,
} from "./transactions.mapper";

export const TransactionService = {
  async listTransactions(
    params?: TransactionQueryParams,
  ): Promise<PaginatedResponse<Transaction>> {
    const { data } = await apiClient.get<{
      items: TransactionDto[];
      total_items: number;
      page: number;
      limit: number;
      pages: number;
    }>(API_ENDPOINTS.TRANSACTIONS, { params });
    return {
      data: data.items.map(mapTransactionFromDto),
      total: data.total_items,
      page: data.page,
      limit: data.limit,
      totalPages: data.pages,
    };
  },

  async getTransaction(id: number): Promise<Transaction> {
    const { data } = await apiClient.get<TransactionDto>(
      API_ENDPOINTS.TRANSACTION_DETAIL(id),
    );
    return mapTransactionFromDto(data);
  },

  async getSummary(year?: number, month?: number): Promise<TransactionSummary> {
    const { data } = await apiClient.get<TransactionSummaryDto>(
      API_ENDPOINTS.TRANSACTIONS_SUMMARY,
      {
        params: { year, month },
      },
    );
    return mapTransactionSummaryFromDto(data);
  },

  async correctTransaction(
    id: number,
    payload: CorrectTransactionSchemaType,
  ): Promise<Transaction> {
    const { data } = await apiClient.patch<TransactionDto>(
      API_ENDPOINTS.TRANSACTION_DETAIL(id),
      payload,
    );
    return mapTransactionFromDto(data);
  },

  async getSimilarTransactions(id: number): Promise<Transaction[]> {
    const { data } = await apiClient.get<TransactionDto[]>(
      API_ENDPOINTS.TRANSACTION_SIMILAR(id),
    );
    return data.map(mapTransactionFromDto);
  },

  async bulkCorrectCategory(
    ids: number[],
    category: string,
  ): Promise<{ updated: number }> {
    const { data } = await apiClient.patch<{ updated: number }>(
      API_ENDPOINTS.TRANSACTIONS_BULK_CATEGORY,
      { ids, category },
    );
    return data;
  },

  async markTransfer(
    id: number,
    linkedTransactionId?: number,
    remember?: boolean,
  ): Promise<Transaction> {
    const { data } = await apiClient.post<TransactionDto>(
      API_ENDPOINTS.TRANSACTION_MARK_TRANSFER(id),
      {
        ...(linkedTransactionId != null
          ? { linked_transaction_id: linkedTransactionId }
          : {}),
        ...(remember != null ? { remember } : {}),
      },
    );
    return mapTransactionFromDto(data);
  },

  async unmarkTransfer(id: number, remember?: boolean): Promise<Transaction> {
    const { data } = await apiClient.post<TransactionDto>(
      API_ENDPOINTS.TRANSACTION_UNMARK_TRANSFER(id),
      remember != null ? { remember } : {},
    );
    return mapTransactionFromDto(data);
  },

  async getLinkedTransaction(id: number): Promise<Transaction | null> {
    const { data } = await apiClient.get<TransactionDto | null>(
      API_ENDPOINTS.TRANSACTION_LINKED_TRANSACTION(id),
    );
    return data ? mapTransactionFromDto(data) : null;
  },

  async createManualTransaction(
    payload: CreateManualTransactionPayload,
  ): Promise<Transaction> {
    const { data } = await apiClient.post<TransactionDto>(
      API_ENDPOINTS.TRANSACTIONS,
      payload,
    );
    return mapTransactionFromDto(data);
  },

  // The backend validates and queues the import in the background now — this
  // resolves once the upload is accepted, not once the import finishes. The
  // real result arrives later as an import_complete/import_failed
  // notification (see use-notifications.ts's useTransactionSyncWatcher).
  async importStatementFile(file: PickedStatementFile): Promise<ImportQueuedDto> {
    const formData = new FormData();
    // React Native's FormData expects this {uri, name, type} shape rather than a
    // real Blob — the native networking layer streams the file directly from the
    // uri, so nothing is read into JS memory here.
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/octet-stream",
    } as unknown as Blob);

    const { data } = await apiClient.post<ImportQueuedDto>(
      API_ENDPOINTS.TRANSACTIONS_IMPORT,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },
};
