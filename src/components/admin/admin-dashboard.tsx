"use client";

import {
  Ban,
  CircleAlert,
  CircleCheck,
  ClipboardList,
  Clock,
  Package,
  PackageCheck,
  Route,
  Truck,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { AdminCharts } from "@/components/admin/admin-charts";
import { FormError } from "@/components/forms/form-error";
import { PageHeading } from "@/components/layout/page-heading";
import { StatCard } from "@/components/shared/stat-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { DEFAULT_PERIOD } from "@/config/periods";
import { useAdminStats } from "@/hooks/use-admin";
import { getErrorMessage } from "@/lib/api/errors";
import { formatMoney } from "@/lib/format";

interface Metric {
  label: string;
  icon: LucideIcon;
  value?: number | string;
}

function Group({
  title,
  metrics,
  loading,
}: {
  title: string;
  metrics: Metric[];
  loading: boolean;
}) {
  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            icon={metric.icon}
            value={metric.value}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
}

export function AdminDashboard() {
  const stats = useAdminStats();
  const data = stats.data;

  const inProgress = data
    ? data.parcels.assigned +
      data.parcels.pickedUp +
      data.parcels.inTransit +
      data.parcels.outForDelivery
    : undefined;
  const awaitingAssignment = data
    ? data.parcels.pending + data.parcels.confirmed
    : undefined;

  return (
    <>
      <PageHeading
        title="Dashboard"
        description="A live overview of users, shipments and payments."
        actions={
          <Link
            href="/admin/analytics"
            className={buttonVariants({ variant: "outline" })}
          >
            Full analytics
          </Link>
        }
      />

      {stats.isError ? (
        <div className="mb-6 space-y-3">
          <FormError>{getErrorMessage(stats.error)}</FormError>
          <Button variant="outline" size="sm" onClick={() => stats.refetch()}>
            Try again
          </Button>
        </div>
      ) : null}

      <div className="space-y-8">
        <Group
          title="Users"
          loading={stats.isPending}
          metrics={[
            { label: "Total users", icon: Users, value: data?.users.total },
            {
              label: "Customers",
              icon: UserRound,
              value: data?.users.customers,
            },
            {
              label: "Delivery agents",
              icon: Truck,
              value: data?.users.deliveryAgents,
            },
            {
              label: "Suspended accounts",
              icon: Ban,
              value: data?.users.suspended,
            },
          ]}
        />
        <Group
          title="Shipments"
          loading={stats.isPending}
          metrics={[
            {
              label: "Total shipments",
              icon: Package,
              value: data?.parcels.total,
            },
            {
              label: "Awaiting assignment",
              icon: ClipboardList,
              value: awaitingAssignment,
            },
            { label: "In progress", icon: Route, value: inProgress },
            {
              label: "Delivered",
              icon: PackageCheck,
              value: data?.parcels.delivered,
            },
          ]}
        />
        <Group
          title="Payments"
          loading={stats.isPending}
          metrics={[
            { label: "Paid", icon: CircleCheck, value: data?.payments.paid },
            { label: "Pending", icon: Clock, value: data?.payments.pending },
            {
              label: "Failed",
              icon: CircleAlert,
              value: data?.payments.failed,
            },
            {
              label: "Revenue (paid)",
              icon: Wallet,
              value: data
                ? formatMoney(data.revenue.total, PAYMENT_CURRENCY)
                : undefined,
            },
          ]}
        />
      </div>

      <section aria-labelledby="trends-heading" className="mt-10">
        <h2 id="trends-heading" className="mb-4 text-xl font-bold">
          Trends
        </h2>
        <AdminCharts period={DEFAULT_PERIOD} show={["shipments", "status"]} />
      </section>
    </>
  );
}
