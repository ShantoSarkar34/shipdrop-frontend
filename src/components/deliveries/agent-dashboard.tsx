"use client";

import {
  CheckCircle2,
  ClipboardList,
  Package,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { ChartCard } from "@/components/charts/chart-card";
import { LazyAreaChart } from "@/components/charts/lazy-charts";
import { ProgressRing } from "@/components/charts/progress-ring";
import { AvailabilityCard } from "@/components/deliveries/availability-card";
import { DeliveryCard } from "@/components/deliveries/delivery-card";
import { FormError } from "@/components/forms/form-error";
import { PageHeading } from "@/components/layout/page-heading";
import { RevealGroup } from "@/components/marketing/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { DEFAULT_PERIOD } from "@/config/periods";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  useAgentAnalytics,
  useDeliveries,
  useEarnings,
} from "@/hooks/use-deliveries";
import { completionRate } from "@/lib/chart-data";
import { formatMoney, formatShortDate } from "@/lib/format";
import { periodLabel } from "@/components/shared/period-control";

const money = (value: number) => formatMoney(value, PAYMENT_CURRENCY);

export function AgentDashboard() {
  const { data: user } = useCurrentUser();
  const earnings = useEarnings(DEFAULT_PERIOD);
  const analytics = useAgentAnalytics(DEFAULT_PERIOD);
  const pending = useDeliveries({ status: "ASSIGNED", limit: 3 });
  const label = periodLabel(DEFAULT_PERIOD).toLowerCase();
  const firstName = user?.name.split(" ")[0];
  const data = earnings.data;
  const stats = analytics.data;

  const earningsSeries = (data?.earningsTrend ?? []).map((point) => ({
    label: formatShortDate(point.date),
    value: point.amount,
  }));
  const finished = stats
    ? stats.totalCompleted + stats.totalFailed + stats.totalReturned
    : 0;

  return (
    <>
      <PageHeading
        title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        description="Your deliveries at a glance."
        actions={
          <Link
            href="/provider/deliveries"
            className={buttonVariants({ variant: "outline" })}
          >
            All deliveries
          </Link>
        }
      />

      {earnings.isError ? (
        <div className="mb-6 space-y-3">
          <FormError>
            We couldn&apos;t load your numbers. Check your connection and try
            again.
          </FormError>
          <Button
            variant="outline"
            size="sm"
            onClick={() => earnings.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <AvailabilityCard />
        <RevealGroup stagger={0.08} className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="In progress"
            icon={Package}
            value={data?.pendingDeliveries}
            loading={earnings.isPending}
          />
          <StatCard
            label={`Completed (${label})`}
            icon={CheckCircle2}
            value={data?.completedDeliveries}
            loading={earnings.isPending}
          />
          <StatCard
            label={`Failed (${label})`}
            icon={TriangleAlert}
            value={data?.failedDeliveries}
            loading={earnings.isPending}
          />
          <StatCard
            label={`Earnings (${label})`}
            icon={Wallet}
            value={data?.totalEarnings}
            format={money}
            loading={earnings.isPending}
          />
        </RevealGroup>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <ChartCard title="Earnings" description={periodLabel(DEFAULT_PERIOD)}>
          {earnings.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : earningsSeries.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              Earnings appear once a delivery you completed has been paid.
            </p>
          ) : (
            <LazyAreaChart
              data={earningsSeries}
              valueLabel="Earnings"
              summary={`Area chart of daily earnings, ${label}`}
              formatValue={money}
            />
          )}
        </ChartCard>
        <ChartCard
          title="Completion rate"
          description="Completed deliveries out of all finished ones."
        >
          {analytics.isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : finished === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No finished deliveries yet.
            </p>
          ) : (
            <div className="flex min-h-56 items-center justify-center">
              <ProgressRing
                value={completionRate(
                  stats?.totalCompleted ?? 0,
                  stats?.totalFailed ?? 0,
                  stats?.totalReturned ?? 0,
                )}
                caption="of your finished deliveries were completed"
              />
            </div>
          )}
        </ChartCard>
      </div>

      <section aria-labelledby="pending-heading" className="mt-10">
        <h2 id="pending-heading" className="mb-4 text-xl font-bold">
          Awaiting your response
        </h2>
        {pending.isPending ? (
          <Skeleton className="h-56 w-full rounded-xl" />
        ) : pending.isError ? (
          <div className="space-y-3">
            <FormError>We couldn&apos;t load your assignments.</FormError>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pending.refetch()}
            >
              Try again
            </Button>
          </div>
        ) : pending.data.data.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No pending assignments"
            description="New assignments from an administrator will show up here. Make sure you're set to Available."
          />
        ) : (
          <div className="space-y-4">
            {pending.data.data.map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
