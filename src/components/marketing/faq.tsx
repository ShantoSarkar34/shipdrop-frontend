import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export function Faq({
  items,
}: {
  items: readonly { q: string; a: ReactNode }[];
}) {
  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {items.map((item) => (
        <details key={item.q} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown
              className="size-4 shrink-0 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="mt-3 text-muted-foreground">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
