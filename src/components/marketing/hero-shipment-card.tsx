"use client";

import { Check } from "lucide-react";
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
const LOOP_START = 3; // the loop restarts at "Picked up"
const STATIC_ACTIVE = 4; // what reduced-motion visitors see: "In transit"

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
      className="w-full max-w-md animate-sd-rise"
      style={{ animationDelay: "250ms" }}
    >
      <div className="rounded-xl border border-white/15 bg-[#0b1020]/70 p-5 text-white shadow-2xl backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-white/60">Tracking ID</p>
            <p className="font-mono text-sm font-medium">SD260902A1B2C3</p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={active}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                delivered
                  ? "bg-emerald-400/15 text-emerald-200"
                  : "bg-sky-400/15 text-sky-200",
              )}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {STEPS[active]}
            </m.span>
          </AnimatePresence>
        </div>

        <p className="mt-3 text-sm">
          Dhaka <span aria-hidden="true">→</span> Bogra
          <span className="text-white/60"> · Express · 2.5 kg</span>
        </p>

        <ol className="mt-5 border-t border-white/15 pt-5">
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
                {!isLast ? (
                  <span
                    className={cn(
                      "absolute top-6 bottom-0 left-2.75 w-px transition-colors duration-300",
                      state === "done" ? "bg-blue-400/60" : "bg-white/15",
                    )}
                  />
                ) : null}
                <span
                  className={cn(
                    "relative flex size-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                    state === "done" && "bg-blue-400 text-[#0b1020]",
                    state === "current" && "border-2 border-blue-300",
                    state === "pending" && "border border-white/30",
                  )}
                >
                  {state === "done" ? <Check className="size-3.5" /> : null}
                  {state === "current" ? (
                    <>
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-300/40" />
                      <span className="relative size-2 rounded-full bg-blue-300" />
                    </>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "text-sm transition-colors duration-300",
                    state === "pending"
                      ? "text-white/50"
                      : "font-medium text-white",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="mt-3 text-xs text-white/60">
        Illustration. Your dashboard shows live data.
      </figcaption>
    </figure>
  );
}
