"use client";

import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { colorAt, useChartAnimation } from "./chart-theme";

export default function Sparkline({
  values,
  colorIndex = 0,
}: {
  values: readonly number[];
  colorIndex?: number;
}) {
  const animate = useChartAnimation();
  const gradientId = useId().replace(/:/g, "");
  const color = colorAt(colorIndex);

  return (
    <div aria-hidden="true" className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={values.map((value, index) => ({ index, value }))}
          margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={animate}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
