export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Success envelope. List endpoints also carry `meta`. */
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PageMeta;
}

export interface FieldError {
  field: string;
  message: string;
}
