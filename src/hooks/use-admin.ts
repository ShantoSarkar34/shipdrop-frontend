"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  assignDelivery,
  fetchAdminAnalytics,
  fetchAdminStats,
  fetchAdminUsers,
  fetchAuditLogs,
  updateUserStatus,
  type AuditLogParams,
  type UserListParams,
} from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query/keys";

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: ({ signal }) => fetchAdminStats(signal),
    staleTime: 30_000,
  });
}

export function useAdminAnalytics(period: string) {
  return useQuery({
    queryKey: queryKeys.admin.analytics(period),
    queryFn: ({ signal }) => fetchAdminAnalytics(period, signal),
    staleTime: 60_000,
  });
}

export function useAdminUsers(params: UserListParams) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: ({ signal }) => fetchAdminUsers(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export const AGENT_PICKER_LIMIT = 20;

/** Active delivery agents, found through the users endpoint (there is no dedicated agent list). */
export function useAssignableAgents(search: string) {
  return useQuery({
    queryKey: queryKeys.admin.agents(search),
    queryFn: ({ signal }) =>
      fetchAdminUsers(
        {
          role: "DELIVERY_AGENT",
          status: "ACTIVE",
          limit: AGENT_PICKER_LIMIT,
          q: search || undefined,
        },
        signal,
      ),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

export function useAuditLogs(params: AuditLogParams) {
  return useQuery({
    queryKey: queryKeys.admin.auditLogs(params),
    queryFn: ({ signal }) => fetchAuditLogs(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (_data, variables) =>
      toast.success(
        variables.status === "SUSPENDED"
          ? "User suspended"
          : "User reactivated",
      ),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all }),
  });
}

export function useAssignDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignDelivery,
    onSuccess: () => toast.success("Delivery agent assigned"),
    onError: (error) => toast.error(getErrorMessage(error)),
    // Reload everything an assignment touches: the shipment, agent availability and the dashboard numbers.
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.parcels.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.deliveries.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.all }),
      ]),
  });
}
