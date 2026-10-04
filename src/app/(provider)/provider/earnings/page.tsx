import type { Metadata } from "next";
import { EarningsView } from "@/components/deliveries/earnings-view";
import { PageHeading } from "@/components/layout/page-heading";

export const metadata: Metadata = { title: "Earnings" };

export default function EarningsPage() {
  return (
    <>
      <PageHeading
        title="Earnings"
        description="What you've earned from delivered and paid shipments."
      />
      <EarningsView />
    </>
  );
}
