import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TONE = {
  success: "bg-success-soft text-success-fg",
  pending: "bg-info-soft text-info-fg",
  danger: "bg-danger-soft text-danger-fg",
  neutral: "bg-muted text-muted-foreground",
} as const;

export function ResultCard({
  icon: Icon,
  tone,
  title,
  children,
  actions,
  iconClassName,
}: {
  icon: LucideIcon;
  tone: keyof typeof TONE;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  iconClassName?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-border bg-card p-8 text-center"
    >
      <span
        className={cn(
          "mx-auto flex size-14 items-center justify-center rounded-full",
          TONE[tone],
        )}
      >
        <Icon className={cn("size-7", iconClassName)} aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight">{title}</h1>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      {actions ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export function ResultCardSkeleton() {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-8"
      aria-busy="true"
      aria-label="Loading"
    >
      <Skeleton className="mx-auto size-14 rounded-full" />
      <Skeleton className="mx-auto mt-5 h-8 w-56" />
      <Skeleton className="mx-auto mt-3 h-4 w-72 max-w-full" />
    </div>
  );
}
