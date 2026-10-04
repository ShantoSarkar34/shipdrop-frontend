export function formatAuditAction(action: string): string {
  const text = action.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const shortId = (id: string) => id.slice(0, 8);

const MAX_VALUE_LENGTH = 80;

function clip(text: string) {
  return text.length > MAX_VALUE_LENGTH
    ? `${text.slice(0, MAX_VALUE_LENGTH)}…`
    : text;
}

function display(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string") return clip(value);
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  try {
    return clip(JSON.stringify(value) ?? "");
  } catch {
    return "…";
  }
}

/** Turns an audit entry's metadata into short, readable key/value pairs. Never dumps raw JSON. */
export function summarizeMetadata(
  metadata: unknown,
  visible = 3,
): { shown: [string, string][]; rest: [string, string][] } {
  if (
    typeof metadata !== "object" ||
    metadata === null ||
    Array.isArray(metadata)
  ) {
    return { shown: [], rest: [] };
  }
  const entries = Object.entries(metadata).map(
    ([key, value]): [string, string] => [key, display(value)],
  );
  return { shown: entries.slice(0, visible), rest: entries.slice(visible) };
}
