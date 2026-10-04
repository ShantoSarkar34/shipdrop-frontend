"use client";

import { Ban, CircleCheck, Search, Users } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FormError } from "@/components/forms/form-error";
import { NativeSelect } from "@/components/forms/native-select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import {
  RBody,
  RCell,
  RHead,
  RHeadCell,
  RRow,
  ResponsiveTable,
  TableShell,
} from "@/components/shared/responsive-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_LABEL } from "@/config/roles";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/use-admin";
import {
  USER_PAGE_LIMIT,
  useUserListParams,
} from "@/hooks/use-admin-list-params";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { AdminUser } from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AgentAvailability, Role, UserStatus } from "@/types/user";

const ROLES: readonly Role[] = ["CUSTOMER", "DELIVERY_AGENT", "ADMIN"];
const AVAILABILITY_LABEL: Record<AgentAvailability, string> = {
  AVAILABLE: "Available",
  OFFLINE: "Offline",
  ON_DELIVERY: "On delivery",
};

function UserStatusBadge({ status }: { status: UserStatus }) {
  const active = status === "ACTIVE";
  const Icon = active ? CircleCheck : Ban;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-success-soft text-success-fg"
          : "bg-danger-soft text-danger-fg",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {active ? "Active" : "Suspended"}
    </span>
  );
}

export function UsersList() {
  const { state, update } = useUserListParams();
  const query = useAdminUsers({
    page: state.page,
    limit: USER_PAGE_LIMIT,
    role: state.role,
    status: state.status,
    q: state.q || undefined,
    sortBy: "createdAt",
    sortOrder: state.sortOrder,
  });
  const { data: me } = useCurrentUser();
  const mutation = useUpdateUserStatus();
  const [target, setTarget] = useState<{
    user: AdminUser;
    next: UserStatus;
  } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const input = searchRef.current;
    if (input && document.activeElement !== input && input.value !== state.q)
      input.value = state.q;
  }, [state.q]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => update({ q: value.trim() || undefined }, { replace: true }),
      350,
    );
  };

  const users = query.data?.data ?? [];
  const meta = query.data?.meta;
  const hasFilters = Boolean(state.q || state.role || state.status);

  let content;
  if (query.isPending) {
    content = <Skeleton className="h-96 w-full rounded-xl" />;
  } else if (query.isError && !query.data) {
    content = (
      <div className="space-y-3">
        <FormError>{getErrorMessage(query.error)}</FormError>
        <Button variant="outline" size="sm" onClick={() => query.refetch()}>
          Try again
        </Button>
      </div>
    );
  } else if (users.length === 0) {
    content = (
      <EmptyState
        icon={Users}
        title="No users found"
        description={
          hasFilters
            ? "No users match your search or filters."
            : "There are no users to show yet."
        }
        action={
          hasFilters || state.page > 1 ? (
            <Button
              onClick={() =>
                update({
                  q: undefined,
                  role: undefined,
                  status: undefined,
                  sortOrder: undefined,
                })
              }
            >
              Clear filters
            </Button>
          ) : undefined
        }
      />
    );
  } else {
    content = (
      <>
        <TableShell>
          <ResponsiveTable>
            <RHead>
              <RHeadCell>User</RHeadCell>
              <RHeadCell>Role</RHeadCell>
              <RHeadCell>Status</RHeadCell>
              <RHeadCell>Joined</RHeadCell>
              <RHeadCell className="text-right">
                <span className="sr-only">Actions</span>
              </RHeadCell>
            </RHead>
            <RBody>
              {users.map((user) => {
                const isSelf = user.id === me?.id;
                const availability = user.deliveryAgent?.availability;
                return (
                  <RRow key={user.id}>
                    <RCell label="User">
                      <p className="font-medium">{user.name}</p>
                      <p className="break-all text-muted-foreground">
                        {user.email}
                      </p>
                      {user.phone ? (
                        <p className="text-xs text-muted-foreground">
                          {user.phone}
                        </p>
                      ) : null}
                    </RCell>
                    <RCell label="Role">
                      {ROLE_LABEL[user.role]}
                      {availability ? (
                        <span className="block text-xs text-muted-foreground">
                          {AVAILABILITY_LABEL[availability]}
                        </span>
                      ) : null}
                    </RCell>
                    <RCell label="Status">
                      <UserStatusBadge status={user.status} />
                    </RCell>
                    <RCell label="Joined">{formatDate(user.createdAt)}</RCell>
                    <RCell label="" className="md:text-right">
                      {isSelf ? (
                        <span className="text-xs text-muted-foreground">
                          Your account
                        </span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setTarget({
                              user,
                              next:
                                user.status === "ACTIVE"
                                  ? "SUSPENDED"
                                  : "ACTIVE",
                            })
                          }
                        >
                          {user.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                          <span className="sr-only"> {user.name}</span>
                        </Button>
                      )}
                    </RCell>
                  </RRow>
                );
              })}
            </RBody>
          </ResponsiveTable>
        </TableShell>
        {meta ? (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={(page) =>
              update({ page: page === 1 ? undefined : String(page) })
            }
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_11rem_10rem_10rem]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor="user-search" className="sr-only">
            Search users
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="user-search"
            ref={searchRef}
            type="search"
            defaultValue={state.q}
            onChange={onSearchChange}
            placeholder="Search by name or email"
            className="pl-9"
          />
        </div>
        <NativeSelect
          label="Filter by role"
          value={state.role ?? ""}
          onChange={(event) =>
            update({ role: event.target.value || undefined })
          }
        >
          <option value="">All roles</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABEL[role]}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          label="Filter by status"
          value={state.status ?? ""}
          onChange={(event) =>
            update({ status: event.target.value || undefined })
          }
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </NativeSelect>
        <NativeSelect
          label="Sort users"
          value={state.sortOrder}
          onChange={(event) =>
            update({
              sortOrder: event.target.value === "asc" ? "asc" : undefined,
            })
          }
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </NativeSelect>
      </div>

      <p role="status" className="sr-only">
        {meta ? `${meta.total} users found` : ""}
      </p>
      <div
        aria-busy={query.isFetching}
        className={cn(
          "transition-opacity",
          query.isPlaceholderData && "opacity-60",
        )}
      >
        {content}
      </div>

      <ConfirmDialog
        open={target !== null}
        title={
          target
            ? target.next === "SUSPENDED"
              ? `Suspend ${target.user.name}?`
              : `Reactivate ${target.user.name}?`
            : ""
        }
        description={
          target?.next === "SUSPENDED"
            ? "A suspended user can't use their account until an administrator reactivates it."
            : "The user will be able to use their account again."
        }
        confirmLabel={
          target?.next === "SUSPENDED" ? "Suspend user" : "Reactivate user"
        }
        destructive={target?.next === "SUSPENDED"}
        pending={mutation.isPending}
        onDismiss={() => setTarget(null)}
        onConfirm={() => {
          if (target) {
            mutation.mutate(
              { id: target.user.id, status: target.next },
              { onSettled: () => setTarget(null) },
            );
          }
        }}
      />
    </>
  );
}
