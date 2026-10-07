import type { AdminStats } from "@/lib/api/admin";
import type { ParcelStatus } from "@/lib/parcel-status";

/** part / whole, kept between 0 and 1, and 0 when there is nothing to divide by. */
export const ratio = (part: number, whole: number): number =>
  whole > 0 ? Math.min(1, Math.max(0, part / whole)) : 0;

export const completionRate = (
  completed: number,
  failed: number,
  returned: number,
): number => ratio(completed, completed + failed + returned);

export interface DailyPoint {
  date: string;
  count: number;
  amount: number;
}

/** Joins a daily count series and a daily amount series by date, filling gaps with 0. */
export function mergeDailySeries(
  counts: readonly { date: string; count: number }[],
  amounts: readonly { date: string; amount: number }[],
): DailyPoint[] {
  const byDate = new Map<string, DailyPoint>();
  for (const point of counts)
    byDate.set(point.date, { date: point.date, count: point.count, amount: 0 });
  for (const point of amounts) {
    const existing = byDate.get(point.date);
    if (existing) existing.amount = point.amount;
    else
      byDate.set(point.date, {
        date: point.date,
        count: 0,
        amount: point.amount,
      });
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const percent = (value: number) => Math.round(value * 100);

/** Five health measures from real counts, each 0 to 100. All zero when there is no data. */
export function platformHealth(
  stats: AdminStats,
): { label: string; value: number }[] {
  const { parcels, payments, users } = stats;
  const hasParcels = parcels.total > 0;
  return [
    {
      label: "Delivered",
      value: percent(ratio(parcels.delivered, parcels.total)),
    },
    {
      label: "Progressing",
      value: hasParcels
        ? percent(1 - ratio(parcels.pending + parcels.confirmed, parcels.total))
        : 0,
    },
    {
      label: "Payments settled",
      value: percent(ratio(payments.paid, payments.total)),
    },
    {
      label: "Active accounts",
      value: percent(ratio(users.active, users.total)),
    },
    {
      label: "Clean shipments",
      value: hasParcels
        ? percent(
            1 -
              ratio(
                parcels.failedDelivery + parcels.returned + parcels.cancelled,
                parcels.total,
              ),
          )
        : 0,
    },
  ];
}

const PIPELINE_GROUPS: readonly {
  label: string;
  statuses: readonly ParcelStatus[];
}[] = [
  { label: "Pending", statuses: ["PENDING"] },
  { label: "Confirmed", statuses: ["CONFIRMED"] },
  { label: "Assigned", statuses: ["ASSIGNED"] },
  {
    label: "On the move",
    statuses: ["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"],
  },
  { label: "Delivered", statuses: ["DELIVERED"] },
  { label: "Problems", statuses: ["FAILED_DELIVERY", "RETURNED", "CANCELLED"] },
];

/** Groups the ten statuses into six axes for a radar chart. */
export function pipelineProfile(
  distribution: readonly { status: ParcelStatus; count: number }[],
): { label: string; value: number }[] {
  return PIPELINE_GROUPS.map((group) => ({
    label: group.label,
    value: distribution
      .filter((entry) => group.statuses.includes(entry.status))
      .reduce((sum, entry) => sum + entry.count, 0),
  }));
}
