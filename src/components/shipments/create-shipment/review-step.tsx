import { Info } from "lucide-react";
import {
  PARCEL_TYPES,
  SERVICE_TYPES,
  optionLabel,
} from "@/config/shipment-options";
import type { ShipmentValues } from "@/lib/validation/shipment";
import { Button } from "@/components/ui/button";

function Section({
  title,
  onEdit,
  rows,
}: {
  title: string;
  onEdit: () => void;
  rows: readonly (readonly [string, string])[];
}) {
  return (
    <section className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          Edit<span className="sr-only"> {title}</span>
        </Button>
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium wrap-break-word">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReviewStep({
  values,
  onEdit,
}: {
  values: ShipmentValues;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="space-y-4">
      <Section
        title="Sender and pickup"
        onEdit={() => onEdit(0)}
        rows={[
          ["Name", values.senderName],
          ["Phone", values.senderPhone],
          ["Address", values.pickupAddress],
          ["City", values.pickupCity],
        ]}
      />
      <Section
        title="Receiver and delivery"
        onEdit={() => onEdit(1)}
        rows={[
          ["Name", values.receiverName],
          ["Phone", values.receiverPhone],
          ["Address", values.deliveryAddress],
          ["City", values.deliveryCity],
        ]}
      />
      <Section
        title="Parcel and service"
        onEdit={() => onEdit(2)}
        rows={[
          ["Parcel type", optionLabel(PARCEL_TYPES, values.parcelType)],
          ["Weight", values.weightKg ? `${values.weightKg} kg` : ""],
          ["Service", optionLabel(SERVICE_TYPES, values.serviceType)],
          ["Notes", values.notes],
        ]}
      />
      <div
        role="note"
        className="flex gap-3 rounded-lg bg-muted/60 p-4 text-sm text-muted-foreground"
      >
        <Info
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <p>
          The delivery charge is calculated by SwiftDrop when you create the
          shipment. You&apos;ll see the exact amount before you pay.
        </p>
      </div>
    </div>
  );
}
