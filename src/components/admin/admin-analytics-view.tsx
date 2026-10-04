"use client";

import { useState } from "react";
import { AdminCharts } from "@/components/admin/admin-charts";
import { NativeSelect } from "@/components/forms/native-select";
import { DEFAULT_PERIOD, PERIODS } from "@/config/periods";

export function AdminAnalyticsView() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const periodLabel =
    PERIODS.find((item) => item.value === period)?.label ?? period;

  return (
    <>
      {PERIODS.length > 1 ? (
        <div className="mb-6 max-w-xs">
          <NativeSelect
            label="Period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            {PERIODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </NativeSelect>
        </div>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          Showing: {periodLabel}
        </p>
      )}
      <AdminCharts period={period} show={["shipments", "status", "revenue"]} />
    </>
  );
}
