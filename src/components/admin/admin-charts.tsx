"use client";

import type { ReactNode } from "react";
import { ChartCard } from "@/components/charts/chart-card";
import { LazyBarChart } from "@/components/charts/lazy-bar-chart";
import { FormError } from "@/components/forms/form-error";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { PERIODS } from "@/config/periods";
import { useAdminAnalytics } from "@/hooks/use-admin";
import { getErrorMessage } from "@/lib/api/errors";
import { formatMoney, formatShortDate } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/parcel-status";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export type AdminChartKey = "shipments" | "status" | "revenue";

const NO_DATA = (
  <p className="py-20 text-center text-sm text-muted-foreground">
    No data in this period.
  </p>
);

export function AdminCharts({
  period,
  show,
}: {
  period: string;
  show: readonly AdminChartKey[];
}) {
  const analytics = useAdminAnalytics(period);
  const periodLabel =
    PERIODS.find((item) => item.value === period)?.label ?? period;

  if (analytics.isPending) {
    return (
      <div
        className="grid gap-6 lg:grid-cols-2"
        aria-busy="true"
        aria-label="Loading charts"
      >
        {show.map((key) => (
          <Skeleton key={key} className="h-96 rounded-xl" />
        ))}
      </div>
    );
  }

  if (analytics.isError) {
    return (
      <div className="space-y-3">
        <FormError>{getErrorMessage(analytics.error)}</FormError>
        <Button variant="outline" size="sm" onClick={() => analytics.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const data = analytics.data;
  const shipments = data.shipmentTrend.map((point) => ({
    label: formatShortDate(point.date),
    value: point.count,
  }));
  const revenue = data.revenueTrend.map((point) => ({
    label: formatShortDate(point.date),
    value: point.amount,
  }));
  const status = data.statusDistribution.map((entry) => ({
    label: STATUS_LABEL[entry.status] ?? entry.status,
    value: entry.count,
  }));

  if (shipments.length === 0 && revenue.length === 0 && status.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activity in this period"
        description="Charts appear once shipments or payments exist for the selected period."
      />
    );
  }

  const charts: Record<AdminChartKey, ReactNode> = {
    shipments: (
      <ChartCard
        title="Shipments over time"
        description={`By creation date, ${periodLabel.toLowerCase()}`}
      >
        {shipments.length === 0 ? (
          NO_DATA
        ) : (
          <LazyBarChart
            data={shipments}
            valueLabel="Shipments"
            summary={`Bar chart of shipments created per day, ${periodLabel.toLowerCase()}`}
          />
        )}
      </ChartCard>
    ),
    status: (
      <ChartCard title="Shipments by status" description={periodLabel}>
        {status.length === 0 ? (
          NO_DATA
        ) : (
          <LazyBarChart
            data={status}
            orientation="rows"
            valueLabel="Shipments"
            summary={`Bar chart of shipments by status, ${periodLabel.toLowerCase()}`}
          />
        )}
      </ChartCard>
    ),
    revenue: (
      <ChartCard
        title="Revenue over time"
        description={`Paid payments only, ${periodLabel.toLowerCase()}`}
      >
        {revenue.length === 0 ? (
          NO_DATA
        ) : (
          <LazyBarChart
            data={revenue}
            valueLabel="Revenue"
            summary={`Bar chart of revenue per day, ${periodLabel.toLowerCase()}`}
            formatValue={(value) => formatMoney(value, PAYMENT_CURRENCY)}
          />
        )}
      </ChartCard>
    ),
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {show.map((key) => (
        <div
          key={key}
          className={cn(
            key === "revenue" && show.length === 3 && "lg:col-span-2",
          )}
        >
          {charts[key]}
        </div>
      ))}
    </div>
  );
}
