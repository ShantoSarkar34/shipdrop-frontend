"use client";

import { Search, Truck } from "lucide-react";
import { useEffect, useRef, type ChangeEvent } from "react";
import { ChartCard } from "@/components/charts/chart-card";
import { LazyDonutChart } from "@/components/charts/lazy-charts";
import { FormError } from "@/components/forms/form-error";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsers } from "@/hooks/use-admin";
import { useUrlParams } from "@/hooks/use-url-params";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import type { AgentAvailability } from "@/types/user";

const PAGE_LIMIT = 12;

const AVAILABILITY: Record<
  AgentAvailability,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Available",
    className: "bg-success-soft text-success-fg",
  },
  OFFLINE: { label: "Offline", className: "bg-muted text-muted-foreground" },
  ON_DELIVERY: { label: "On delivery", className: "bg-info-soft text-info-fg" },
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export function AgentsRoster() {
  const { searchParams, update } = useUrlParams();
  const q = (searchParams.get("q") ?? "").trim();
  const parsed = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  const query = useAdminUsers({
    role: "DELIVERY_AGENT",
    page,
    limit: PAGE_LIMIT,
    q: q || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const searchRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const input = searchRef.current;
    if (input && document.activeElement !== input && input.value !== q)
      input.value = q;
  }, [q]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => update({ q: value.trim() || undefined }, { replace: true }),
      350,
    );
  };

  const agents = query.data?.data ?? [];
  const meta = query.data?.meta;

  const counts: Record<AgentAvailability, number> = {
    AVAILABLE: 0,
    OFFLINE: 0,
    ON_DELIVERY: 0,
  };
  for (const agent of agents) {
    const availability = agent.deliveryAgent?.availability;
    if (availability) counts[availability] += 1;
  }
  const slices = (Object.keys(counts) as AgentAvailability[])
    .map((key) => ({ label: AVAILABILITY[key].label, value: counts[key] }))
    .filter((slice) => slice.value > 0);

  let content;
  if (query.isPending) {
    content = <Skeleton className="h-96 w-full rounded-xl" />;
  } else if (query.isError && !query.data) {
    content = (
      <div className="space-y-3">
        <FormError>{getErrorMessage(query.error)}</FormError>
        <Button variant="outline" size="sm" onClick={() => query.refetch()}>
          Try again
        </Button>
      </div>
    );
  } else if (agents.length === 0) {
    content = (
      <EmptyState
        icon={Truck}
        title="No delivery agents found"
        description={
          q
            ? "No agents match your search."
            : "Delivery agents appear here once they register."
        }
        action={
          q ? (
            <Button onClick={() => update({ q: undefined })}>
              Clear search
            </Button>
          ) : undefined
        }
      />
    );
  } else {
    content = (
      <>
        {slices.length > 0 ? (
          <div className="mb-6 max-w-xl">
            <ChartCard
              title="Availability"
              description="For the agents shown on this page."
            >
              <LazyDonutChart
                data={slices}
                centerLabel="agents"
                summary="Donut chart of agent availability on this page"
              />
            </ChartCard>
          </div>
        ) : null}
        <RevealGroup
          stagger={0.06}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {agents.map((agent) => {
            const availability = agent.deliveryAgent?.availability;
            return (
              <RevealItem
                key={agent.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                  >
                    {initials(agent.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{agent.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {agent.email}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {availability ? (
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        AVAILABILITY[availability].className,
                      )}
                    >
                      {AVAILABILITY[availability].label}
                    </span>
                  ) : null}
                  {agent.status === "SUSPENDED" ? (
                    <span className="rounded-full bg-danger-soft px-2.5 py-1 text-xs font-medium text-danger-fg">
                      Suspended
                    </span>
                  ) : null}
                </div>
                {agent.deliveryAgent?.vehicleType ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Vehicle: {agent.deliveryAgent.vehicleType}
                  </p>
                ) : null}
              </RevealItem>
            );
          })}
        </RevealGroup>
        {meta ? (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit ?? PAGE_LIMIT}
            onPageChange={(next) =>
              update({
                page: next === 1 ? undefined : String(next),
                q: q || undefined,
              })
            }
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="relative mb-6 max-w-md">
        <label htmlFor="agent-roster-search" className="sr-only">
          Search agents
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="agent-roster-search"
          ref={searchRef}
          type="search"
          defaultValue={q}
          onChange={onSearchChange}
          placeholder="Search agents by name or email"
          className="pl-9"
        />
      </div>
      <p role="status" className="sr-only">
        {meta ? `${meta.total} agents found` : ""}
      </p>
      <div
        aria-busy={query.isFetching}
        className={cn(
          "transition-opacity",
          query.isPlaceholderData && "opacity-60",
        )}
      >
        {content}
      </div>
    </>
  );
}
