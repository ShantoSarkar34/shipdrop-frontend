import type { ParcelStatus } from "@/lib/parcel-status";
import type { Role, User, UserStatus } from "@/types/user";
import { api } from "./http";
import type { SortOrder } from "./parcels";

export interface AdminStats {
  users: {
    total: number;
    customers: number;
    deliveryAgents: number;
    admins: number;
    active: number;
    suspended: number;
  };
  parcels: {
    total: number;
    pending: number;
    confirmed: number;
    assigned: number;
    pickedUp: number;
    inTransit: number;
    outForDelivery: number;
    delivered: number;
    failedDelivery: number;
    returned: number;
    cancelled: number;
  };
  payments: { total: number; paid: number; pending: number; failed: number };
  revenue: { total: number };
}

export interface AdminAnalytics {
  shipmentTrend: { date: string; count: number }[];
  revenueTrend: { date: string; amount: number }[];
  statusDistribution: { status: ParcelStatus; count: number }[];
}

export interface AdminUser extends User {
  updatedAt: string;
}

export type UserListParams = {
  page?: number;
  limit?: number;
  role?: Role;
  status?: UserStatus;
  q?: string;
  sortBy?: "createdAt";
  sortOrder?: SortOrder;
};

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: unknown;
  createdAt: string;
}

export type AuditLogParams = { page?: number; limit?: number; action?: string };

export async function fetchAdminStats(
  signal?: AbortSignal,
): Promise<AdminStats> {
  return (await api.get<AdminStats>("/admin/dashboard/stats", { signal })).data;
}

export async function fetchAdminAnalytics(
  period: string,
  signal?: AbortSignal,
): Promise<AdminAnalytics> {
  return (
    await api.get<AdminAnalytics>("/admin/dashboard/analytics", {
      query: { period },
      signal,
    })
  ).data;
}

export function fetchAdminUsers(
  params: UserListParams = {},
  signal?: AbortSignal,
) {
  return api.get<AdminUser[]>("/admin/users", { query: params, signal });
}

export async function updateUserStatus(input: {
  id: string;
  status: UserStatus;
}): Promise<void> {
  await api.patch<unknown>(
    `/admin/users/${encodeURIComponent(input.id)}/status`,
    { status: input.status },
  );
}

export function fetchAuditLogs(
  params: AuditLogParams = {},
  signal?: AbortSignal,
) {
  return api.get<AuditLog[]>("/admin/audit-logs", { query: params, signal });
}

/** `agentId` is the delivery agent's USER id, not an internal agent record id. */
export async function assignDelivery(input: {
  parcelId: string;
  agentId: string;
}): Promise<void> {
  await api.patch<unknown>(
    `/deliveries/${encodeURIComponent(input.parcelId)}/assign`,
    { agentId: input.agentId },
  );
}
