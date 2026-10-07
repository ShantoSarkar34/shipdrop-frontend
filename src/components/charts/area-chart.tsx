"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact } from "@/lib/format";
import type { ChartDatum } from "./bar-chart";
import { ChartTable } from "./chart-table";
import {
  axisTick,
  colorAt,
  tooltipStyle,
  useChartAnimation,
} from "./chart-theme";

interface Props {
  data: readonly ChartDatum[];
  valueLabel: string;
  summary: string;
  formatValue?: (value: number) => string;
  colorIndex?: number;
}

export default function AreaTrendChart({
  data,
  valueLabel,
  summary,
  formatValue = String,
  colorIndex = 0,
}: Props) {
  const animate = useChartAnimation();
  const gradientId = useId().replace(/:/g, "");
  const color = colorAt(colorIndex);

  return (
    <div>
      <div role="img" aria-label={summary} className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={[...data]}
            margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="label" tick={axisTick} stroke="var(--border)" />
            <YAxis
              tick={axisTick}
              stroke="var(--border)"
              tickFormatter={(value) => formatCompact(Number(value))}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [formatValue(Number(value)), valueLabel]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={data.length <= 3}
              isAnimationActive={animate}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <ChartTable
        caption={summary}
        headers={["Date", valueLabel]}
        rows={data.map((datum) => [datum.label, formatValue(datum.value)])}
      />
    </div>
  );
}
