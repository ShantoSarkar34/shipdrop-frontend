export const PARCEL_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "FAILED_DELIVERY",
  "RETURNED",
] as const;

export type ParcelStatus = (typeof PARCEL_STATUSES)[number];

export const STATUS_LABEL: Record<ParcelStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  FAILED_DELIVERY: "Failed delivery",
  RETURNED: "Returned",
};

/** The normal journey of a parcel, in order. */
export const HAPPY_PATH: readonly ParcelStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

// Mirrors the backend state machine. The backend stays authoritative; this only decides which actions the UI offers.
const TRANSITIONS: Record<ParcelStatus, readonly ParcelStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["PICKED_UP", "CONFIRMED"],
  PICKED_UP: ["IN_TRANSIT", "FAILED_DELIVERY"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY", "FAILED_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED_DELIVERY"],
  FAILED_DELIVERY: ["OUT_FOR_DELIVERY", "RETURNED"],
  DELIVERED: [],
  CANCELLED: [],
  RETURNED: [],
};

export function isParcelStatus(value: string): value is ParcelStatus {
  return (PARCEL_STATUSES as readonly string[]).includes(value);
}

export const nextStatuses = (status: ParcelStatus): readonly ParcelStatus[] =>
  TRANSITIONS[status];

export const canTransition = (from: ParcelStatus, to: ParcelStatus): boolean =>
  TRANSITIONS[from].includes(to);

export const isTerminal = (status: ParcelStatus): boolean =>
  TRANSITIONS[status].length === 0;

/** Customers can cancel exactly when the state machine allows a move to CANCELLED. */
export const canCustomerCancel = (status: ParcelStatus): boolean =>
  canTransition(status, "CANCELLED");

export interface HistoryEntry {
  status: ParcelStatus;
  note?: string | null;
  createdAt: string;
}

export type TimelineState =
  | "completed"
  | "current"
  | "upcoming"
  | "failed"
  | "terminal";

export interface TimelineStep {
  status: ParcelStatus;
  label: string;
  state: TimelineState;
  /** Only set for steps that have actually happened. Upcoming steps never carry a time. */
  at: string | null;
  note: string | null;
}

export function buildTimeline(
  history: readonly HistoryEntry[],
  current: ParcelStatus,
): TimelineStep[] {
  const ordered = [...history].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );

  const lastEntry = (status: ParcelStatus) => {
    for (let i = ordered.length - 1; i >= 0; i -= 1) {
      if (ordered[i].status === status) return ordered[i];
    }
    return undefined;
  };

  const make = (status: ParcelStatus, state: TimelineState): TimelineStep => {
    const entry = state === "upcoming" ? undefined : lastEntry(status);
    return {
      status,
      label: STATUS_LABEL[status],
      state,
      at: entry?.createdAt ?? null,
      note: entry?.note ?? null,
    };
  };

  const currentIndex = HAPPY_PATH.indexOf(current);

  // On the normal path: everything before is done, the current step is highlighted, the rest is upcoming.
  if (currentIndex >= 0) {
    return HAPPY_PATH.map((status, index) => {
      if (index < currentIndex) return make(status, "completed");
      if (index === currentIndex)
        return make(status, status === "DELIVERED" ? "terminal" : "current");
      return make(status, "upcoming");
    });
  }

  // Off the normal path (cancelled, failed, returned): show the steps that were reached, then the exception.
  let reached = -1;
  for (const entry of ordered) {
    const index = HAPPY_PATH.indexOf(entry.status);
    if (index >= 0) reached = index;
  }

  const steps = HAPPY_PATH.slice(0, reached + 1).map((status) =>
    make(status, "completed"),
  );
  if (current === "RETURNED") steps.push(make("FAILED_DELIVERY", "failed"));
  steps.push(
    make(current, current === "FAILED_DELIVERY" ? "failed" : "terminal"),
  );
  return steps;
}

export type AgentAction =
  | { kind: "accept" }
  | { kind: "reject" }
  | { kind: "pickup" }
  | {
      kind: "status";
      to: ParcelStatus;
      label: string;
      tone: "primary" | "danger";
    };

// Moves an agent makes through the status endpoint. Everything else (confirming, assigning, cancelling)
// belongs to admins or customers.
const AGENT_STATUS_LABEL: Partial<Record<ParcelStatus, string>> = {
  IN_TRANSIT: "Mark in transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Mark delivered",
  FAILED_DELIVERY: "Report failed delivery",
  RETURNED: "Mark returned",
};

/** What an assigned delivery agent can do next, derived from the state machine. */
export function getAgentActions(status: ParcelStatus): AgentAction[] {
  if (status === "ASSIGNED")
    return [{ kind: "pickup" }, { kind: "accept" }, { kind: "reject" }];

  return nextStatuses(status)
    .filter((to) => AGENT_STATUS_LABEL[to] !== undefined)
    .map(
      (to): AgentAction => ({
        kind: "status",
        to,
        label:
          status === "FAILED_DELIVERY" && to === "OUT_FOR_DELIVERY"
            ? "Retry delivery"
            : (AGENT_STATUS_LABEL[to] ?? ""),
        tone:
          to === "FAILED_DELIVERY" || to === "RETURNED" ? "danger" : "primary",
      }),
    );
}
