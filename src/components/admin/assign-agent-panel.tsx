"use client";

import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AGENT_PICKER_LIMIT,
  useAssignableAgents,
  useAssignDelivery,
} from "@/hooks/use-admin";
import type { AdminUser } from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import type { AgentAvailability } from "@/types/user";

const AVAILABILITY_LABEL: Record<AgentAvailability, string> = {
  AVAILABLE: "Available",
  OFFLINE: "Offline",
  ON_DELIVERY: "On delivery",
};

// If the availability isn't reported, don't block: the backend enforces it and explains any refusal.
const isAssignable = (agent: AdminUser) => {
  const availability = agent.deliveryAgent?.availability;
  return availability === undefined || availability === "AVAILABLE";
};

export function AssignAgentPanel({ parcelId }: { parcelId: string }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const agentsQuery = useAssignableAgents(search);
  const assign = useAssignDelivery();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const agents = useMemo(
    () =>
      [...(agentsQuery.data?.data ?? [])].sort(
        (a, b) => Number(isAssignable(b)) - Number(isAssignable(a)),
      ),
    [agentsQuery.data],
  );
  // If the chosen agent stops being assignable after a refresh, the choice is dropped automatically.
  const selected = agents.find(
    (agent) => agent.id === selectedId && isAssignable(agent),
  );
  const total = agentsQuery.data?.meta?.total ?? agents.length;

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSearch(value.trim()), 300);
  };

  let list;
  if (agentsQuery.isPending) {
    list = <Skeleton className="h-32 w-full" />;
  } else if (agentsQuery.isError && !agentsQuery.data) {
    list = (
      <div className="space-y-3">
        <FormError>{getErrorMessage(agentsQuery.error)}</FormError>
        <Button
          variant="outline"
          size="sm"
          onClick={() => agentsQuery.refetch()}
        >
          Try again
        </Button>
      </div>
    );
  } else if (agents.length === 0) {
    list = (
      <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        {search
          ? "No agents match your search."
          : "There are no active delivery agents yet."}
      </p>
    );
  } else {
    list = (
      <fieldset className="space-y-2">
        <legend className="sr-only">Delivery agents</legend>
        {agents.map((agent) => {
          const assignable = isAssignable(agent);
          const availability = agent.deliveryAgent?.availability;
          return (
            <label
              key={agent.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border border-input p-3 transition-colors has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-2 has-focus-visible:ring-ring",
                !assignable && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                type="radio"
                name="agent"
                value={agent.id}
                disabled={!assignable}
                checked={selected?.id === agent.id}
                onChange={() => setSelectedId(agent.id)}
                className="mt-1 accent-primary"
              />
              <span className="min-w-0 flex-1 text-sm">
                <span className="block font-medium">{agent.name}</span>
                <span className="block break-all text-muted-foreground">
                  {agent.email}
                </span>
                {agent.deliveryAgent?.vehicleType ? (
                  <span className="block text-xs text-muted-foreground">
                    {agent.deliveryAgent.vehicleType}
                  </span>
                ) : null}
              </span>
              {availability ? (
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs">
                  {AVAILABILITY_LABEL[availability]}
                </span>
              ) : null}
            </label>
          );
        })}
      </fieldset>
    );
  }

  return (
    <section
      aria-labelledby="assign-heading"
      className="rounded-xl border border-border bg-card p-6"
    >
      <h2 id="assign-heading" className="text-lg font-bold">
        Assign a delivery agent
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Only active agents who are set to Available can be assigned.
      </p>

      <div className="relative mt-4">
        <label htmlFor="agent-search" className="sr-only">
          Search agents
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="agent-search"
          type="search"
          placeholder="Search agents by name or email"
          className="pl-9"
          onChange={onSearchChange}
        />
      </div>

      <div className="mt-4">{list}</div>
      {total > AGENT_PICKER_LIMIT ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Showing the first {AGENT_PICKER_LIMIT} of {total} agents. Use search
          to find others.
        </p>
      ) : null}

      <Button
        className="mt-5 w-full"
        disabled={!selected || assign.isPending}
        onClick={() =>
          selected && assign.mutate({ parcelId, agentId: selected.id })
        }
      >
        {assign.isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : null}
        {assign.isPending ? "Assigning…" : "Assign agent"}
      </Button>
    </section>
  );
}
