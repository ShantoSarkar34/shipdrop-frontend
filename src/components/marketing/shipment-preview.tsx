import { Check, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

type StepState = "done" | "current" | "pending";

const STEPS: readonly { label: string; state: StepState }[] = [
  { label: "Created", state: "done" },
  { label: "Confirmed", state: "done" },
  { label: "Assigned", state: "done" },
  { label: "Picked up", state: "done" },
  { label: "In transit", state: "current" },
  { label: "Out for delivery", state: "pending" },
  { label: "Delivered", state: "pending" },
];

const STATE_TEXT: Record<StepState, string> = {
  done: "Completed",
  current: "Current step",
  pending: "Upcoming",
};

export function ShipmentPreview() {
  return (
    <figure
      aria-label="Illustration of a shipment tracking timeline"
      className="w-full max-w-md"
    >
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Tracking ID</p>
            <p className="font-mono text-sm font-medium">SD260902A1B2C3</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-info-soft px-2.5 py-1 text-xs font-medium text-info-fg">
            <Truck className="size-3.5" aria-hidden="true" />
            In transit
          </span>
        </div>
        <p className="mt-3 text-sm">
          Dhaka <span aria-hidden="true">→</span>
          <span className="sr-only">to</span> Bogra
          <span className="text-muted-foreground"> · Express · 2.5 kg</span>
        </p>

        <ol className="mt-5 border-t border-border pt-5">
          {STEPS.map((step, index) => {
            const isLast = index === STEPS.length - 1;
            return (
              <li
                key={step.label}
                className={cn(
                  "relative flex items-center gap-3",
                  !isLast && "pb-4",
                )}
              >
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-6 bottom-0 left-2.75 w-px",
                      step.state === "done" ? "bg-primary/50" : "bg-border",
                    )}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative flex size-6 shrink-0 items-center justify-center rounded-full",
                    step.state === "done" &&
                      "bg-primary text-primary-foreground",
                    step.state === "current" &&
                      "border-2 border-primary bg-card",
                    step.state === "pending" && "border border-input bg-card",
                  )}
                >
                  {step.state === "done" ? (
                    <Check className="size-3.5" />
                  ) : null}
                  {step.state === "current" ? (
                    <span className="size-2 rounded-full bg-primary" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    step.state === "pending"
                      ? "text-muted-foreground"
                      : "font-medium",
                  )}
                >
                  {step.label}
                  <span className="sr-only"> — {STATE_TEXT[step.state]}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="mt-3 text-xs text-muted-foreground">
        Illustration. Your dashboard shows live data.
      </figcaption>
    </figure>
  );
}
