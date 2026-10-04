"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/errors";
import {
  acceptDelivery,
  fetchAgentAnalytics,
  fetchDeliveries,
  fetchEarnings,
  findDelivery,
  pickupDelivery,
  rejectDelivery,
  setAvailability,
  updateParcelStatus,
  type DeliveryListParams,
} from "@/lib/api/deliveries";
import { STATUS_LABEL, type ParcelStatus } from "@/lib/parcel-status";
import { queryKeys } from "@/lib/query/keys";

export function useDeliveries(params: DeliveryListParams) {
  return useQuery({
    queryKey: queryKeys.deliveries.list(params),
    queryFn: ({ signal }) => fetchDeliveries(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export function useDeliveryLookup(
  id: string,
  status: ParcelStatus | undefined,
) {
  return useQuery({
    queryKey: queryKeys.deliveries.lookup(id, status ?? ""),
    queryFn: ({ signal }) => findDelivery(id, status as ParcelStatus, signal),
    enabled: Boolean(status),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export function useEarnings(period: string) {
  return useQuery({
    queryKey: queryKeys.deliveries.earnings(period),
    queryFn: ({ signal }) => fetchEarnings(period, signal),
    staleTime: 60_000,
  });
}

export function useAgentAnalytics(period: string) {
  return useQuery({
    queryKey: queryKeys.deliveries.analytics(period),
    queryFn: ({ signal }) => fetchAgentAnalytics(period, signal),
    staleTime: 60_000,
  });
}

// None of these are optimistic. The backend decides, and on success or failure we reload,
// because another user may have changed the shipment in the meantime.
function useRefreshAfterDeliveryChange() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveries.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.parcels.all }),
    ]);
}

export function useAcceptDelivery() {
  const refresh = useRefreshAfterDeliveryChange();
  return useMutation({
    mutationFn: acceptDelivery,
    onSuccess: () => toast.success("Assignment accepted"),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: refresh,
  });
}

export function useRejectDelivery() {
  const refresh = useRefreshAfterDeliveryChange();
  return useMutation({
    mutationFn: rejectDelivery,
    onSuccess: () => toast.success("Assignment declined"),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: refresh,
  });
}

export function usePickupDelivery() {
  const refresh = useRefreshAfterDeliveryChange();
  return useMutation({
    mutationFn: pickupDelivery,
    onSuccess: () => toast.success("Marked as picked up"),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: refresh,
  });
}

export function useUpdateDeliveryStatus() {
  const refresh = useRefreshAfterDeliveryChange();
  return useMutation({
    mutationFn: updateParcelStatus,
    onSuccess: (_data, variables) =>
      toast.success(`Status updated to ${STATUS_LABEL[variables.status]}`),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: refresh,
  });
}

export function useSetAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setAvailability,
    onSuccess: (_data, availability) =>
      toast.success(
        availability === "AVAILABLE"
          ? "You're now available"
          : "You're now offline",
      ),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}
