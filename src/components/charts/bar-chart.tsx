"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartDatum {
  label: string;
  value: number;
}

interface Props {
  data: readonly ChartDatum[];
  valueLabel: string;
  /** Read by screen readers instead of the drawing. */
  summary: string;
  formatValue?: (value: number) => string;
  orientation?: "columns" | "rows";
}

const tick = { fill: "var(--muted-foreground)", fontSize: 12 };

export default function SimpleBarChart({
  data,
  valueLabel,
  summary,
  formatValue = String,
  orientation = "columns",
}: Props) {
  const rows = orientation === "rows";

  return (
    <div>
      <div role="img" aria-label={summary} className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[...data]}
            layout={rows ? "vertical" : "horizontal"}
            margin={{ top: 8, right: 8, bottom: 0, left: rows ? 8 : -12 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={rows}
              horizontal={!rows}
            />
            {rows ? (
              <>
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={tick}
                  stroke="var(--border)"
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={120}
                  tick={tick}
                  stroke="var(--border)"
                />
              </>
            ) : (
              <>
                <XAxis dataKey="label" tick={tick} stroke="var(--border)" />
                <YAxis
                  allowDecimals={false}
                  tick={tick}
                  stroke="var(--border)"
                />
              </>
            )}
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--foreground)",
              }}
              formatter={(value) => [formatValue(Number(value)), valueLabel]}
            />
            <Bar
              dataKey="value"
              fill="var(--primary)"
              radius={rows ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="sr-only">
        <caption>{summary}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((datum) => (
            <tr key={datum.label}>
              <th scope="row">{datum.label}</th>
              <td>{formatValue(datum.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
