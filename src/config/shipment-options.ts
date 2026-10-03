// Only values confirmed by the API collection. To offer more, add { value, label } entries here:
// the wizard picks them up automatically. The backend still validates every value.
export interface ShipmentOption {
  value: string;
  label: string;
  description?: string;
}

export const PARCEL_TYPES: readonly ShipmentOption[] = [
  { value: "PACKAGE", label: "Package" },
];

export const SERVICE_TYPES: readonly ShipmentOption[] = [
  { value: "EXPRESS", label: "Express" },
];

export const optionLabel = (
  options: readonly ShipmentOption[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? value;
