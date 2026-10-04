import Link from "next/link";
import { DeliveryActions } from "@/components/deliveries/delivery-actions";
import { DeliveryInfo } from "@/components/deliveries/delivery-info";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import type { Delivery } from "@/lib/api/deliveries";

export function DeliveryCard({ delivery }: { delivery: Delivery }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={`/provider/deliveries/${delivery.id}`}
            className="font-mono text-sm font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {delivery.trackingId}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            {delivery.pickupCity} <span aria-hidden="true">→</span>
            <span className="sr-only"> to </span> {delivery.deliveryCity}
          </p>
        </div>
        <StatusBadge status={delivery.status} />
      </header>

      <div className="mt-4">
        <DeliveryInfo delivery={delivery} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <DeliveryActions parcelId={delivery.id} status={delivery.status} />
        <Link
          href={`/provider/deliveries/${delivery.id}`}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Details
        </Link>
      </div>
    </article>
  );
}
