"use client";

import { Check, MapPin, Package, Truck } from "lucide-react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Created",
  "Confirmed",
  "Assigned",
  "Picked up",
  "In transit",
  "Out for delivery",
  "Delivered",
] as const;

const LAST = STEPS.length - 1;
const LOOP_START = 3;
const STATIC_ACTIVE = 4;

type StepState = "done" | "current" | "pending";

export function HeroShipmentCard() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(STATIC_ACTIVE);

  useEffect(() => {
    if (reduce) return;

    const id = window.setInterval(
      () => setTick((value) => (value >= LAST ? LOOP_START : value + 1)),
      2400,
    );

    return () => window.clearInterval(id);
  }, [reduce]);

  const active = reduce ? STATIC_ACTIVE : tick;
  const delivered = active === LAST;

  const stateOf = (index: number): StepState => {
    if (index < active || (index === active && delivered)) return "done";
    return index === active ? "current" : "pending";
  };

  return (
    <figure
      role="img"
      aria-label="Illustration of a shipment moving from pickup to delivery. Your dashboard shows live data."
      className="relative w-full max-w-md animate-sd-rise"
      style={{ animationDelay: "250ms" }}
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-[2rem] bg-primary/5 dark:bg-(--cream)/50 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-[1.5rem] border border-primary/40 dark:border-primary/20 bg-white/90 dark:bg-white/5 p-5 text-foreground shadow-xl shadow-black/5 backdrop-blur-xl sm:p-6">
        {/* Top accent */}

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Package className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Tracking ID
              </p>
              <p className="mt-0.5 font-mono text-sm font-semibold tracking-wide">
                SD260902A1B2C3
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={active}
              initial={{ opacity: 0, y: 5, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold",
                delivered
                  ? "bg-success-soft text-success-fg"
                  : "bg-accent text-accent-foreground",
              )}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {STEPS[active]}
            </m.span>
          </AnimatePresence>
        </div>

        {/* Timeline */}
        <ol className="mt-6 border-t border-border pt-5">
          {STEPS.map((label, index) => {
            const state = stateOf(index);
            const isLast = index === LAST;

            return (
              <li
                key={label}
                className={cn(
                  "relative flex items-center gap-3",
                  !isLast && "pb-4",
                )}
              >
                {/* Connecting line */}
                {!isLast ? (
                  <span
                    className={cn(
                      "absolute bottom-0 left-2.75 top-6 w-px transition-colors duration-500",
                      state === "done" ? "bg-primary/40" : "bg-border",
                    )}
                  />
                ) : null}

                {/* Status indicator */}
                <span
                  className={cn(
                    "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-500",
                    state === "done" &&
                      "bg-primary text-primary-foreground shadow-sm",
                    state === "current" && "border-2 border-primary bg-white",
                    state === "pending" && "border border-border bg-white",
                  )}
                >
                  {state === "done" ? <Check className="size-3.5" /> : null}

                  {state === "current" ? (
                    <>
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/20" />
                      <span className="relative size-2 rounded-full bg-primary" />
                    </>
                  ) : null}
                </span>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm transition-all duration-500",
                    state === "pending"
                      ? "text-muted-foreground"
                      : "font-semibold text-foreground",
                  )}
                >
                  {label}
                </span>

                {/* Current status */}
                {state === "current" ? (
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Current
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        {/* Bottom status */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Delivery status</p>
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={active}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className="mt-0.5 text-sm font-semibold"
              >
                {delivered
                  ? "Package delivered successfully"
                  : "Shipment is moving through the network"}
              </m.p>
            </AnimatePresence>
          </div>

          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-full",
              delivered
                ? "bg-success-soft text-success"
                : "bg-primary/10 text-primary",
            )}
          >
            {delivered ? (
              <Check className="size-4" />
            ) : (
              <Truck className="size-4" />
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}
