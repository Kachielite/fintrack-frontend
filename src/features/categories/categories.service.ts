import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import {
  ICategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "./categories.interface";

export const CategoriesService = {
  async listCategories(): Promise<ICategory[]> {
    const { data } = await apiClient.get<ICategory[]>(API_ENDPOINTS.CATEGORIES);
    return data;
  },

  async createCategory(payload: CreateCategoryPayload): Promise<ICategory> {
    const { data } = await apiClient.post<ICategory>(
      API_ENDPOINTS.CATEGORIES,
      payload,
    );
    return data;
  },

  async updateCategory(
    id: number,
    payload: UpdateCategoryPayload,
  ): Promise<ICategory> {
    const { data } = await apiClient.patch<ICategory>(
      API_ENDPOINTS.CATEGORY_DETAIL(id),
      payload,
    );
    return data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CATEGORY_DETAIL(id));
  },
};
