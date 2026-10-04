"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DeliveryActions } from "@/components/deliveries/delivery-actions";
import { DeliveryInfo } from "@/components/deliveries/delivery-info";
import { FormError } from "@/components/forms/form-error";
import { StatusBadge } from "@/components/shared/status-badge";
import { ShipmentTimeline } from "@/components/shipments/shipment-timeline";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeliveryLookup } from "@/hooks/use-deliveries";
import { useParcel } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/errors";
import { buildTimeline } from "@/lib/parcel-status";

export function DeliveryDetail({ id }: { id: string }) {
  const parcel = useParcel(id);
  const delivery = useDeliveryLookup(id, parcel.data?.status);

  if (parcel.isPending) {
    return (
      <div aria-busy="true" aria-label="Loading delivery">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-3 h-9 w-72" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (parcel.isError) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-12 text-center">
        <h1 className="text-xl font-extrabold">We couldn&apos;t open this delivery</h1>
        <FormError>{getErrorMessage(parcel.error)}</FormError>
        <div className="flex justify-center gap-2">
          <Button onClick={() => parcel.refetch()}>Try again</Button>
          <Link href="/provider/deliveries" className={buttonVariants({ variant: "outline" })}>
            All deliveries
          </Link>
        </div>
      </div>
    );
  }

  const shipment = parcel.data;
  const steps = buildTimeline(shipment.statusHistory ?? [], shipment.status);

  return (
    <>
      <div className="mb-8">
        <Link
          href="/provider/deliveries"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Deliveries
        </Link>
        <h1 className="mt-2 flex flex-wrap items-center gap-3 text-2xl font-extrabold tracking-tight">
          <span className="font-mono">{shipment.trackingId}</span>
          <StatusBadge status={shipment.status} />
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-6">
          {delivery.data ? (
            <section aria-labelledby="info-heading" className="rounded-xl border border-border bg-card p-6">
              <h2 id="info-heading" className="mb-4 text-lg font-bold">
                Delivery details
              </h2>
              <DeliveryInfo delivery={delivery.data} />
            </section>
          ) : null}
          <section aria-labelledby="history-heading" className="rounded-xl border border-border bg-card p-6">
            <h2 id="history-heading" className="mb-6 text-lg font-bold">
              Status history
            </h2>
            <ShipmentTimeline steps={steps} />
          </section>
        </div>

        <section aria-labelledby="actions-heading" className="rounded-xl border border-border bg-card p-6">
          <h2 id="actions-heading" className="mb-4 text-lg font-bold">
            Next steps
          </h2>
          <DeliveryActions parcelId={shipment.id} status={shipment.status} />
        </section>
      </div>
    </>
  );
}