"use client";

import { CreditCard, Package, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { AdminKpiCard } from "@/components/admin/admin-kpi-card";
import { AttentionPanel } from "@/components/admin/attention-panel";
import { RecentActivity } from "@/components/admin/recent-activity";
import { ChartCard } from "@/components/charts/chart-card";
import {
  LazyComposedChart,
  LazyDonutChart,
  LazyRadarChart,
} from "@/components/charts/lazy-charts";
import { FormError } from "@/components/forms/form-error";
import { PageHeading } from "@/components/layout/page-heading";
import { RevealGroup } from "@/components/marketing/reveal";
import { periodLabel } from "@/components/shared/period-control";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { DEFAULT_PERIOD } from "@/config/periods";
import { useAdminAnalytics, useAdminStats } from "@/hooks/use-admin";
import { getErrorMessage } from "@/lib/api/errors";
import { mergeDailySeries, platformHealth } from "@/lib/chart-data";
import { formatMoney, formatShortDate } from "@/lib/format";

const money = (value: number) => formatMoney(value, PAYMENT_CURRENCY);
const Loading = () => <Skeleton className="h-64 w-full" />;
const NoData = () => (
  <p className="py-20 text-center text-sm text-muted-foreground">
    No data yet.
  </p>
);

export function AdminDashboard() {
  const stats = useAdminStats();
  const analytics = useAdminAnalytics(DEFAULT_PERIOD);
  const s = stats.data;
  const a = analytics.data;
  const label = periodLabel(DEFAULT_PERIOD).toLowerCase();

  const combo = a
    ? mergeDailySeries(a.shipmentTrend, a.revenueTrend).map((point) => ({
        label: formatShortDate(point.date),
        bars: point.count,
        line: point.amount,
      }))
    : [];

  const statusSlices = s
    ? [
        {
          label: "Awaiting assignment",
          value: s.parcels.pending + s.parcels.confirmed,
        },
        {
          label: "In progress",
          value:
            s.parcels.assigned +
            s.parcels.pickedUp +
            s.parcels.inTransit +
            s.parcels.outForDelivery,
        },
        { label: "Delivered", value: s.parcels.delivered },
        {
          label: "Failed or returned",
          value: s.parcels.failedDelivery + s.parcels.returned,
        },
        { label: "Cancelled", value: s.parcels.cancelled },
      ].filter((slice) => slice.value > 0)
    : [];
  const userSlices = s
    ? [
        { label: "Customers", value: s.users.customers },
        { label: "Delivery agents", value: s.users.deliveryAgents },
        { label: "Administrators", value: s.users.admins },
      ].filter((slice) => slice.value > 0)
    : [];
  const paymentSlices = s
    ? [
        { label: "Paid", value: s.payments.paid },
        { label: "Pending", value: s.payments.pending },
        { label: "Failed", value: s.payments.failed },
      ].filter((slice) => slice.value > 0)
    : [];
  const health = s ? platformHealth(s) : [];

  return (
    <>
      <PageHeading
        title="Dashboard"
        description="A live overview of users, shipments, payments and activity."
        actions={
          <>
            <Link
              href="/admin/shipments"
              className={buttonVariants({ variant: "outline" })}
            >
              Shipments
            </Link>
            <Link href="/admin/analytics" className={buttonVariants()}>
              Full analytics
            </Link>
          </>
        }
      />

      {stats.isError || analytics.isError ? (
        <div className="mb-6 space-y-3">
          <FormError>
            {getErrorMessage(stats.error ?? analytics.error)}
          </FormError>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void stats.refetch();
              void analytics.refetch();
            }}
          >
            Try again
          </Button>
        </div>
      ) : null}

      <RevealGroup
        stagger={0.08}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <AdminKpiCard
          label="Revenue (paid)"
          icon={Wallet}
          value={s?.revenue.total}
          format={money}
          hint={`Trend, ${label}`}
          spark={a?.revenueTrend.map((point) => point.amount)}
          sparkColor={2}
          loading={stats.isPending}
        />
        <AdminKpiCard
          label="Shipments"
          icon={Package}
          value={s?.parcels.total}
          hint={s ? `${s.parcels.delivered} delivered` : undefined}
          spark={a?.shipmentTrend.map((point) => point.count)}
          loading={stats.isPending}
        />
        <AdminKpiCard
          label="Users"
          icon={Users}
          value={s?.users.total}
          hint={
            s
              ? `${s.users.active} active · ${s.users.suspended} suspended`
              : undefined
          }
          loading={stats.isPending}
        />
        <AdminKpiCard
          label="Payments"
          icon={CreditCard}
          value={s?.payments.total}
          hint={
            s
              ? `${s.payments.paid} paid · ${s.payments.pending} pending · ${s.payments.failed} failed`
              : undefined
          }
          loading={stats.isPending}
        />
      </RevealGroup>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ChartCard
          title="Shipments and revenue"
          description={`Per day, ${periodLabel(DEFAULT_PERIOD)}`}
        >
          {analytics.isPending ? (
            <Loading />
          ) : combo.length === 0 ? (
            <NoData />
          ) : (
            <LazyComposedChart
              data={combo}
              barLabel="Shipments"
              lineLabel="Revenue"
              summary={`Chart of shipments created and revenue per day, ${label}`}
              formatLine={money}
            />
          )}
        </ChartCard>
        <ChartCard title="Shipments by status" description="All time">
          {stats.isPending ? (
            <Loading />
          ) : statusSlices.length === 0 ? (
            <NoData />
          ) : (
            <LazyDonutChart
              data={statusSlices}
              centerLabel="shipments"
              summary="Donut chart of all shipments by status"
            />
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Platform health"
          description="Five measures, 0 to 100, from live counts."
        >
          {stats.isPending ? (
            <Loading />
          ) : (
            <LazyRadarChart
              data={health}
              max={100}
              valueLabel="Score"
              formatValue={(value) => `${value}%`}
              summary="Radar chart of platform health: delivered, progressing, payments settled, active accounts and clean shipments"
            />
          )}
        </ChartCard>
        <ChartCard
          title="Users by role"
          description="Everyone with an account."
        >
          {stats.isPending ? (
            <Loading />
          ) : userSlices.length === 0 ? (
            <NoData />
          ) : (
            <LazyDonutChart
              data={userSlices}
              centerLabel="users"
              summary="Donut chart of users by role"
            />
          )}
        </ChartCard>
        <ChartCard title="Payments" description="By status, all time.">
          {stats.isPending ? (
            <Loading />
          ) : paymentSlices.length === 0 ? (
            <NoData />
          ) : (
            <LazyDonutChart
              data={paymentSlices}
              centerLabel="payments"
              summary="Donut chart of payments by status"
            />
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AttentionPanel stats={s} loading={stats.isPending} />
        <RecentActivity />
      </div>
    </>
  );
}
