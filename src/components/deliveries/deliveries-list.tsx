"use client";

import { Truck } from "lucide-react";
import { FormError } from "@/components/forms/form-error";
import { NativeSelect } from "@/components/forms/native-select";
import { DeliveryCard } from "@/components/deliveries/delivery-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DELIVERY_PAGE_LIMIT,
  useDeliveryListParams,
} from "@/hooks/use-delivery-list-params";
import { useDeliveries } from "@/hooks/use-deliveries";
import { getErrorMessage } from "@/lib/api/errors";
import { STATUS_LABEL, type ParcelStatus } from "@/lib/parcel-status";
import { cn } from "@/lib/utils";

const FILTERS: readonly ParcelStatus[] = [
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "FAILED_DELIVERY",
  "RETURNED",
];

export function DeliveriesList() {
  const { state, update } = useDeliveryListParams();
  const query = useDeliveries({
    page: state.page,
    limit: DELIVERY_PAGE_LIMIT,
    status: state.status,
  });

  const items = query.data?.data ?? [];
  const meta = query.data?.meta;

  let content;
  if (query.isPending) {
    content = (
      <div
        className="space-y-4"
        aria-busy="true"
        aria-label="Loading deliveries"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-56 w-full rounded-xl" />
        ))}
      </div>
    );
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
    content =
      state.status || state.page > 1 ? (
        <EmptyState
          icon={Truck}
          title="No deliveries here"
          description="Nothing matches this filter or page."
          action={
            <Button
              onClick={() => update({ status: undefined, page: undefined })}
            >
              Show all deliveries
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={Truck}
          title="No deliveries assigned yet"
          description="When an administrator assigns you a delivery, it will appear here. Make sure you're set to Available on your dashboard."
        />
      );
  } else {
    content = (
      <>
        <div className="space-y-4">
          {items.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
        {meta ? (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={(page) =>
              update({
                status: state.status,
                page: page === 1 ? undefined : String(page),
              })
            }
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="mb-6 max-w-xs">
        <NativeSelect
          label="Filter by status"
          value={state.status ?? ""}
          onChange={(event) =>
            update({ status: event.target.value || undefined })
          }
        >
          <option value="">All deliveries</option>
          {FILTERS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </NativeSelect>
      </div>
      <p role="status" className="sr-only">
        {meta ? `${meta.total} deliveries found` : ""}
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
