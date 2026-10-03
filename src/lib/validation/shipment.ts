import { z } from "zod";
import type { CreateParcelInput } from "@/lib/api/parcels";

const required = (message: string) => z.string().trim().min(1, message);

export const shipmentSchema = z.object({
  senderName: required("Enter the sender's name"),
  senderPhone: required("Enter the sender's phone number"),
  pickupAddress: required("Enter the pickup address"),
  pickupCity: required("Enter the pickup city"),
  receiverName: required("Enter the receiver's name"),
  receiverPhone: required("Enter the receiver's phone number"),
  deliveryAddress: required("Enter the delivery address"),
  deliveryCity: required("Enter the delivery city"),
  parcelType: required("Choose a parcel type"),
  // Kept as text while typing, converted to a number on submit.
  weightKg: z
    .string()
    .trim()
    .min(1, "Enter the parcel's weight")
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) > 0,
      "Enter a weight greater than 0",
    ),
  serviceType: required("Choose a service"),
  notes: z.string().trim(),
});

export type ShipmentValues = z.infer<typeof shipmentSchema>;

/** Which fields belong to each input step (the review step has none). */
export const STEP_FIELDS: readonly (readonly (keyof ShipmentValues)[])[] = [
  ["senderName", "senderPhone", "pickupAddress", "pickupCity"],
  ["receiverName", "receiverPhone", "deliveryAddress", "deliveryCity"],
  ["parcelType", "weightKg", "notes"],
  ["serviceType"],
];

export const ALL_FIELDS: readonly (keyof ShipmentValues)[] = STEP_FIELDS.flat();

export function toCreateInput(values: ShipmentValues): CreateParcelInput {
  return {
    senderName: values.senderName,
    senderPhone: values.senderPhone,
    receiverName: values.receiverName,
    receiverPhone: values.receiverPhone,
    pickupAddress: values.pickupAddress,
    pickupCity: values.pickupCity,
    deliveryAddress: values.deliveryAddress,
    deliveryCity: values.deliveryCity,
    parcelType: values.parcelType,
    weightKg: Number(values.weightKg),
    serviceType: values.serviceType,
    notes: values.notes || undefined,
  };
}
