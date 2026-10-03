"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FormError } from "@/components/forms/form-error";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { PaymentCard } from "@/components/shipments/payment-card";
import { ShipmentTimeline } from "@/components/shipments/shipment-timeline";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCancelParcel, useParcel } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/errors";
import { buildTimeline, canCustomerCancel } from "@/lib/parcel-status";

function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading shipment">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-3 h-9 w-72" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export function ShipmentDetail({ id }: { id: string }) {
  const parcel = useParcel(id);
  const cancel = useCancelParcel();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (parcel.isPending) return <DetailSkeleton />;

  if (parcel.isError) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-12 text-center">
        <h1 className="text-xl font-extrabold">
          We couldn&apos;t open this shipment
        </h1>
        <FormError>{getErrorMessage(parcel.error)}</FormError>
        <div className="flex justify-center gap-2">
          <Button onClick={() => parcel.refetch()}>Try again</Button>
          <Link
            href="/dashboard/shipments"
            className={buttonVariants({ variant: "outline" })}
          >
            All shipments
          </Link>
        </div>
      </div>
    );
  }

  const shipment = parcel.data;
  const steps = buildTimeline(shipment.statusHistory ?? [], shipment.status);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/shipments"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Shipments
          </Link>
          <h1 className="mt-2 flex flex-wrap items-center gap-3 text-2xl font-extrabold tracking-tight">
            <span className="font-mono">{shipment.trackingId}</span>
            <StatusBadge status={shipment.status} />
          </h1>
        </div>
        {canCustomerCancel(shipment.status) ? (
          <Button variant="outline" onClick={() => setConfirmOpen(true)}>
            Cancel shipment
          </Button>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <section
          aria-labelledby="history-heading"
          className="rounded-xl border border-border bg-card p-6"
        >
          <h2 id="history-heading" className="mb-6 text-lg font-bold">
            Status history
          </h2>
          <ShipmentTimeline steps={steps} />
        </section>
        <PaymentCard parcelId={shipment.id} shipmentStatus={shipment.status} />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this shipment?"
        description="This can't be undone. You can only cancel while the shipment is pending or confirmed."
        confirmLabel="Cancel shipment"
        dismissLabel="Keep shipment"
        destructive
        pending={cancel.isPending}
        onDismiss={() => setConfirmOpen(false)}
        onConfirm={() =>
          cancel.mutate(shipment.id, { onSettled: () => setConfirmOpen(false) })
        }
      />
    </>
  );
}
