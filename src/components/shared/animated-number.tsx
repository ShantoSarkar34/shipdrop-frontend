"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const defaultFormat = (value: number) => Math.round(value).toLocaleString("en");

export function AnimatedNumber({
  value,
  format = defaultFormat,
  duration = 0.9,
  className,
}: {
  value: number;
  format?: (value: number) => string;
  duration?: number;
  className?: string;
}) {
  const element = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  const formatRef = useRef(format);
  const reduce = useReducedMotion();

  useEffect(() => {
    formatRef.current = format;
  });

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    if (reduce) {
      node.textContent = formatRef.current(value);
      shown.current = value;
      return;
    }
    const controls = animate(shown.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        shown.current = latest;
        node.textContent = formatRef.current(latest);
      },
    });
    return () => controls.stop();
  }, [value, duration, reduce]);

  return (
    <span ref={element} className={className}>
      {format(0)}
    </span>
  );
}
