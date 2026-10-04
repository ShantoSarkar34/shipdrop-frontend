import { SERVICE_TYPES, optionLabel } from "@/config/shipment-options";
import { PAYMENT_CURRENCY } from "@/config/currency";
import type { Delivery } from "@/lib/api/deliveries";
import { formatMoney } from "@/lib/format";

export function DeliveryInfo({ delivery }: { delivery: Delivery }) {
  const phoneHref = `tel:${delivery.receiverPhone.replace(/[^\d+]/g, "")}`;
  return (
    <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-muted-foreground">Pickup</dt>
        <dd className="font-medium wrap-break-word">
          {delivery.pickupAddress}, {delivery.pickupCity}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Deliver to</dt>
        <dd className="font-medium wrap-break-word">
          {delivery.deliveryAddress}, {delivery.deliveryCity}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Receiver</dt>
        <dd className="font-medium">
          {delivery.receiverName} ·{" "}
          <a
            href={phoneHref}
            className="text-primary underline-offset-4 hover:underline"
          >
            {delivery.receiverPhone}
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Parcel</dt>
        <dd className="font-medium">
          {delivery.weightKg} kg ·{" "}
          {optionLabel(SERVICE_TYPES, delivery.serviceType)} ·{" "}
          {formatMoney(delivery.deliveryCharge, PAYMENT_CURRENCY)}
        </dd>
      </div>
    </dl>
  );
}
