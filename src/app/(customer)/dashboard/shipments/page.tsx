import { PackagePlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeading } from "@/components/layout/page-heading";
import { ShipmentsList } from "@/components/shipments/shipments-list";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Shipments" };

export default function ShipmentsPage() {
  return (
    <>
      <PageHeading
        title="Shipments"
        description="Search, filter and open any of your shipments."
        actions={
          <Link href="/dashboard/shipments/new" className={buttonVariants()}>
            <PackagePlus aria-hidden="true" />
            Create shipment
          </Link>
        }
      />
      {/* useSearchParams needs a Suspense boundary. */}
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ShipmentsList />
      </Suspense>
    </>
  );
}
