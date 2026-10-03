import type { ParcelStatus } from "@/lib/parcel-status";
import { ApiError } from "./errors";
import { api } from "./http";

// Extended in the next step, once real list and detail responses are known.
export interface ParcelSummary {
  id: string;
  trackingId: string;
  status: ParcelStatus;
}

export type ParcelSortBy = "createdAt" | "deliveryCharge";
export type SortOrder = "asc" | "desc";

export type ParcelListParams = {
  page?: number;
  limit?: number;
  status?: ParcelStatus;
  sortBy?: ParcelSortBy;
  sortOrder?: SortOrder;
  q?: string;
};

export function fetchParcels(
  params: ParcelListParams = {},
  signal?: AbortSignal,
) {
  return api.get<ParcelSummary[]>("/parcels", { query: params, signal });
}

/** Counts shipments (optionally for one status) using only the list endpoint's pagination total. */
export async function fetchParcelCount(status?: ParcelStatus): Promise<number> {
  const response = await fetchParcels({ limit: 1, status });
  if (!response.meta)
    throw new ApiError({
      status: 502,
      message: "Unexpected response from the server.",
    });
  return response.meta.total;
}
