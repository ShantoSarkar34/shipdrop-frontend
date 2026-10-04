"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { TextareaField } from "@/components/forms/textarea-field";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  useAcceptDelivery,
  usePickupDelivery,
  useRejectDelivery,
  useUpdateDeliveryStatus,
} from "@/hooks/use-deliveries";
import {
  getAgentActions,
  type AgentAction,
  type ParcelStatus,
} from "@/lib/parcel-status";

type StatusAction = Extract<AgentAction, { kind: "status" }>;
type DialogState =
  | { kind: "reject" }
  | { kind: "status"; action: StatusAction }
  | null;

export function DeliveryActions({
  parcelId,
  status,
}: {
  parcelId: string;
  status: ParcelStatus;
}) {
  const accept = useAcceptDelivery();
  const reject = useRejectDelivery();
  const pickup = usePickupDelivery();
  const update = useUpdateDeliveryStatus();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [note, setNote] = useState("");

  const actions = getAgentActions(status);
  const busy =
    accept.isPending ||
    reject.isPending ||
    pickup.isPending ||
    update.isPending;
  const close = () => {
    setDialog(null);
    setNote("");
  };

  if (actions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No actions are available at this stage.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          if (action.kind === "pickup") {
            return (
              <Button
                key="pickup"
                onClick={() => pickup.mutate(parcelId)}
                disabled={busy}
              >
                {pickup.isPending ? (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                ) : null}
                Mark picked up
              </Button>
            );
          }
          if (action.kind === "accept") {
            return (
              <Button
                key="accept"
                variant="outline"
                onClick={() => accept.mutate(parcelId)}
                disabled={busy}
              >
                {accept.isPending ? (
                  <LoaderCircle className="animate-spin" aria-hidden="true" />
                ) : null}
                Accept assignment
              </Button>
            );
          }
          if (action.kind === "reject") {
            return (
              <Button
                key="reject"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => setDialog({ kind: "reject" })}
                disabled={busy}
              >
                Decline
              </Button>
            );
          }
          return (
            <Button
              key={action.to}
              variant={action.tone === "danger" ? "outline" : "default"}
              className={
                action.tone === "danger"
                  ? "text-destructive hover:text-destructive"
                  : undefined
              }
              onClick={() => setDialog({ kind: "status", action })}
              disabled={busy}
            >
              {action.label}
            </Button>
          );
        })}
      </div>

      {status === "ASSIGNED" ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Accepting confirms you&apos;ll take this job. Mark it picked up once
          you have the parcel.
        </p>
      ) : null}

      <ConfirmDialog
        open={dialog !== null}
        title={
          dialog?.kind === "status"
            ? `${dialog.action.label}?`
            : "Decline this assignment?"
        }
        description={
          dialog?.kind === "status"
            ? "This updates the shipment's status for everyone following it."
            : "The shipment goes back to an administrator for reassignment, and you become available again."
        }
        confirmLabel={
          dialog?.kind === "status" ? "Confirm" : "Decline assignment"
        }
        destructive={
          dialog?.kind === "reject" ||
          (dialog?.kind === "status" && dialog.action.tone === "danger")
        }
        pending={reject.isPending || update.isPending}
        onDismiss={close}
        onConfirm={() => {
          if (dialog?.kind === "reject") {
            reject.mutate(parcelId, { onSettled: close });
          } else if (dialog?.kind === "status") {
            update.mutate(
              {
                id: parcelId,
                status: dialog.action.to,
                note: note.trim() || undefined,
              },
              { onSettled: close },
            );
          }
        }}
      >
        {dialog?.kind === "status" ? (
          <TextareaField
            label="Note (optional)"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        ) : null}
      </ConfirmDialog>
    </>
  );
}
