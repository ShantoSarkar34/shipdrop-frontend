"use client";

import { useQueries } from "@tanstack/react-query";
import {
  ChevronRight,
  Clock,
  Package,
  PackageCheck,
  PackagePlus,
  Truck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { ChartCard } from "@/components/charts/chart-card";
import { ProgressRing } from "@/components/charts/progress-ring";
import { LazyDonutChart } from "@/components/charts/lazy-charts";
import { FormError } from "@/components/forms/form-error";
import { RevealGroup } from "@/components/marketing/reveal";
import { PageHeading } from "@/components/layout/page-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRecentParcels } from "@/hooks/use-parcels";
import { fetchParcelCount } from "@/lib/api/parcels";
import { ratio } from "@/lib/chart-data";
import type { ParcelStatus } from "@/lib/parcel-status";
import { queryKeys } from "@/lib/query/keys";

const COUNTS: readonly {
  label: string;
  status?: ParcelStatus;
  icon: LucideIcon;
}[] = [
  { label: "Total shipments", icon: Package },
  { label: "Pending", status: "PENDING", icon: Clock },
  { label: "In transit", status: "IN_TRANSIT", icon: Truck },
  { label: "Delivered", status: "DELIVERED", icon: PackageCheck },
  { label: "Cancelled", status: "CANCELLED", icon: Package },
];

export function DashboardOverview() {
  const { data: user } = useCurrentUser();
  const counts = useQueries({
    queries: COUNTS.map((metric) => ({
      queryKey: queryKeys.parcels.count(metric.status),
      queryFn: () => fetchParcelCount(metric.status),
      staleTime: 30_000,
    })),
  });
  const recent = useRecentParcels(5);

  const failed = counts.some((count) => count.isError);
  const ready = counts.every((count) => count.data !== undefined);
  const [total = 0, pending = 0, inTransit = 0, delivered = 0, cancelled = 0] =
    counts.map((count) => count.data);
  const other = Math.max(
    0,
    total - pending - inTransit - delivered - cancelled,
  );
  const slices = [
    { label: "Pending", value: pending },
    { label: "In transit", value: inTransit },
    { label: "Delivered", value: delivered },
    { label: "Cancelled", value: cancelled },
    { label: "Other", value: other },
  ].filter((slice) => slice.value > 0);
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
          <FormError>
            We couldn&apos;t load some of your numbers. Check your connection
            and try again.
          </FormError>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              counts.forEach((count) => count.isError && void count.refetch())
            }
          >
            Try again
          </Button>
        </div>
      ) : null}

      <RevealGroup
        stagger={0.08}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {COUNTS.slice(0, 4).map((metric, index) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            icon={metric.icon}
            value={counts[index].data}
            loading={counts[index].isPending}
          />
        ))}
      </RevealGroup>

      {ready && total === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Package}
            title="No shipments yet"
            description="Create your first shipment and track it here from pickup to delivery."
            action={
              <Link
                href="/dashboard/shipments/new"
                className={buttonVariants()}
              >
                Create shipment
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <ChartCard
              title="Shipments by status"
              description="How your shipments are distributed right now."
            >
              {!ready ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <LazyDonutChart
                  data={slices}
                  centerLabel="shipments"
                  summary="Donut chart of your shipments by status"
                />
              )}
            </ChartCard>
            <ChartCard
              title="Delivery rate"
              description="Delivered shipments out of all shipments."
            >
              {!ready ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="flex h-full min-h-56 items-center justify-center">
                  <ProgressRing
                    value={ratio(delivered, total)}
                    caption="of your shipments have been delivered"
                  />
                </div>
              )}
            </ChartCard>
          </div>

          <section aria-labelledby="recent-heading" className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="recent-heading" className="text-xl font-bold">
                Recent shipments
              </h2>
              <Link
                href="/dashboard/shipments"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </div>
            {recent.isPending ? (
              <Skeleton className="h-48 w-full rounded-xl" />
            ) : recent.isError ? (
              <FormError>
                We couldn&apos;t load your recent shipments.
              </FormError>
            ) : (
              <ul className="space-y-2">
                {recent.data.data.map((shipment) => (
                  <li key={shipment.id}>
                    <Link
                      href={`/dashboard/shipments/${shipment.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <span className="min-w-0 truncate font-mono text-sm font-medium">
                        {shipment.trackingId}
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <StatusBadge status={shipment.status} />
                        <ChevronRight
                          className="size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </>
  );
}
