import type { User } from "@/types/user";
import { api } from "./http";

export type ProfileField =
  | "name"
  | "phone"
  | "defaultPickupAddress"
  | "vehicleType"
  | "licenseNumber";
export type UpdateProfileInput = Partial<Record<ProfileField, string>>;

export async function fetchMe(): Promise<User> {
  return (await api.get<User>("/users/me")).data;
}

// Fields that don't belong to the caller's role are ignored by the backend.
export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  await api.patch<unknown>("/users/me", input);
}
