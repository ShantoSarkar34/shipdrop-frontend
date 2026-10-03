"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError, getErrorMessage } from "@/lib/api/errors";
import {
  createCheckout,
  fetchPayment,
  isStripeCheckoutUrl,
} from "@/lib/api/payments";
import { queryKeys } from "@/lib/query/keys";

const POLL_MS = 2500;

/** With `poll`, keeps checking until the backend reports PAID or FAILED. */
export function usePayment(
  parcelId: string | undefined,
  options: { poll?: boolean } = {},
) {
  return useQuery({
    queryKey: queryKeys.payments.byParcel(parcelId ?? ""),
    queryFn: ({ signal }) => fetchPayment(parcelId as string, signal),
    enabled: Boolean(parcelId),
    staleTime: 10_000,
    refetchInterval: options.poll
      ? (query) => {
          const status = query.state.data?.status;
          return status === "PAID" || status === "FAILED" ? false : POLL_MS;
        }
      : false,
  });
}

export function useStartCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (parcelId: string) => {
      const session = await createCheckout(parcelId);
      if (!isStripeCheckoutUrl(session.checkoutUrl)) {
        throw new ApiError({
          status: 502,
          message: "We couldn't start checkout. Please try again.",
        });
      }
      return session;
    },
    onSuccess: (session) => {
      window.location.assign(session.checkoutUrl);
    },
    onError: (error, parcelId) => {
      toast.error(getErrorMessage(error));
      // For example "already paid": refresh what we show.
      void queryClient.invalidateQueries({
        queryKey: queryKeys.payments.byParcel(parcelId),
      });
    },
  });
}
