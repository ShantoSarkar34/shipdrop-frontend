"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  PAGE_LIMIT,
  type ParcelListState,
} from "@/hooks/use-parcel-list-params";
import { getErrorMessage } from "@/lib/api/errors";
import { cancelParcel, createParcel, fetchParcel, fetchParcels } from "@/lib/api/parcels";
import { queryKeys } from "@/lib/query/keys";

export function useParcelList(state: ParcelListState) {
  const params = {
    page: state.page,
    limit: PAGE_LIMIT,
    status: state.status,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    q: state.q || undefined,
  };
  return useQuery({
    queryKey: queryKeys.parcels.list(params),
    queryFn: ({ signal }) => fetchParcels(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export function useParcel(id: string) {
  return useQuery({
    queryKey: queryKeys.parcels.detail(id),
    queryFn: ({ signal }) => fetchParcel(id, signal),
    staleTime: 15_000,
  });
}

export function useCancelParcel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelParcel,
    onSuccess: () => toast.success("Shipment cancelled"),
    onError: (error) => toast.error(getErrorMessage(error)),
    // Not optimistic. On success or failure, reload: the status may have changed meanwhile
    // (for example an agent just picked the parcel up).
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.parcels.all }),
  });
}

export function useCreateParcel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createParcel,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.parcels.all });
      toast.success("Shipment created");
    },
    // Errors are handled by the wizard so they can be placed on the right field and step.
  });
}