"use client";

import { useMemo } from "react";
import { useUrlParams } from "@/hooks/use-url-params";
import type { SortOrder } from "@/lib/api/parcels";
import type { Role, UserStatus } from "@/types/user";

export const USER_PAGE_LIMIT = 10;
export const AUDIT_PAGE_LIMIT = 20;

const ROLES: readonly Role[] = ["CUSTOMER", "DELIVERY_AGENT", "ADMIN"];
const USER_STATUSES: readonly UserStatus[] = ["ACTIVE", "SUSPENDED"];

function parsePage(value: string | null) {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export interface UserListState {
  q: string;
  role?: Role;
  status?: UserStatus;
  sortOrder: SortOrder;
  page: number;
}

export function useUserListParams() {
  const { searchParams, update } = useUrlParams();
  const state = useMemo<UserListState>(() => {
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    return {
      q: (searchParams.get("q") ?? "").trim(),
      role: ROLES.find((item) => item === role),
      status: USER_STATUSES.find((item) => item === status),
      sortOrder: searchParams.get("sortOrder") === "asc" ? "asc" : "desc",
      page: parsePage(searchParams.get("page")),
    };
  }, [searchParams]);
  return { state, update };
}

export interface AuditLogState {
  action: string;
  page: number;
}

export function useAuditLogParams() {
  const { searchParams, update } = useUrlParams();
  const state = useMemo<AuditLogState>(
    () => ({
      action: (searchParams.get("action") ?? "").trim(),
      page: parsePage(searchParams.get("page")),
    }),
    [searchParams],
  );
  return { state, update };
}
