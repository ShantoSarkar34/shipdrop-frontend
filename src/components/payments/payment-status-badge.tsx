import { CircleAlert, CircleCheck, Clock, type LucideIcon } from "lucide-react";
import type { PaymentStatus } from "@/lib/api/payments";
import { cn } from "@/lib/utils";

const META: Record<
  PaymentStatus,
  { icon: LucideIcon; label: string; className: string }
> = {
  PAID: {
    icon: CircleCheck,
    label: "Paid",
    className: "bg-success-soft text-success-fg",
  },
  PENDING: {
    icon: Clock,
    label: "Pending",
    className: "bg-warning-soft text-warning-fg",
  },
  FAILED: {
    icon: CircleAlert,
    label: "Failed",
    className: "bg-danger-soft text-danger-fg",
  },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  // An unknown status from the backend shows as plain text instead of breaking the page.
  const meta = META[status] ?? {
    icon: Clock,
    label: String(status),
    className: "bg-muted text-muted-foreground",
  };
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        meta.className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}
