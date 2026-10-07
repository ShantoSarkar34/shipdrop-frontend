"use client";

import type { LucideIcon } from "lucide-react";
import { LazySparkline } from "@/components/charts/lazy-charts";
import { RevealItem } from "@/components/marketing/reveal";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminKpiCard({
  label,
  icon: Icon,
  value,
  format,
  hint,
  spark,
  sparkColor = 0,
  loading,
}: {
  label: string;
  icon: LucideIcon;
  value?: number;
  format?: (value: number) => string;
  hint?: string;
  spark?: readonly number[];
  sparkColor?: number;
  loading?: boolean;
}) {
  return (
    <RevealItem className="overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-3 h-9 w-24" />
          ) : (
            <p className="mt-2 truncate text-3xl font-extrabold tabular-nums">
              {value === undefined ? (
                "—"
              ) : (
                <AnimatedNumber value={value} format={format} />
              )}
            </p>
          )}
          {hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      {spark && spark.length > 1 ? (
        <div className="mt-4">
          <LazySparkline values={spark} colorIndex={sparkColor} />
        </div>
      ) : null}
    </RevealItem>
  );
}
