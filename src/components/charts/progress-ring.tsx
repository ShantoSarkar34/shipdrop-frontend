"use client";

import { m } from "motion/react";
import { AnimatedNumber } from "@/components/shared/animated-number";

export function ProgressRing({
  value,
  caption,
  size = 160,
}: {
  /** From 0 to 1. */
  value: number;
  caption: string;
  size?: number;
}) {
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <figure
      role="img"
      aria-label={`${caption}: ${Math.round(clamped * 100)}%`}
      className="flex flex-col items-center"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="10"
          />
          <m.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: clamped }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedNumber
            value={clamped * 100}
            format={(number) => `${Math.round(number)}%`}
            className="text-3xl font-extrabold tabular-nums"
          />
        </div>
      </div>
      <figcaption className="mt-3 max-w-56 text-center text-sm text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
