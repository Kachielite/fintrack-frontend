import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { PaginatedResponse } from "@/core/common/interface/pagination.interface";
import {
  TransactionDto,
  TransactionQueryParams,
  TransactionSummaryDto,
  CorrectTransactionSchemaType,
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

  async getUnverified(): Promise<Transaction[]> {
    const { data } = await apiClient.get<TransactionDto[]>(
      API_ENDPOINTS.TRANSACTIONS_UNVERIFIED,
    );
    return data.map(mapTransactionFromDto);
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
};
