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
import {
  LazyAreaChart,
  LazyDonutChart,
  LazyRadarChart,
} from "@/components/charts/lazy-charts";
import { ProgressRing } from "@/components/charts/progress-ring";
import { FormError } from "@/components/forms/form-error";
import { RevealGroup } from "@/components/marketing/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { PeriodControl, periodLabel } from "@/components/shared/period-control";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PERIOD } from "@/config/periods";
import { useAgentAnalytics } from "@/hooks/use-deliveries";
import { getErrorMessage } from "@/lib/api/errors";
import { completionRate } from "@/lib/chart-data";
import { formatShortDate } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/parcel-status";

export function AnalyticsView() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const analytics = useAgentAnalytics(period);
  const data = analytics.data;
  const label = periodLabel(period).toLowerCase();

  const byStatus = (data?.deliveriesByStatus ?? []).map((entry) => ({
    label: STATUS_LABEL[entry.status] ?? entry.status,
    value: entry.count,
  }));
  const trend = (data?.deliveryTrend ?? []).map((point) => ({
    label: formatShortDate(point.date),
    value: point.count,
  }));
  const finished = data
    ? data.totalCompleted + data.totalFailed + data.totalReturned
    : 0;

  return (
    <>
      <PeriodControl value={period} onChange={setPeriod} />

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

      <RevealGroup
        stagger={0.08}
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
      </RevealGroup>

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
              <>
                <ChartCard
                  title="Deliveries by status"
                  description={periodLabel(period)}
                >
                  <LazyDonutChart
                    data={byStatus}
                    centerLabel="deliveries"
                    summary={`Donut chart of deliveries by status, ${label}`}
                  />
                </ChartCard>
                <ChartCard
                  title="Delivery profile"
                  description="The shape of your work across statuses."
                >
                  <LazyRadarChart
                    data={byStatus}
                    valueLabel="Deliveries"
                    summary={`Radar chart of deliveries by status, ${label}`}
                  />
                </ChartCard>
              </>
            ) : null}
            {trend.length > 0 ? (
              <ChartCard
                title="Deliveries over time"
                description={periodLabel(period)}
              >
                <LazyAreaChart
                  data={trend}
                  valueLabel="Deliveries"
                  summary={`Area chart of deliveries per day, ${label}`}
                  colorIndex={1}
                />
              </ChartCard>
            ) : null}
            <ChartCard
              title="Completion rate"
              description="Completed deliveries out of all finished ones."
            >
              {finished === 0 ? (
                <p className="py-20 text-center text-sm text-muted-foreground">
                  No finished deliveries yet.
                </p>
              ) : (
                <div className="flex min-h-56 items-center justify-center">
                  <ProgressRing
                    value={completionRate(
                      data?.totalCompleted ?? 0,
                      data?.totalFailed ?? 0,
                      data?.totalReturned ?? 0,
                    )}
                    caption="of your finished deliveries were completed"
                  />
                </div>
              )}
            </ChartCard>
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
