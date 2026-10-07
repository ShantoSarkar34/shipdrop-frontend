"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ChartDatum } from "./bar-chart";
import { ChartTable } from "./chart-table";
import { colorAt, tooltipStyle, useChartAnimation } from "./chart-theme";

interface Props {
  data: readonly ChartDatum[];
  valueLabel: string;
  summary: string;
  formatValue?: (value: number) => string;
  /** Fixes the outer edge (for example 100 for percentages). Otherwise it follows the largest value. */
  max?: number;
  colorIndex?: number;
}

export default function RadarProfileChart({
  data,
  valueLabel,
  summary,
  formatValue = String,
  max,
  colorIndex = 0,
}: Props) {
  const animate = useChartAnimation();
  const color = colorAt(colorIndex);

  return (
    <div>
      <div role="img" aria-label={summary} className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={[...data]} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, max ?? "dataMax"]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name={valueLabel}
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.28}
              dot
              isAnimationActive={animate}
              animationDuration={1100}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [formatValue(Number(value)), valueLabel]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <ChartTable
        caption={summary}
        headers={["Measure", valueLabel]}
        rows={data.map((datum) => [datum.label, formatValue(datum.value)])}
      />
    </div>
  );
}
