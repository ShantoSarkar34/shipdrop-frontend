import type { ParcelStatus } from "@/lib/parcel-status";
import type { AgentAvailability } from "@/types/user";
import { api } from "./http";

export interface Delivery {
  id: string;
  trackingId: string;
  status: ParcelStatus;
  pickupAddress: string;
  pickupCity: string;
  deliveryAddress: string;
  deliveryCity: string;
  receiverName: string;
  receiverPhone: string;
  weightKg: number;
  serviceType: string;
  deliveryCharge: number;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryListParams = {
  page?: number;
  limit?: number;
  status?: ParcelStatus;
};

export interface Earnings {
  totalEarnings: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  failedDeliveries: number;
  commissionRate: number;
  earningsTrend: { date: string; amount: number }[];
  deliveryTrend: { date: string; count: number }[];
}

export interface AgentAnalytics {
  totalAssigned: number;
  totalCompleted: number;
  totalFailed: number;
  totalReturned: number;
  deliveriesByStatus: { status: ParcelStatus; count: number }[];
  deliveryTrend: { date: string; count: number }[];
}

export type SettableAvailability = Exclude<AgentAvailability, "ON_DELIVERY">;

export function fetchDeliveries(
  params: DeliveryListParams = {},
  signal?: AbortSignal,
) {
  return api.get<Delivery[]>("/deliveries/my", { query: params, signal });
}

const action = (id: string, name: string) =>
  `/deliveries/${encodeURIComponent(id)}/${name}`;

export async function acceptDelivery(id: string): Promise<void> {
  await api.patch<unknown>(action(id, "accept"));
}

export async function rejectDelivery(id: string): Promise<void> {
  await api.patch<unknown>(action(id, "reject"));
}

export async function pickupDelivery(id: string): Promise<void> {
  await api.patch<unknown>(action(id, "pickup"));
}

export async function updateParcelStatus(input: {
  id: string;
  status: ParcelStatus;
  note?: string;
}): Promise<void> {
  await api.patch<unknown>(`/parcels/${encodeURIComponent(input.id)}/status`, {
    status: input.status,
    note: input.note,
  });
}

export async function setAvailability(
  availability: SettableAvailability,
): Promise<void> {
  await api.patch<unknown>("/deliveries/availability", { availability });
}

export async function fetchEarnings(
  period: string,
  signal?: AbortSignal,
): Promise<Earnings> {
  return (
    await api.get<Earnings>("/deliveries/earnings", {
      query: { period },
      signal,
    })
  ).data;
}

export async function fetchAgentAnalytics(
  period: string,
  signal?: AbortSignal,
): Promise<AgentAnalytics> {
  return (
    await api.get<AgentAnalytics>("/deliveries/analytics", {
      query: { period },
      signal,
    })
  ).data;
}

const MAX_LOOKUP_PAGES = 5;

export async function findDelivery(
  id: string,
  status: ParcelStatus | undefined,
  signal?: AbortSignal,
): Promise<Delivery | null> {
  for (let page = 1; page <= MAX_LOOKUP_PAGES; page += 1) {
    const response = await fetchDeliveries({ status, page, limit: 10 }, signal);
    const match = response.data.find((item) => item.id === id);
    if (match) return match;
    if (!response.meta || page >= response.meta.totalPages) return null;
  }
  return null;
}
