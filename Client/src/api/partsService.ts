import apiClient from "./Client";
import { PaginatedPartsResponse } from "@/Types/types";

export interface FetchPartsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const fetchParts = async (params: FetchPartsParams): Promise<PaginatedPartsResponse> => {
  const response = await apiClient.get<PaginatedPartsResponse>("/parts", {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      category: params.category || undefined,
      search: params.search || undefined,
    },
  });
  return response.data;
};