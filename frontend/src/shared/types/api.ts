/**
 * Standard API response format per AGENTS.md.
 * Seluruh endpoint backend mengembalikan struktur ini.
 * Mock data harus mengikuti format yang sama agar
 * penggantian ke API hanya perlu mengubah sumber data.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: ApiMeta | null;
  errors: ApiError[] | null;
  timestamp: string;
}

export interface ApiMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  field: string;
  message: string;
}
