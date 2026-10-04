"use client";

import { CheckCircle2, Package, Percent, Wallet } from "lucide-react";
import { useState } from "react";
import { ChartCard } from "@/components/charts/chart-card";
import { LazyBarChart } from "@/components/charts/lazy-bar-chart";
import { FormError } from "@/components/forms/form-error";
import { NativeSelect } from "@/components/forms/native-select";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { DEFAULT_PERIOD, PERIODS } from "@/config/periods";
import { useEarnings } from "@/hooks/use-deliveries";
import { getErrorMessage } from "@/lib/api/errors";
import { formatMoney, formatPercent, formatShortDate } from "@/lib/format";

export function EarningsView() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const earnings = useEarnings(period);
  const periodLabel =
    PERIODS.find((item) => item.value === period)?.label ?? period;
  const data = earnings.data;

  const trend = (data?.earningsTrend ?? []).map((point) => ({
    label: formatShortDate(point.date),
    value: point.amount,
  }));

  return (
    <>
      {PERIODS.length > 1 ? (
        <div className="mb-6 max-w-xs">
          <NativeSelect
            label="Period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            {PERIODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </NativeSelect>
        </div>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          Showing: {periodLabel}
        </p>
      )}

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

      <section
        aria-label="Earnings summary"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Total earnings"
          icon={Wallet}
          value={
            data ? formatMoney(data.totalEarnings, PAYMENT_CURRENCY) : undefined
          }
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
      </section>

      <p className="mt-4 text-sm text-muted-foreground">
        Only delivered shipments that have been paid count toward your earnings.
        You earn {data ? formatPercent(data.commissionRate) : "a share"} of each
        delivery charge.
      </p>

      <div className="mt-8">
        {earnings.isPending ? (
          <Skeleton className="h-96 w-full rounded-xl" />
        ) : trend.length === 0 && !earnings.isError ? (
          <EmptyState
            icon={Wallet}
            title="No earnings in this period"
            description="Earnings appear here once a delivery you completed has been paid."
          />
        ) : trend.length > 0 ? (
          <ChartCard title="Earnings over time" description={periodLabel}>
            <LazyBarChart
              data={trend}
              valueLabel="Earnings"
              summary={`Bar chart of daily earnings, ${periodLabel.toLowerCase()}`}
              formatValue={(value) => formatMoney(value, PAYMENT_CURRENCY)}
            />
          </ChartCard>
        ) : null}
      </div>
    </>
  );
}
