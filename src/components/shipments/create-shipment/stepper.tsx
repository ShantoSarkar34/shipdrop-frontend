import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STEP_LABELS = [
  "Sender",
  "Receiver",
  "Parcel",
  "Service",
  "Review",
] as const;

export function Stepper({ current }: { current: number }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center gap-2">
        {STEP_LABELS.map((label, index) => {
          const done = index < current;
          const active = index === current;
          const last = index === STEP_LABELS.length - 1;
          return (
            <li
              key={label}
              aria-current={active ? "step" : undefined}
              className={cn("flex items-center gap-2", !last && "flex-1")}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  !active && "hidden text-muted-foreground sm:inline",
                )}
              >
                {label}
                <span className="sr-only">
                  {done ? " (completed)" : active ? " (current step)" : ""}
                </span>
              </span>
              {!last ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px flex-1",
                    done ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
