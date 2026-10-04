import type { Metadata } from "next";
import { AdminShipmentDetail } from "@/components/admin/admin-shipment-detail";

export const metadata: Metadata = { title: "Shipment details" };

export default async function AdminShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminShipmentDetail id={id} />;
}
