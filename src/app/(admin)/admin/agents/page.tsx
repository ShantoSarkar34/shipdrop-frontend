import type { Metadata } from "next";
import { Suspense } from "react";
import { AgentsRoster } from "@/components/admin/agents-roster";
import { PageHeading } from "@/components/layout/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Delivery agents" };

export default function AgentsPage() {
  return (
    <>
      <PageHeading
        title="Delivery agents"
        description="See who is available. Assign agents from a shipment's page."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AgentsRoster />
      </Suspense>
    </>
  );
}