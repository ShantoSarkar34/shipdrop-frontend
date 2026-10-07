"use client";

import { ChevronRight, CircleCheck } from "lucide-react";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminStats } from "@/lib/api/admin";

interface Item {
  label: string;
  hint: string;
  count: number;
  href?: string;
}

export function AttentionPanel({
  stats,
  loading,
}: {
  stats?: AdminStats;
  loading: boolean;
}) {
  const items: Item[] = stats
    ? [
        {
          label: "Pending shipments",
          hint: "Waiting to be confirmed",
          count: stats.parcels.pending,
          href: "/admin/shipments?status=PENDING",
        },
        {
          label: "Confirmed, no agent yet",
          hint: "Ready to be assigned",
          count: stats.parcels.confirmed,
          href: "/admin/shipments?status=CONFIRMED",
        },
        {
          label: "Failed deliveries",
          hint: "Need a retry or a return",
          count: stats.parcels.failedDelivery,
          href: "/admin/shipments?status=FAILED_DELIVERY",
        },
        {
          label: "Suspended accounts",
          hint: "Review or reactivate",
          count: stats.users.suspended,
          href: "/admin/users?status=SUSPENDED",
        },
        {
          label: "Payments awaiting confirmation",
          hint: "Waiting for Stripe's confirmation",
          count: stats.payments.pending,
        },
      ]
    : [];
  const open = items.filter((item) => item.count > 0);

  return (
    <section
      aria-labelledby="attention-heading"
      className="rounded-xl border border-border bg-card p-6"
    >
      <h2 id="attention-heading" className="text-lg font-bold">
        Needs attention
      </h2>
      <div className="mt-4">
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : open.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg bg-success-soft p-4 text-success-fg">
            <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium">
              All clear. Nothing needs your attention right now.
            </p>
          </div>
        ) : (
          <RevealGroup stagger={0.06} className="space-y-2">
            {open.map((item) => {
              const body = (
                <>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary tabular-nums">
                    {item.count}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {item.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {item.hint}
                    </span>
                  </span>
                  {item.href ? (
                    <ChevronRight
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  ) : null}
                </>
              );
              return (
                <RevealItem key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      {body}
                    </div>
                  )}
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
