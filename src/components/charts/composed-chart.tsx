"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact } from "@/lib/format";
import { ChartTable } from "./chart-table";
import {
  axisTick,
  colorAt,
  tooltipStyle,
  useChartAnimation,
} from "./chart-theme";

export interface ComboDatum {
  label: string;
  bars: number;
  line: number;
}

interface Props {
  data: readonly ComboDatum[];
  barLabel: string;
  lineLabel: string;
  summary: string;
  formatLine?: (value: number) => string;
}

export default function ComposedTrendChart({
  data,
  barLabel,
  lineLabel,
  summary,
  formatLine = String,
}: Props) {
  const animate = useChartAnimation();

  return (
    <div>
      <div role="img" aria-label={summary} className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={[...data]}
            margin={{ top: 8, right: 0, bottom: 0, left: -8 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="label" tick={axisTick} stroke="var(--border)" />
            <YAxis
              yAxisId="left"
              allowDecimals={false}
              tick={axisTick}
              stroke="var(--border)"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={axisTick}
              stroke="var(--border)"
              tickFormatter={(value) => formatCompact(Number(value))}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              formatter={(value, name) => [
                name === lineLabel ? formatLine(Number(value)) : String(value),
                String(name),
              ]}
            />
            <Bar
              yAxisId="left"
              dataKey="bars"
              name={barLabel}
              fill={colorAt(0)}
              radius={[4, 4, 0, 0]}
              isAnimationActive={animate}
              animationDuration={900}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="line"
              name={lineLabel}
              stroke={colorAt(2)}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={animate}
              animationDuration={1200}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-sm"
            style={{ background: colorAt(0) }}
          />
          {barLabel}
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-0.5 w-4 rounded"
            style={{ background: colorAt(2) }}
          />
          {lineLabel}
        </li>
      </ul>
      <ChartTable
        caption={summary}
        headers={["Date", barLabel, lineLabel]}
        rows={data.map((datum) => [
          datum.label,
          String(datum.bars),
          formatLine(datum.line),
        ])}
      />
    </div>
  );
}
