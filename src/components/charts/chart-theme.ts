import { useReducedMotion } from "motion/react";

// Theme tokens first. The plain colors are only a safety net if a token is missing from the theme.
export const CHART_COLORS = [
  "var(--chart-1, var(--primary))",
  "var(--chart-2, #0d9488)",
  "var(--chart-3, #d97706)",
  "var(--chart-4, #e11d48)",
  "var(--chart-5, #64748b)",
] as const;

export const colorAt = (index: number) => CHART_COLORS[index % CHART_COLORS.length];

export const axisTick = { fill: "var(--muted-foreground)", fontSize: 12 };

export const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--foreground)",
};

/** Charts animate unless the visitor prefers reduced motion. */
export function useChartAnimation(): boolean {
  return !useReducedMotion();
}