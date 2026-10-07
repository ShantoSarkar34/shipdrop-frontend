"use client";

import { CheckCircle2, Package, Percent, Wallet } from "lucide-react";
import { useState } from "react";
import { ChartCard } from "@/components/charts/chart-card";
import {
  LazyAreaChart,
  LazyComposedChart,
} from "@/components/charts/lazy-charts";
import { FormError } from "@/components/forms/form-error";
import { RevealGroup } from "@/components/marketing/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { PeriodControl, periodLabel } from "@/components/shared/period-control";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { DEFAULT_PERIOD } from "@/config/periods";
import { useEarnings } from "@/hooks/use-deliveries";
import { getErrorMessage } from "@/lib/api/errors";
import { mergeDailySeries } from "@/lib/chart-data";
import { formatMoney, formatPercent, formatShortDate } from "@/lib/format";

const money = (value: number) => formatMoney(value, PAYMENT_CURRENCY);

export function EarningsView() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const earnings = useEarnings(period);
  const data = earnings.data;
  const label = periodLabel(period).toLowerCase();

  const combo = data
    ? mergeDailySeries(data.deliveryTrend, data.earningsTrend).map((point) => ({
        label: formatShortDate(point.date),
        bars: point.count,
        line: point.amount,
      }))
    : [];
  const earningsSeries = (data?.earningsTrend ?? []).map((point) => ({
    label: formatShortDate(point.date),
    value: point.amount,
  }));

  return (
    <>
      <PeriodControl value={period} onChange={setPeriod} />

      {earnings.isError ? (
        <div className="mb-6 space-y-3">
          <FormError>{getErrorMessage(earnings.error)}</FormError>
          <Button
            variant="outline"
            size="sm"
            onClick={() => earnings.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : null}

      <RevealGroup
        stagger={0.08}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Total earnings"
          icon={Wallet}
          value={data?.totalEarnings}
          format={money}
          loading={earnings.isPending}
        />
        <StatCard
          label="Completed deliveries"
          icon={CheckCircle2}
          value={data?.completedDeliveries}
          loading={earnings.isPending}
        />
        <StatCard
          label="In progress now"
          icon={Package}
          value={data?.pendingDeliveries}
          loading={earnings.isPending}
        />
        <StatCard
          label="Commission rate"
          icon={Percent}
          value={data ? formatPercent(data.commissionRate) : undefined}
          loading={earnings.isPending}
        />
      </RevealGroup>

      <p className="mt-4 text-sm text-muted-foreground">
        Only delivered shipments that have been paid count toward your earnings.
        You earn {data ? formatPercent(data.commissionRate) : "a share"} of each
        delivery charge.
      </p>

      <div className="mt-8 space-y-6">
        {earnings.isPending ? (
          <Skeleton className="h-96 w-full rounded-xl" />
        ) : combo.length === 0 && !earnings.isError ? (
          <EmptyState
            icon={Wallet}
            title="No earnings in this period"
            description="Earnings appear here once a delivery you completed has been paid."
          />
        ) : combo.length > 0 ? (
          <>
            <ChartCard
              title="Deliveries and earnings"
              description={`Per day, ${label}`}
            >
              <LazyComposedChart
                data={combo}
                barLabel="Deliveries"
                lineLabel="Earnings"
                summary={`Chart of daily deliveries and earnings, ${label}`}
                formatLine={money}
              />
            </ChartCard>
            <ChartCard title="Earnings trend" description={periodLabel(period)}>
              <LazyAreaChart
                data={earningsSeries}
                valueLabel="Earnings"
                summary={`Area chart of daily earnings, ${label}`}
                formatValue={money}
                colorIndex={1}
              />
            </ChartCard>
          </>
        ) : null}
      </div>
    </>
  );
}
