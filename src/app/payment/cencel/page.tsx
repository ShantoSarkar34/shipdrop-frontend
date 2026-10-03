import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentCancel } from "@/components/payments/payment-cancel";
import { ResultCardSkeleton } from "@/components/payments/result-card";

export const metadata: Metadata = { title: "Checkout cancelled" };

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<ResultCardSkeleton />}>
      <PaymentCancel />
    </Suspense>
  );
}
