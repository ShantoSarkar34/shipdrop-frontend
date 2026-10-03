"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ParcelSortBy, SortOrder } from "@/lib/api/parcels";
import { isParcelStatus, type ParcelStatus } from "@/lib/parcel-status";

export const PAGE_LIMIT = 10;

export interface ParcelListState {
  q: string;
  status?: ParcelStatus;
  page: number;
  sortBy: ParcelSortBy;
  sortOrder: SortOrder;
}

type UrlKey = "q" | "status" | "page" | "sortBy" | "sortOrder";

function parseState(search: {
  get(name: string): string | null;
}): ParcelListState {
  const status = search.get("status") ?? "";
  const page = Number.parseInt(search.get("page") ?? "1", 10);
  const sortBy = search.get("sortBy");
  const sortOrder = search.get("sortOrder");
  return {
    q: (search.get("q") ?? "").trim(),
    status: isParcelStatus(status) ? status : undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    sortBy:
      sortBy === "createdAt" || sortBy === "deliveryCharge"
        ? sortBy
        : "createdAt",
    sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "desc",
  };
}

export function useParcelListParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = useMemo(() => parseState(searchParams), [searchParams]);

  /** Any change other than the page itself sends the user back to page 1. */
  const update = useCallback(
    (
      patch: Partial<Record<UrlKey, string | undefined>>,
      options?: { replace?: boolean },
    ) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      if (!("page" in patch)) next.delete("page");
      const query = next.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      if (options?.replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { state, update };
}
