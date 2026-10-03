import {
  Ban,
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  Clock,
  type LucideIcon,
  MapPin,
  Package,
  PackageCheck,
  Truck,
  Undo2,
} from "lucide-react";
import { STATUS_LABEL, type ParcelStatus } from "@/lib/parcel-status";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "warning" | "info" | "success" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  warning: "bg-warning-soft text-warning-fg",
  info: "bg-info-soft text-info-fg",
  success: "bg-success-soft text-success-fg",
  danger: "bg-danger-soft text-danger-fg",
};

const STATUS_META: Record<ParcelStatus, { icon: LucideIcon; tone: Tone }> = {
  PENDING: { icon: Clock, tone: "warning" },
  CONFIRMED: { icon: CircleCheck, tone: "info" },
  ASSIGNED: { icon: ClipboardCheck, tone: "info" },
  PICKED_UP: { icon: Package, tone: "info" },
  IN_TRANSIT: { icon: Truck, tone: "info" },
  OUT_FOR_DELIVERY: { icon: MapPin, tone: "info" },
  DELIVERED: { icon: PackageCheck, tone: "success" },
  CANCELLED: { icon: Ban, tone: "neutral" },
  FAILED_DELIVERY: { icon: CircleAlert, tone: "danger" },
  RETURNED: { icon: Undo2, tone: "neutral" },
};

export function StatusBadge({ status, className }: { status: ParcelStatus; className?: string }) {
  // Falls back gracefully if the backend ever sends a status this build doesn't know.
  const meta = STATUS_META[status] ?? { icon: CircleAlert, tone: "neutral" as const };
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        TONE_CLASS[meta.tone],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}