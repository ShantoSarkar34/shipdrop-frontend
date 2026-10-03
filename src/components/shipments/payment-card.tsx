"use client";

import { Ban, CircleAlert, CircleCheck, Clock } from "lucide-react";
import { FormError } from "@/components/forms/form-error";
import { PayButton } from "@/components/payments/pay-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayment } from "@/hooks/use-payments";
import { getErrorMessage, isApiError } from "@/lib/api/errors";
import { formatMoney } from "@/lib/format";
import type { ParcelStatus } from "@/lib/parcel-status";

export function PaymentCard({
  parcelId,
  shipmentStatus,
}: {
  parcelId: string;
  shipmentStatus: ParcelStatus;
}) {
  const payment = usePayment(parcelId);
  const cancelled = shipmentStatus === "CANCELLED";
  const noPaymentYet =
    isApiError(payment.error) && payment.error.status === 404;

  let body;
  if (payment.isPending) {
    body = <Skeleton className="h-16 w-full" />;
  } else if (payment.isError && !noPaymentYet) {
    body = (
      <div className="space-y-3">
        <FormError>{getErrorMessage(payment.error)}</FormError>
        <Button variant="outline" size="sm" onClick={() => payment.refetch()}>
          Try again
        </Button>
      </div>
    );
  } else if (payment.data?.status === "PAID") {
    body = (
      <div className="flex items-start gap-3">
        <CircleCheck
          className="mt-0.5 size-5 shrink-0 text-success-fg"
          aria-hidden="true"
        />
        <div>
          <p className="font-medium">Paid</p>
          <p className="text-sm text-muted-foreground">
            {formatMoney(payment.data.amount, payment.data.currency)}
          </p>
        </div>
      </div>
    );
  } else if (cancelled) {
    body = (
      <div className="flex items-start gap-3">
        <Ban
          className="mt-0.5 size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">
          This shipment was cancelled, so no payment is needed.
        </p>
      </div>
    );
  } else if (payment.data?.status === "FAILED") {
    body = (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <CircleAlert
            className="mt-0.5 size-5 shrink-0 text-danger-fg"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium">Payment failed</p>
            <p className="text-sm text-muted-foreground">
              Nothing was marked as paid. You can try again.
            </p>
          </div>
        </div>
        <PayButton parcelId={parcelId} label="Try again" />
      </div>
    );
  } else {
    body = (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Clock
            className="mt-0.5 size-5 shrink-0 text-warning-fg"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium">
              {noPaymentYet ? "Not paid yet" : "Awaiting payment"}
            </p>
            <p className="text-sm text-muted-foreground">
              {payment.data
                ? `Amount due: ${formatMoney(payment.data.amount, payment.data.currency)}`
                : "Pay online with Stripe's secure checkout."}
            </p>
          </div>
        </div>
        <PayButton parcelId={parcelId} />
      </div>
    );
  }

  return (
    <section
      aria-labelledby="payment-heading"
      className="rounded-xl border border-border bg-card p-6"
    >
      <h2 id="payment-heading" className="mb-4 text-lg font-bold">
        Payment
      </h2>
      {body}
    </section>
  );
}
