"use client";

import { Activity } from "lucide-react";
import type { ReactNode } from "react";
import { ChartCard } from "@/components/charts/chart-card";
import { LazyBarChart } from "@/components/charts/lazy-bar-chart";
import {
  LazyAreaChart,
  LazyComposedChart,
  LazyDonutChart,
  LazyRadarChart,
} from "@/components/charts/lazy-charts";
import { FormError } from "@/components/forms/form-error";
import { EmptyState } from "@/components/shared/empty-state";
import { periodLabel } from "@/components/shared/period-control";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { useAdminAnalytics } from "@/hooks/use-admin";
import { getErrorMessage } from "@/lib/api/errors";
import { mergeDailySeries, pipelineProfile } from "@/lib/chart-data";
import { formatMoney, formatShortDate } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/parcel-status";
import { cn } from "@/lib/utils";

export type AdminChartKey =
  | "overview"
  | "status"
  | "pipeline"
  | "shipments"
  | "revenue";

const money = (value: number) => formatMoney(value, PAYMENT_CURRENCY);
const NoData = () => (
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
  const label = periodLabel(period).toLowerCase();

  if (analytics.isPending) {
    return (
      <div
        className="grid gap-6 lg:grid-cols-2"
        aria-busy="true"
        aria-label="Loading charts"
      >
        {show.map((key) => (
          <Skeleton
            key={key}
            className={cn(
              "h-96 rounded-xl",
              key === "overview" && "lg:col-span-2",
            )}
          />
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
  const combo = mergeDailySeries(data.shipmentTrend, data.revenueTrend).map(
    (point) => ({
      label: formatShortDate(point.date),
      bars: point.count,
      line: point.amount,
    }),
  );
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
  const pipeline = pipelineProfile(data.statusDistribution);

  if (combo.length === 0 && status.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activity in this period"
        description="Charts appear once shipments or payments exist for the selected period."
      />
    );
  }

  const charts: Record<AdminChartKey, ReactNode> = {
    overview: (
      <ChartCard
        title="Shipments and revenue"
        description={`Per day, ${label}`}
      >
        {combo.length === 0 ? (
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
    ),
    status: (
      <ChartCard title="Shipments by status" description={periodLabel(period)}>
        {status.length === 0 ? (
          <NoData />
        ) : (
          <LazyDonutChart
            data={status}
            centerLabel="shipments"
            summary={`Donut chart of shipments by status, ${label}`}
          />
        )}
      </ChartCard>
    ),
    pipeline: (
      <ChartCard
        title="Pipeline profile"
        description="Where shipments sit across the delivery journey."
      >
        <LazyRadarChart
          data={pipeline}
          valueLabel="Shipments"
          colorIndex={1}
          summary={`Radar chart of shipments across the delivery pipeline, ${label}`}
        />
      </ChartCard>
    ),
    shipments: (
      <ChartCard title="Shipments created" description={periodLabel(period)}>
        {shipments.length === 0 ? (
          <NoData />
        ) : (
          <LazyBarChart
            data={shipments}
            valueLabel="Shipments"
            summary={`Bar chart of shipments created per day, ${label}`}
          />
        )}
      </ChartCard>
    ),
    revenue: (
      <ChartCard title="Revenue" description={`Paid payments only, ${label}`}>
        {revenue.length === 0 ? (
          <NoData />
        ) : (
          <LazyAreaChart
            data={revenue}
            valueLabel="Revenue"
            colorIndex={2}
            formatValue={money}
            summary={`Area chart of revenue per day, ${label}`}
          />
        )}
      </ChartCard>
    ),
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {show.map((key) => (
        <div key={key} className={cn(key === "overview" && "lg:col-span-2")}>
          {charts[key]}
        </div>
      ))}
    </div>
  );
}
