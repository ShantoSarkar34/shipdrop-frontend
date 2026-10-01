import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

export function FormError({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-danger-soft px-3 py-2.5 text-sm text-danger-fg"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
