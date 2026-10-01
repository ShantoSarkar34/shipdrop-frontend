import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { getErrorMessage, getFieldErrors } from "@/lib/api/errors";

export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  knownFields: readonly Path<T>[],
): string | null {
  const fieldErrors = getFieldErrors(error);
  const unplaced: string[] = [];

  for (const [name, message] of Object.entries(fieldErrors)) {
    const field = knownFields.find((known) => known === name);
    if (field) setError(field, { type: "server", message });
    else unplaced.push(message);
  }

  if (unplaced.length > 0) return unplaced.join(" ");
  if (Object.keys(fieldErrors).length > 0) return null;
  return getErrorMessage(error);
}
