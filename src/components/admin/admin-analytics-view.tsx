"use client";

import { useState } from "react";
import { AdminCharts } from "@/components/admin/admin-charts";
import { PeriodControl } from "@/components/shared/period-control";
import { DEFAULT_PERIOD } from "@/config/periods";

export function AdminAnalyticsView() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);

  return (
    <>
      <PeriodControl value={period} onChange={setPeriod} />
      <AdminCharts
        period={period}
        show={["overview", "status", "pipeline", "shipments", "revenue"]}
      />
    </>
  );
}
