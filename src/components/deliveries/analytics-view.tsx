"use client";

import {
  Activity,
  CheckCircle2,
  ClipboardList,
  TriangleAlert,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { ChartCard } from "@/components/charts/chart-card";
import { LazyBarChart } from "@/components/charts/lazy-bar-chart";
import { FormError } from "@/components/forms/form-error";
import { NativeSelect } from "@/components/forms/native-select";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PERIOD, PERIODS } from "@/config/periods";
import { useAgentAnalytics } from "@/hooks/use-deliveries";
import { getErrorMessage } from "@/lib/api/errors";
import { formatShortDate } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/parcel-status";

export function AnalyticsView() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const analytics = useAgentAnalytics(period);
  const periodLabel =
    PERIODS.find((item) => item.value === period)?.label ?? period;
  const data = analytics.data;

  const byStatus = (data?.deliveriesByStatus ?? []).map((entry) => ({
    label: STATUS_LABEL[entry.status] ?? entry.status,
    value: entry.count,
  }));
  const trend = (data?.deliveryTrend ?? []).map((point) => ({
    label: formatShortDate(point.date),
    value: point.count,
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

      {analytics.isError ? (
        <div className="mb-6 space-y-3">
          <FormError>{getErrorMessage(analytics.error)}</FormError>
          <Button
            variant="outline"
            size="sm"
            onClick={() => analytics.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : null}

      <section
        aria-label="Delivery summary"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Total assigned (all time)"
          icon={ClipboardList}
          value={data?.totalAssigned}
          loading={analytics.isPending}
        />
        <StatCard
          label="Completed"
          icon={CheckCircle2}
          value={data?.totalCompleted}
          loading={analytics.isPending}
        />
        <StatCard
          label="Failed"
          icon={TriangleAlert}
          value={data?.totalFailed}
          loading={analytics.isPending}
        />
        <StatCard
          label="Returned"
          icon={Undo2}
          value={data?.totalReturned}
          loading={analytics.isPending}
        />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {analytics.isPending ? (
          <>
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </>
        ) : byStatus.length === 0 &&
          trend.length === 0 &&
          !analytics.isError ? (
          <div className="lg:col-span-2">
            <EmptyState
              icon={Activity}
              title="No delivery activity yet"
              description="Charts appear once you have deliveries in this period."
            />
          </div>
        ) : (
          <>
            {byStatus.length > 0 ? (
              <ChartCard title="Deliveries by status" description={periodLabel}>
                <LazyBarChart
                  data={byStatus}
                  orientation="rows"
                  valueLabel="Deliveries"
                  summary={`Bar chart of deliveries by status, ${periodLabel.toLowerCase()}`}
                />
              </ChartCard>
            ) : null}
            {trend.length > 0 ? (
              <ChartCard title="Deliveries over time" description={periodLabel}>
                <LazyBarChart
                  data={trend}
                  valueLabel="Deliveries"
                  summary={`Bar chart of deliveries per day, ${periodLabel.toLowerCase()}`}
                />
              </ChartCard>
            ) : null}
          </>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Total assigned counts all time. The other numbers and charts follow the
        selected period.
      </p>
    </>
  );
}
