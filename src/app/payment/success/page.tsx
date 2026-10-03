import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSuccess } from "@/components/payments/payment-success";
import { ResultCardSkeleton } from "@/components/payments/result-card";

export const metadata: Metadata = { title: "Payment status" };

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<ResultCardSkeleton />}>
      <PaymentSuccess />
    </Suspense>
  );
}
