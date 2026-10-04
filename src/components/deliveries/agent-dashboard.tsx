"use client";

import {
  CheckCircle2,
  ClipboardList,
  Package,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { AvailabilityCard } from "@/components/deliveries/availability-card";
import { DeliveryCard } from "@/components/deliveries/delivery-card";
import { FormError } from "@/components/forms/form-error";
import { PageHeading } from "@/components/layout/page-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { DEFAULT_PERIOD, PERIODS } from "@/config/periods";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDeliveries, useEarnings } from "@/hooks/use-deliveries";
import { formatMoney } from "@/lib/format";

export function AgentDashboard() {
  const { data: user } = useCurrentUser();
  const earnings = useEarnings(DEFAULT_PERIOD);
  const pending = useDeliveries({ status: "ASSIGNED", limit: 3 });
  const periodLabel =
    PERIODS.find((period) => period.value === DEFAULT_PERIOD)?.label ??
    DEFAULT_PERIOD;
  const firstName = user?.name.split(" ")[0];
  const data = earnings.data;

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
        <section
          aria-label={`Performance, ${periodLabel.toLowerCase()}`}
          className="grid gap-4 sm:grid-cols-2"
        >
          <StatCard
            label="In progress"
            icon={Package}
            value={data?.pendingDeliveries}
            loading={earnings.isPending}
          />
          <StatCard
            label={`Completed (${periodLabel.toLowerCase()})`}
            icon={CheckCircle2}
            value={data?.completedDeliveries}
            loading={earnings.isPending}
          />
          <StatCard
            label={`Failed (${periodLabel.toLowerCase()})`}
            icon={TriangleAlert}
            value={data?.failedDeliveries}
            loading={earnings.isPending}
          />
          <StatCard
            label={`Earnings (${periodLabel.toLowerCase()})`}
            icon={Wallet}
            value={
              data
                ? formatMoney(data.totalEarnings, PAYMENT_CURRENCY)
                : undefined
            }
            loading={earnings.isPending}
          />
        </section>
      </div>

      <section aria-labelledby="pending-heading" className="mt-10">
        <h2 id="pending-heading" className="mb-4 text-xl font-bold">
          Awaiting your response
        </h2>
        {pending.isPending ? (
          <Skeleton className="h-56 w-full rounded-xl" />
        ) : pending.isError ? (
          <div className="space-y-3">
            <FormError>{"We couldn't load your assignments."}</FormError>
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
