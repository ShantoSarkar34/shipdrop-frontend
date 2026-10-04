import type { AuditLogParams, UserListParams } from "@/lib/api/admin";
import type { DeliveryListParams } from "@/lib/api/deliveries";
import type { ParcelListParams } from "@/lib/api/parcels";
import type { ParcelStatus } from "@/lib/parcel-status";
import { PaymentListParams } from "../api/payments";

export const queryKeys = {
  me: ["me"] as const,
  parcels: {
    all: ["parcels"] as const,
    count: (status?: ParcelStatus) =>
      ["parcels", "count", status ?? "all"] as const,
    list: (params: ParcelListParams) => ["parcels", "list", params] as const,
    detail: (id: string) => ["parcels", "detail", id] as const,
  },
  payments: {
    all: ["payments"] as const,
    byParcel: (parcelId: string) => ["payments", "parcel", parcelId] as const,
    list: (params: PaymentListParams) => ["payments", "list", params] as const,
  },
  deliveries: {
    all: ["deliveries"] as const,
    list: (params: DeliveryListParams) =>
      ["deliveries", "list", params] as const,
    lookup: (id: string, status: string) =>
      ["deliveries", "lookup", id, status] as const,
    earnings: (period: string) => ["deliveries", "earnings", period] as const,
    analytics: (period: string) => ["deliveries", "analytics", period] as const,
  },
  admin: {
    all: ["admin"] as const,
    stats: ["admin", "stats"] as const,
    analytics: (period: string) => ["admin", "analytics", period] as const,
    users: (params: UserListParams) => ["admin", "users", params] as const,
    agents: (q: string) => ["admin", "agents", q] as const,
    auditLogs: (params: AuditLogParams) =>
      ["admin", "audit-logs", params] as const,
  },
};
