"use client";

import { CreditCard, LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useStartCheckout } from "@/hooks/use-payments";

export function PayButton({
  parcelId,
  label = "Pay now",
  variant,
}: {
  parcelId: string;
  label?: string;
  variant?: ComponentProps<typeof Button>["variant"];
}) {
  const checkout = useStartCheckout();
  // Stay disabled after success: the browser is on its way to Stripe.
  const busy = checkout.isPending || checkout.isSuccess;

  return (
    <Button
      variant={variant}
      onClick={() => checkout.mutate(parcelId)}
      disabled={busy}
    >
      {busy ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : (
        <CreditCard aria-hidden="true" />
      )}
      {busy ? "Redirecting to Stripe…" : label}
    </Button>
  );
}
