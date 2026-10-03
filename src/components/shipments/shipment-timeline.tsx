import { Check, CircleAlert } from "lucide-react";
import { STATUS_META } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/format";
import type { TimelineState, TimelineStep } from "@/lib/parcel-status";
import { cn } from "@/lib/utils";

const STATE_TEXT: Record<TimelineState, string> = {
  completed: "Completed",
  current: "Current step",
  upcoming: "Upcoming",
  failed: "Failed",
  terminal: "Final status",
};

function Marker({ step }: { step: TimelineStep }) {
  const base =
    "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2";

  if (step.state === "completed") {
    return (
      <span
        aria-hidden="true"
        className={cn(
          base,
          "border-primary bg-primary text-primary-foreground",
        )}
      >
        <Check className="size-4" />
      </span>
    );
  }
  if (step.state === "current") {
    return (
      <span aria-hidden="true" className={cn(base, "border-primary bg-card")}>
        <span className="absolute size-3 animate-ping rounded-full bg-primary/40" />
        <span className="relative size-2.5 rounded-full bg-primary" />
      </span>
    );
  }
  if (step.state === "failed") {
    return (
      <span
        aria-hidden="true"
        className={cn(base, "border-transparent bg-danger-soft text-danger-fg")}
      >
        <CircleAlert className="size-4" />
      </span>
    );
  }
  if (step.state === "terminal") {
    const Icon = STATUS_META[step.status]?.icon ?? Check;
    const delivered = step.status === "DELIVERED";
    return (
      <span
        aria-hidden="true"
        className={cn(
          base,
          "border-transparent",
          delivered
            ? "bg-success-soft text-success-fg"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-4" />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={cn(base, "border-border bg-card")} />
  );
}

export function ShipmentTimeline({
  steps,
}: {
  steps: readonly TimelineStep[];
}) {
  return (
    <ol aria-label="Shipment status timeline">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <li
            key={`${step.status}-${index}`}
            className={cn("relative flex gap-4", !last && "pb-8")}
          >
            {!last ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-8 bottom-0 left-4 w-px -translate-x-1/2",
                  step.state === "completed" ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
            <Marker step={step} />
            <div className="min-w-0 pt-1">
              <p
                className={cn(
                  "font-medium",
                  step.state === "upcoming" && "text-muted-foreground",
                )}
              >
                {step.label}
                <span className="sr-only"> — {STATE_TEXT[step.state]}</span>
              </p>
              {step.at ? (
                <time
                  dateTime={step.at}
                  className="text-xs text-muted-foreground"
                >
                  {formatDateTime(step.at)}
                </time>
              ) : null}
              {step.note ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.note}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
