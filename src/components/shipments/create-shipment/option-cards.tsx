import { CircleCheck } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { ShipmentOption } from "@/config/shipment-options";

export function OptionCards({
  legend,
  options,
  registration,
  error,
}: {
  legend: string;
  options: readonly ShipmentOption[];
  registration: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="relative flex cursor-pointer flex-col gap-0.5 rounded-lg border border-input p-4 transition-colors has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-2 has-focus-visible:ring-ring"
          >
            <input
              type="radio"
              value={option.value}
              className="peer sr-only"
              {...registration}
            />
            <CircleCheck
              className="absolute top-3 right-3 size-4 text-primary opacity-0 peer-checked:opacity-100"
              aria-hidden="true"
            />
            <span className="pr-6 text-sm font-medium">{option.label}</span>
            {option.description ? (
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            ) : null}
          </label>
        ))}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
