import type { LucideIcon } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

export interface FlowStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const COLUMNS: Record<number, string> = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

export function ProcessFlow({
  steps,
  label,
  orientation = "responsive",
}: {
  steps: readonly FlowStep[];
  label: string;
  /** "responsive" is horizontal from md up and vertical below. "vertical" is always vertical. */
  orientation?: "responsive" | "vertical";
}) {
  const horizontal = orientation === "responsive";

  return (
    <RevealGroup stagger={0.12}>
      <ol
        aria-label={label}
        className={cn(
          "grid gap-8",
          horizontal && cn("md:gap-6", COLUMNS[steps.length]),
        )}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const last = index === steps.length - 1;
          return (
            <li key={step.title}>
              <RevealItem
                className={cn("relative flex gap-4", horizontal && "md:block")}
              >
                {!last ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-10 -bottom-8 left-5 w-px bg-border",
                      horizontal &&
                        "md:top-5 md:bottom-auto md:left-10 md:h-px md:w-[calc(100%-1rem)]",
                    )}
                  />
                ) : null}
                <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className={cn(horizontal && "md:mt-4 md:pr-2")}>
                  <p className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </RevealItem>
            </li>
          );
        })}
      </ol>
    </RevealGroup>
  );
}
