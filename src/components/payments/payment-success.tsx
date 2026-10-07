"use client";

import { CircleAlert, CircleCheck, LoaderCircle, SearchX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PayButton } from "@/components/payments/pay-button";
import { ResultCard } from "@/components/payments/result-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePayment } from "@/hooks/use-payments";
import { getErrorMessage, isApiError } from "@/lib/api/errors";
import { formatMoney } from "@/lib/format";

const POLL_WINDOW_MS = 60_000;

export function PaymentSuccess() {
  const parcelId = useSearchParams().get("parcelId")?.trim() || undefined;
  const [timedOut, setTimedOut] = useState(false);
  const [round, setRound] = useState(0);

  // Poll for a minute, then stop. "Check again" starts a new round.
  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), POLL_WINDOW_MS);
    return () => window.clearTimeout(timer);
  }, [round]);

  const payment = usePayment(parcelId, { poll: !timedOut });

  const checkAgain = () => {
    setTimedOut(false);
    setRound((value) => value + 1);
    void payment.refetch();
  };

  if (!parcelId) {
    return (
      <ResultCard
        icon={SearchX}
        tone="neutral"
        title="We couldn't find your shipment"
        actions={
          <Link href="/dashboard/shipments" className={buttonVariants()}>
            Go to shipments
          </Link>
        }
      >
        <p>
          This page needs a shipment reference. Open your shipments to check the
          payment status.
        </p>
      </ResultCard>
    );
  }

  const viewShipment = (
    <Link
      href={`/dashboard/shipments/${parcelId}`}
      className={buttonVariants({ variant: "outline" })}
    >
      View shipment
    </Link>
  );

  if (payment.isPending) {
    return (
      <ResultCard
        icon={LoaderCircle}
        tone="pending"
        iconClassName="animate-spin"
        title="Checking your payment…"
      >
        <p>One moment while we ask for the payment status.</p>
      </ResultCard>
    );
  }

  if (payment.isError) {
    const notFound = isApiError(payment.error) && payment.error.status === 404;
    return (
      <ResultCard
        icon={CircleAlert}
        tone="danger"
        title={
          notFound
            ? "No payment found for this shipment"
            : "We couldn't check your payment"
        }
        actions={
          <>
            {notFound ? null : <Button onClick={checkAgain}>Try again</Button>}
            {viewShipment}
          </>
        }
      >
        <p>
          {notFound
            ? "Start a payment from the shipment page."
            : getErrorMessage(payment.error)}
        </p>
      </ResultCard>
    );
  }

  const { status, amount, currency, id } = payment.data;
  const reference = id.slice(0, 8);

  if (status === "PAID") {
    return (
      <ResultCard
        icon={CircleCheck}
        tone="success"
        title="Payment confirmed"
        actions={
          <>
            <Link
              href={`/dashboard/shipments/${parcelId}`}
              className={buttonVariants()}
            >
              View shipment
            </Link>
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "outline" })}
            >
              Go to dashboard
            </Link>
          </>
        }
      >
        <p>
          We received your payment of {formatMoney(amount, currency)}. Your
          shipment is now marked as paid.
        </p>
      </ResultCard>
    );
  }

  if (status === "FAILED") {
    return (
      <ResultCard
        icon={CircleAlert}
        tone="danger"
        title="Payment didn't go through"
        actions={
          <>
            <PayButton parcelId={parcelId} label="Try again" />
            {viewShipment}
          </>
        }
      >
        <p>
          The payment wasn&apos;t completed. Nothing has been marked as paid,
          and you can try again.
        </p>
      </ResultCard>
    );
  }

  // Still pending: returning from Stripe is not proof of payment, so we wait for the backend.
  if (timedOut) {
    return (
      <ResultCard
        icon={LoaderCircle}
        tone="pending"
        title="Still waiting for confirmation"
        actions={
          <>
            <Button onClick={checkAgain} disabled={payment.isFetching}>
              Check again
            </Button>
            {viewShipment}
          </>
        }
      >
        <p>
          We haven&apos;t received Stripe&apos;s confirmation yet. If you
          completed the payment, your shipment will show as paid as soon as it
          arrives. You can check again or come back later.
        </p>
        <p className="mt-3 text-xs">
          Payment reference: <span className="font-mono">{reference}</span>
        </p>
      </ResultCard>
    );
  }

  return (
    <ResultCard
      icon={LoaderCircle}
      tone="pending"
      iconClassName="animate-spin"
      title="Confirming your payment…"
    >
      <p>
        Stripe has sent you back to SwiftDrop. We&apos;re waiting for Stripe to
        confirm the payment to our servers. This page updates by itself.
      </p>
    </ResultCard>
  );
}
