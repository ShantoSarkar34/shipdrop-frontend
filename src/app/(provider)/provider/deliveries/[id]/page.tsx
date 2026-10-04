import type { Metadata } from "next";
import { DeliveryDetail } from "@/components/deliveries/delivery-detail";

export const metadata: Metadata = { title: "Delivery details" };

export default async function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DeliveryDetail id={id} />;
}
