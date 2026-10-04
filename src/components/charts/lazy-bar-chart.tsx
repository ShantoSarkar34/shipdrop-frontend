"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const LazyBarChart = dynamic(() => import("./bar-chart"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />,
});
