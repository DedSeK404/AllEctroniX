export interface Part {
  id: number;
  code: string;
  brand?: string;
  package?: string;
  model?: string;
  category?: string;
  type?: string;
  describe?: string;
  price?: number;
  stock?: number;
}

export interface PaginatedPartsResponse {
  items: Part[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}