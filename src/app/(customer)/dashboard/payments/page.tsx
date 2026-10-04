import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeading } from "@/components/layout/page-heading";
import { PaymentsList } from "@/components/payments/payments-list";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <>
      <PageHeading title="Payments" description="Your payment history." />
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <PaymentsList />
      </Suspense>
    </>
  );
}
