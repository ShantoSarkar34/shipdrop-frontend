import type { Metadata } from "next";
import { AnalyticsView } from "@/components/deliveries/analytics-view";
import { PageHeading } from "@/components/layout/page-heading";

export const metadata: Metadata = { title: "Analytics" };

export default function AgentAnalyticsPage() {
  return (
    <>
      <PageHeading
        title="Analytics"
        description="How your deliveries are going."
      />
      <AnalyticsView />
    </>
  );
}
