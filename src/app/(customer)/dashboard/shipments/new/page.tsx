import type { Metadata } from "next";
import { PageHeading } from "@/components/layout/page-heading";
import { CreateShipmentWizard } from "@/components/shipments/create-shipment/create-shipment-wizard";

export const metadata: Metadata = { title: "Create shipment" };

export default function NewShipmentPage() {
  return (
    <>
      <PageHeading title="Create shipment" description="Tell us what to collect and where to deliver it." />
      <div className="mx-auto max-w-2xl">
        <CreateShipmentWizard />
      </div>
    </>
  );
}