"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { isParcelStatus, type ParcelStatus } from "@/lib/parcel-status";

export const DELIVERY_PAGE_LIMIT = 10;

export interface DeliveryListState {
  status?: ParcelStatus;
  page: number;
}

export function useDeliveryListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo<DeliveryListState>(() => {
    const status = searchParams.get("status") ?? "";
    const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
    return {
      status: isParcelStatus(status) ? status : undefined,
      page: Number.isFinite(page) && page > 0 ? page : 1,
    };
  }, [searchParams]);

  const update = useCallback(
    (patch: { status?: string; page?: string }) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      if (!("page" in patch)) next.delete("page");
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { state, update };
}
