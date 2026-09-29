import apiClient from "./Client";
import { PaginatedPartsResponse } from "@/Types/types";

export interface FetchPartsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  inStock?: boolean;
  maxPrice?: number;
}

export const fetchParts = async (
  params: FetchPartsParams,
): Promise<PaginatedPartsResponse> => {
  const response = await apiClient.get<PaginatedPartsResponse>("/parts", {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      category: params.category || undefined,
      search: params.search || undefined,
      sort: params.sort || undefined,
      in_stock: params.inStock || undefined, // Adjust to match your backend query parameter naming convention (e.g., in_stock or inStock)
      max_price: params.maxPrice || undefined, // Adjust to match your backend query parameter naming convention (e.g., max_price or maxPrice)
    },
  });
  return response.data;
};
