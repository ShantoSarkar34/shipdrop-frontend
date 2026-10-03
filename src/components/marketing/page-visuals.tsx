import { Check, MapPin, PackagePlus, Truck } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export function RouteVisual() {
  const nodes = [
    { icon: PackagePlus, label: "Created" },
    { icon: Truck, label: "In transit" },
    { icon: MapPin, label: "Delivered" },
  ];

  return (
    <figure
      role="img"
      aria-label="Illustration of a parcel moving from creation to delivery"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <Fragment key={node.label}>
              <div className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full border",
                    index === nodes.length - 1
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-primary",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium">{node.label}</span>
              </div>
              {index < nodes.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="mx-3 mb-6 h-px flex-1 border-t-2 border-dashed border-border"
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>
      <figcaption className="mt-5 text-xs text-muted-foreground">
        Illustration of a shipment&apos;s journey.
      </figcaption>
    </figure>
  );
}

const STATUSES = [
  "Pending",
  "Confirmed",
  "Assigned",
  "Picked up",
  "In transit",
  "Delivered",
];
const CURRENT = 3;

export function StatusVisual() {
  return (
    <figure
      role="img"
      aria-label="Illustration of a shipment moving through its delivery statuses"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <ol>
        {STATUSES.map((status, index) => {
          const done = index < CURRENT;
          const current = index === CURRENT;
          const last = index === STATUSES.length - 1;
          return (
            <li
              key={status}
              className={cn(
                "relative flex items-center gap-3",
                !last && "pb-3.5",
              )}
            >
              {!last ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-6 bottom-0 left-2.75 w-px",
                    done ? "bg-primary/60" : "bg-border",
                  )}
                />
              ) : null}
              <span
                aria-hidden="true"
                className={cn(
                  "relative flex size-6 shrink-0 items-center justify-center rounded-full",
                  done && "bg-primary text-primary-foreground",
                  current && "border-2 border-primary bg-card",
                  !done && !current && "border border-input bg-card",
                )}
              >
                {done ? <Check className="size-3.5" /> : null}
                {current ? (
                  <span className="size-2 rounded-full bg-primary" />
                ) : null}
              </span>
              <span
                className={cn(
                  "text-sm",
                  !done && !current ? "text-muted-foreground" : "font-medium",
                )}
              >
                {status}
              </span>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        Illustration
      </figcaption>
    </figure>
  );
}

const CHARGE_INPUTS = [
  "Pickup and delivery location",
  "Parcel information",
  "Delivery requirements",
  "Service type",
];

export function ChargeVisual() {
  return (
    <figure
      role="img"
      aria-label="Illustration: the delivery charge is calculated from shipment details and shown at checkout"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Delivery charge
      </p>
      <ul className="mt-4 space-y-2.5">
        {CHARGE_INPUTS.map((input) => (
          <li key={input} className="flex items-center gap-2.5 text-sm">
            <Check
              className="size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            {input}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center justify-between border-t border-dashed border-border pt-4">
        <span className="text-sm font-medium">Your charge</span>
        <span className="text-sm font-semibold text-primary">
          Calculated at checkout
        </span>
      </div>
      <figcaption className="mt-4 text-xs text-muted-foreground">
        Illustration. No prices are published.
      </figcaption>
    </figure>
  );
}
