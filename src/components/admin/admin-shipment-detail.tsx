"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AssignAgentPanel } from "@/components/admin/assign-agent-panel";
import { FormError } from "@/components/forms/form-error";
import { TextareaField } from "@/components/forms/textarea-field";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { ShipmentTimeline } from "@/components/shipments/shipment-timeline";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateDeliveryStatus } from "@/hooks/use-deliveries";
import { useParcel } from "@/hooks/use-parcels";
import { getErrorMessage } from "@/lib/api/errors";
import {
  buildTimeline,
  canAssignAgent,
  getAdminActions,
  type AdminAction,
} from "@/lib/parcel-status";

export function AdminShipmentDetail({ id }: { id: string }) {
  const parcel = useParcel(id);
  const update = useUpdateDeliveryStatus();
  const [action, setAction] = useState<AdminAction | null>(null);
  const [note, setNote] = useState("");

  if (parcel.isPending) {
    return (
      <div aria-busy="true" aria-label="Loading shipment">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-3 h-9 w-72" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

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
            href="/admin/shipments"
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
  const actions = getAdminActions(shipment.status);
  const close = () => {
    setAction(null);
    setNote("");
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/shipments"
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
        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {actions.map((item) => (
              <Button
                key={item.to}
                variant={item.tone === "danger" ? "outline" : "default"}
                className={
                  item.tone === "danger"
                    ? "text-destructive hover:text-destructive"
                    : undefined
                }
                onClick={() => setAction(item)}
                disabled={update.isPending}
              >
                {item.label}
              </Button>
            ))}
          </div>
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

        {canAssignAgent(shipment.status) ? (
          <AssignAgentPanel parcelId={shipment.id} />
        ) : (
          <section className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            <h2 className="mb-2 text-lg font-bold text-foreground">
              Assignment
            </h2>
            Agents can only be assigned while a shipment is pending or
            confirmed.
          </section>
        )}
      </div>

      <ConfirmDialog
        open={action !== null}
        title={action ? `${action.label}?` : ""}
        description="This updates the shipment's status for everyone following it."
        confirmLabel="Confirm"
        destructive={action?.tone === "danger"}
        pending={update.isPending}
        onDismiss={close}
        onConfirm={() => {
          if (action) {
            update.mutate(
              {
                id: shipment.id,
                status: action.to,
                note: note.trim() || undefined,
              },
              { onSettled: close },
            );
          }
        }}
      >
        <TextareaField
          label="Note (optional)"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </ConfirmDialog>
    </>
  );
}
