"use client";

import type { LucideIcon } from "lucide-react";
import { RevealItem } from "@/components/marketing/reveal";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
  label,
  value,
  format,
  icon: Icon,
  loading,
  hint,
}: {
  label: string;
  value?: number | string;
  format?: (value: number) => string;
  icon: LucideIcon;
  loading?: boolean;
  hint?: string;
}) {
  return (
    <RevealItem className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-9 w-20" />
      ) : (
        <p className="mt-2 text-3xl font-extrabold tabular-nums">
          {typeof value === "number" ? (
            <AnimatedNumber value={value} format={format} />
          ) : (
            (value ?? "—")
          )}
        </p>
      )}
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </RevealItem>
  );
}
