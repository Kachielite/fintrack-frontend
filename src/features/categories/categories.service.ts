import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { ICategory } from "./categories.interface";

export const CategoriesService = {
  async listCategories(): Promise<ICategory[]> {
    const { data } = await apiClient.get<ICategory[]>(API_ENDPOINTS.CATEGORIES);
    return data;
  },
};
