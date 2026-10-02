"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";

const VIEWPORT = { once: true, amount: 0.15 } as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const barVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const groupVariants = (stagger: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

/** Fades and lifts its content into view once, when it scrolls on screen. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </m.div>
  );
}

/** Wrap RevealItem children in this to stagger them. */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={groupVariants(stagger)}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.div data-reveal className={className} variants={itemVariants}>
      {children}
    </m.div>
  );
}

/** A bar that draws from left to right when its RevealItem becomes visible. */
export function RevealBar({ className }: { className?: string }) {
  return (
    <m.div
      data-reveal
      className={className}
      style={{ transformOrigin: "left" }}
      variants={barVariants}
    />
  );
}
