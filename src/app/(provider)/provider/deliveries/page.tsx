import type { Metadata } from "next";
import { Suspense } from "react";
import { DeliveriesList } from "@/components/deliveries/deliveries-list";
import { PageHeading } from "@/components/layout/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Deliveries" };

export default function DeliveriesPage() {
  return (
    <>
      <PageHeading
        title="Deliveries"
        description="Accept jobs, update progress and review your history."
      />
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <DeliveriesList />
      </Suspense>
    </>
  );
}
