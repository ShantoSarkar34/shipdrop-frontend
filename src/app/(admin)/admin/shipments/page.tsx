import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeading } from "@/components/layout/page-heading";
import { ShipmentsList } from "@/components/shipments/shipments-list";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Shipments" };

export default function AdminShipmentsPage() {
  return (
    <>
      <PageHeading
        title="Shipments"
        description="Search, filter and open any shipment to assign an agent."
      />
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ShipmentsList basePath="/admin/shipments" showCreate={false} />
      </Suspense>
    </>
  );
}
