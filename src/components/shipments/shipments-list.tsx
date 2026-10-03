"use client";

import { ChevronRight, Package, PackagePlus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type ChangeEvent } from "react";
import { FormError } from "@/components/forms/form-error";
import { NativeSelect } from "@/components/forms/native-select";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useParcelListParams } from "@/hooks/use-parcel-list-params";
import { useParcelList } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/errors";
import type { ParcelSortBy, SortOrder } from "@/lib/api/parcels";
import { PARCEL_STATUSES, STATUS_LABEL } from "@/lib/parcel-status";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: readonly {
  value: string;
  label: string;
  sortBy: ParcelSortBy;
  sortOrder: SortOrder;
}[] = [
  {
    value: "createdAt:desc",
    label: "Newest first",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    value: "createdAt:asc",
    label: "Oldest first",
    sortBy: "createdAt",
    sortOrder: "asc",
  },
  {
    value: "deliveryCharge:desc",
    label: "Charge: high to low",
    sortBy: "deliveryCharge",
    sortOrder: "desc",
  },
  {
    value: "deliveryCharge:asc",
    label: "Charge: low to high",
    sortBy: "deliveryCharge",
    sortOrder: "asc",
  },
];

function ListSkeleton() {
  return (
    <ul className="space-y-2" aria-busy="true" aria-label="Loading shipments">
      {Array.from({ length: 5 }, (_, index) => (
        <li key={index}>
          <Skeleton className="h-16 w-full rounded-xl" />
        </li>
      ))}
    </ul>
  );
}

export function ShipmentsList() {
  const { state, update } = useParcelListParams();
  const query = useParcelList(state);
  const searchRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // Keep the box in step with the URL (back/forward, clear filters) without fighting the user's typing.
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

  const onSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((item) => item.value === value);
    if (!option || option.value === SORT_OPTIONS[0].value)
      update({ sortBy: undefined, sortOrder: undefined });
    else update({ sortBy: option.sortBy, sortOrder: option.sortOrder });
  };

  const clearFilters = () =>
    update({
      q: undefined,
      status: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });

  const items = query.data?.data ?? [];
  const meta = query.data?.meta;
  const hasFilters = Boolean(state.q || state.status);

  let content;
  if (query.isPending) {
    content = <ListSkeleton />;
  } else if (query.isError && !query.data) {
    content = (
      <div className="space-y-3">
        <FormError>{getErrorMessage(query.error)}</FormError>
        <Button variant="outline" size="sm" onClick={() => query.refetch()}>
          Try again
        </Button>
      </div>
    );
  } else if (items.length === 0) {
    if (state.page > 1 && meta && meta.total > 0) {
      content = (
        <EmptyState
          icon={Package}
          title="No shipments on this page"
          description="This page is past the end of the results."
          action={
            <Button onClick={() => update({ page: undefined })}>
              Go to the first page
            </Button>
          }
        />
      );
    } else if (hasFilters) {
      content = (
        <EmptyState
          icon={Search}
          title="No matching shipments"
          description="Nothing matches your search or filters. Try different words or clear the filters."
          action={<Button onClick={clearFilters}>Clear filters</Button>}
        />
      );
    } else {
      content = (
        <EmptyState
          icon={Package}
          title="No shipments yet"
          description="Create your first shipment and it will appear here."
          action={
            <Link href="/dashboard/shipments/new" className={buttonVariants()}>
              <PackagePlus aria-hidden="true" />
              Create shipment
            </Link>
          }
        />
      );
    }
  } else {
    content = (
      <>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/dashboard/shipments/${item.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span className="min-w-0 truncate font-mono text-sm font-medium">
                  {item.trackingId}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <StatusBadge status={item.status} />
                  <ChevronRight
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_11rem_12rem]">
        <div className="relative">
          <label htmlFor="shipment-search" className="sr-only">
            Search shipments
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="shipment-search"
            ref={searchRef}
            type="search"
            defaultValue={state.q}
            onChange={onSearchChange}
            placeholder="Search by tracking ID, sender or receiver"
            className="pl-9"
          />
        </div>
        <NativeSelect
          label="Filter by status"
          value={state.status ?? ""}
          onChange={(event) =>
            update({ status: event.target.value || undefined })
          }
        >
          <option value="">All statuses</option>
          {PARCEL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          label="Sort shipments"
          value={`${state.sortBy}:${state.sortOrder}`}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      <p role="status" className="sr-only">
        {meta ? `${meta.total} shipments found` : ""}
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
    </>
  );
}
