import type { HistoryEntry, ParcelStatus } from "@/lib/parcel-status";
import { ApiError } from "./errors";
import { api } from "./http";

// Only fields confirmed by the API collection. Extended once real list and detail responses are known.
export interface ParcelSummary {
  id: string;
  trackingId: string;
  status: ParcelStatus;
}

export interface ParcelDetail extends ParcelSummary {
  statusHistory: HistoryEntry[];
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

export async function fetchParcel(
  id: string,
  signal?: AbortSignal,
): Promise<ParcelDetail> {
  return (
    await api.get<ParcelDetail>(`/parcels/${encodeURIComponent(id)}`, {
      signal,
    })
  ).data;
}

export async function cancelParcel(id: string): Promise<void> {
  await api.patch<{ status: ParcelStatus }>(
    `/parcels/${encodeURIComponent(id)}/cancel`,
  );
}

export interface CreateParcelInput {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  pickupAddress: string;
  pickupCity: string;
  deliveryAddress: string;
  deliveryCity: string;
  parcelType: string;
  weightKg: number;
  serviceType: string;
  notes?: string;
}

export interface CreatedParcel {
  id: string;
  trackingId: string;
  status: ParcelStatus;
  deliveryCharge: number;
  customerId: string;
}

// There is deliberately no price field: the backend calculates the delivery charge.
export async function createParcel(
  input: CreateParcelInput,
): Promise<CreatedParcel> {
  return (await api.post<CreatedParcel>("/parcels", input)).data;
}
