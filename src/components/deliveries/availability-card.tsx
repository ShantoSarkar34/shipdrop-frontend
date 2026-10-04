"use client";

import { CircleCheck } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSetAvailability } from "@/hooks/use-deliveries";
import type { SettableAvailability } from "@/lib/api/deliveries";

const OPTIONS: readonly {
  value: SettableAvailability;
  label: string;
  description: string;
}[] = [
  {
    value: "AVAILABLE",
    label: "Available",
    description: "You can be assigned deliveries",
  },
  {
    value: "OFFLINE",
    label: "Offline",
    description: "You won't be assigned deliveries",
  },
];

export function AvailabilityCard() {
  const { data: user } = useCurrentUser();
  const mutation = useSetAvailability();
  const current = user?.deliveryAgent?.availability;
  const onDelivery = current === "ON_DELIVERY";
  // While a change is in flight, show the choice being made. It snaps back if the backend refuses it.
  const shown = mutation.isPending ? mutation.variables : current;

  return (
    <section
      aria-labelledby="availability-heading"
      className="rounded-xl border border-border bg-card p-6"
    >
      <h2 id="availability-heading" className="text-lg font-bold">
        Availability
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {onDelivery
          ? "You're on a delivery. Your availability is managed automatically until it's finished."
          : "Choose whether you can be assigned new deliveries."}
      </p>
      <fieldset
        disabled={!current || onDelivery || mutation.isPending}
        className="mt-4 disabled:opacity-60"
      >
        <legend className="sr-only">Availability</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className="relative flex cursor-pointer flex-col gap-0.5 rounded-lg border border-input p-4 transition-colors has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-2 has-focus-visible:ring-ring has-disabled:cursor-not-allowed"
            >
              <input
                type="radio"
                name="availability"
                value={option.value}
                checked={shown === option.value}
                onChange={() => mutation.mutate(option.value)}
                className="peer sr-only"
              />
              <CircleCheck
                className="absolute top-3 right-3 size-4 text-primary opacity-0 peer-checked:opacity-100"
                aria-hidden="true"
              />
              <span className="pr-6 text-sm font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
