"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const chartSkeleton = () => <Skeleton className="h-64 w-full" />;

export const LazyDonutChart = dynamic(() => import("./donut-chart"), {
  ssr: false,
  loading: chartSkeleton,
});
export const LazyAreaChart = dynamic(() => import("./area-chart"), {
  ssr: false,
  loading: chartSkeleton,
});
export const LazyRadarChart = dynamic(() => import("./radar-chart"), {
  ssr: false,
  loading: chartSkeleton,
});
export const LazyComposedChart = dynamic(() => import("./composed-chart"), {
  ssr: false,
  loading: chartSkeleton,
});
export const LazySparkline = dynamic(() => import("./sparkline"), {
  ssr: false,
  loading: () => <Skeleton className="h-12 w-full" />,
});
