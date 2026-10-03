"use client";

import { useQueries } from "@tanstack/react-query";
import { Clock, Package, PackageCheck, PackagePlus, Truck } from "lucide-react";
import Link from "next/link";
import { FormError } from "@/components/forms/form-error";
import { PageHeading } from "@/components/layout/page-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { fetchParcelCount } from "@/lib/api/parcels";
import type { ParcelStatus } from "@/lib/parcel-status";
import { queryKeys } from "@/lib/query/keys";

const METRICS: readonly { label: string; status?: ParcelStatus; icon: typeof Package }[] = [
  { label: "Total shipments", icon: Package },
  { label: "Pending", status: "PENDING", icon: Clock },
  { label: "In transit", status: "IN_TRANSIT", icon: Truck },
  { label: "Delivered", status: "DELIVERED", icon: PackageCheck },
];

export function DashboardOverview() {
  const { data: user } = useCurrentUser();
  const counts = useQueries({
    queries: METRICS.map((metric) => ({
      queryKey: queryKeys.parcels.count(metric.status),
      queryFn: () => fetchParcelCount(metric.status),
      staleTime: 30_000,
    })),
  });

  const failed = counts.some((count) => count.isError);
  const total = counts[0].data;
  const firstName = user?.name.split(" ")[0];

  return (
    <>
      <PageHeading
        title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        description="A summary of your shipments."
        actions={
          <Link href="/dashboard/shipments/new" className={buttonVariants()}>
            <PackagePlus aria-hidden="true" />
            Create shipment
          </Link>
        }
      />

      {failed ? (
        <div className="mb-6 space-y-3">
          <FormError>We couldn&apos;t load some of your numbers. Check your connection and try again.</FormError>
          <Button
            variant="outline"
            size="sm"
            onClick={() => counts.forEach((count) => count.isError && void count.refetch())}
          >
            Try again
          </Button>
        </div>
      ) : null}

      <section aria-label="Shipment summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric, index) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            icon={metric.icon}
            value={counts[index].data}
            loading={counts[index].isPending}
          />
        ))}
      </section>

      {total === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Package}
            title="No shipments yet"
            description="Create your first shipment and track it here from pickup to delivery."
            action={
              <Link href="/dashboard/shipments/new" className={buttonVariants()}>
                Create shipment
              </Link>
            }
          />
        </div>
      ) : null}
    </>
  );
}