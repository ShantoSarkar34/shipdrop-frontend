import type { Metadata } from "next";
import { AdminAnalyticsView } from "@/components/admin/admin-analytics-view";
import { PageHeading } from "@/components/layout/page-heading";

export const metadata: Metadata = { title: "Analytics" };

export default function AdminAnalyticsPage() {
  return (
    <>
      <PageHeading
        title="Analytics"
        description="Shipment, revenue and status trends."
      />
      <AdminAnalyticsView />
    </>
  );
}
