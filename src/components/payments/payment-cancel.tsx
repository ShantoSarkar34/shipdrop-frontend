"use client";

import { Ban } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PayButton } from "@/components/payments/pay-button";
import { ResultCard } from "@/components/payments/result-card";
import { buttonVariants } from "@/components/ui/button";

export function PaymentCancel() {
  const parcelId = useSearchParams().get("parcelId")?.trim() || undefined;

  return (
    <ResultCard
      icon={Ban}
      tone="neutral"
      title="Checkout cancelled"
      actions={
        parcelId ? (
          <>
            <PayButton parcelId={parcelId} label="Try payment again" />
            <Link
              href={`/dashboard/shipments/${parcelId}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Return to shipment
            </Link>
          </>
        ) : (
          <Link href="/dashboard/shipments" className={buttonVariants()}>
            Go to shipments
          </Link>
        )
      }
    >
      <p>
        You left Stripe&apos;s checkout before paying. Your shipment is saved,
        and you can pay whenever you&apos;re ready.
      </p>
    </ResultCard>
  );
}
