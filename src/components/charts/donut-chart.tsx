"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { colorAt, tooltipStyle, useChartAnimation } from "./chart-theme";

export interface SliceDatum {
  label: string;
  value: number;
}

interface Props {
  data: readonly SliceDatum[];
  summary: string;
  centerLabel: string;
  formatValue?: (value: number) => string;
}

export default function DonutChart({
  data,
  summary,
  centerLabel,
  formatValue = String,
}: Props) {
  const animate = useChartAnimation();
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div>
      <div role="img" aria-label={summary} className="relative h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[...data]}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={data.length > 1 ? 2 : 0}
              stroke="var(--card)"
              strokeWidth={2}
              isAnimationActive={animate}
              animationDuration={900}
            >
              {data.map((slice, index) => (
                <Cell key={slice.label} fill={colorAt(index)} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => [
                formatValue(Number(value)),
                String(name),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedNumber
            value={total}
            format={formatValue}
            className="text-2xl font-extrabold tabular-nums"
          />
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      </div>
      {/* The legend carries the numbers as text, so the chart never relies on color alone. */}
      <ul className="mt-4 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
        {data.map((slice, index) => (
          <li
            key={slice.label}
            className="flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: colorAt(index) }}
              />
              {slice.label}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {formatValue(slice.value)}
              {total > 0
                ? ` · ${Math.round((slice.value / total) * 100)}%`
                : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
