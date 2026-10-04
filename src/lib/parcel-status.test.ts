import { describe, expect, it } from "vitest";
import {
  buildTimeline,
  canAssignAgent,
  canCustomerCancel,
  canTransition,
  getAdminActions,
  getAgentActions,
  isParcelStatus,
  isTerminal,
  nextStatuses,
  PARCEL_STATUSES,
  type HistoryEntry,
  type ParcelStatus,
  type TimelineStep,
} from "./parcel-status";

const h = (
  status: ParcelStatus,
  minute: number,
  note: string | null = null,
): HistoryEntry => ({
  status,
  note,
  createdAt: `2026-09-01T00:0${minute}:00.000Z`,
});

const states = (steps: TimelineStep[]) =>
  steps.map((step) => `${step.status}:${step.state}`);

describe("state machine", () => {
  it("allows the transitions from the backend table", () => {
    expect(canTransition("PENDING", "CONFIRMED")).toBe(true);
    expect(canTransition("ASSIGNED", "CONFIRMED")).toBe(true);
    expect(canTransition("PICKED_UP", "FAILED_DELIVERY")).toBe(true);
    expect(canTransition("FAILED_DELIVERY", "OUT_FOR_DELIVERY")).toBe(true);
    expect(canTransition("FAILED_DELIVERY", "RETURNED")).toBe(true);
  });

  it("rejects skipped steps", () => {
    expect(canTransition("PENDING", "DELIVERED")).toBe(false);
    expect(canTransition("IN_TRANSIT", "DELIVERED")).toBe(false);
    expect(canTransition("CONFIRMED", "PICKED_UP")).toBe(false);
  });

  it("treats delivered, cancelled and returned as terminal", () => {
    for (const status of ["DELIVERED", "CANCELLED", "RETURNED"] as const) {
      expect(isTerminal(status)).toBe(true);
      expect(nextStatuses(status)).toEqual([]);
      for (const target of PARCEL_STATUSES)
        expect(canTransition(status, target)).toBe(false);
    }
    expect(isTerminal("FAILED_DELIVERY")).toBe(false);
  });

  it("lists the next statuses for an assigned parcel", () => {
    expect(nextStatuses("ASSIGNED")).toEqual(["PICKED_UP", "CONFIRMED"]);
  });

  it("lets customers cancel only while pending or confirmed", () => {
    expect(canCustomerCancel("PENDING")).toBe(true);
    expect(canCustomerCancel("CONFIRMED")).toBe(true);
    for (const status of PARCEL_STATUSES.filter(
      (s) => s !== "PENDING" && s !== "CONFIRMED",
    )) {
      expect(canCustomerCancel(status)).toBe(false);
    }
  });

  it("recognises valid status strings", () => {
    expect(isParcelStatus("IN_TRANSIT")).toBe(true);
    expect(isParcelStatus("TELEPORTED")).toBe(false);
  });
});

describe("buildTimeline", () => {
  const upToTransit = [
    h("PENDING", 0),
    h("CONFIRMED", 1),
    h("ASSIGNED", 2),
    h("PICKED_UP", 3),
    h("IN_TRANSIT", 4),
  ];

  it("marks past steps completed, the current step current, and the rest upcoming", () => {
    const steps = buildTimeline(upToTransit, "IN_TRANSIT");
    expect(states(steps)).toEqual([
      "PENDING:completed",
      "CONFIRMED:completed",
      "ASSIGNED:completed",
      "PICKED_UP:completed",
      "IN_TRANSIT:current",
      "OUT_FOR_DELIVERY:upcoming",
      "DELIVERED:upcoming",
    ]);
    expect(steps[4].at).toBe("2026-09-01T00:04:00.000Z");
  });

  it("never gives upcoming steps a time", () => {
    const steps = buildTimeline(upToTransit, "IN_TRANSIT");
    expect(steps[5].at).toBeNull();
    expect(steps[6].at).toBeNull();
  });

  it("ends a delivered parcel on a terminal step with nothing upcoming", () => {
    const history = [
      ...upToTransit,
      h("OUT_FOR_DELIVERY", 5),
      h("DELIVERED", 6),
    ];
    const steps = buildTimeline(history, "DELIVERED");
    expect(steps).toHaveLength(7);
    expect(steps[6].state).toBe("terminal");
    expect(steps.some((step) => step.state === "upcoming")).toBe(false);
  });

  it("stops at the last reached step when a parcel is cancelled", () => {
    const steps = buildTimeline(
      [h("PENDING", 0), h("CONFIRMED", 1), h("CANCELLED", 2)],
      "CANCELLED",
    );
    expect(states(steps)).toEqual([
      "PENDING:completed",
      "CONFIRMED:completed",
      "CANCELLED:terminal",
    ]);
  });

  it("does not show a rolled-back assignment as reached when cancelled afterwards", () => {
    const history = [
      h("PENDING", 0),
      h("CONFIRMED", 1),
      h("ASSIGNED", 2),
      h("CONFIRMED", 3),
      h("CANCELLED", 4),
    ];
    expect(states(buildTimeline(history, "CANCELLED"))).toEqual([
      "PENDING:completed",
      "CONFIRMED:completed",
      "CANCELLED:terminal",
    ]);
  });

  it("shows a failed delivery as a failed step after the last reached step", () => {
    const history = [
      ...upToTransit,
      h("OUT_FOR_DELIVERY", 5),
      h("FAILED_DELIVERY", 6, "Receiver unavailable"),
    ];
    const steps = buildTimeline(history, "FAILED_DELIVERY");
    expect(states(steps).slice(-2)).toEqual([
      "OUT_FOR_DELIVERY:completed",
      "FAILED_DELIVERY:failed",
    ]);
    expect(steps).toHaveLength(7);
    expect(steps[6].note).toBe("Receiver unavailable");
  });

  it("adds a returned terminal step after the failed attempt", () => {
    const history = [
      ...upToTransit,
      h("OUT_FOR_DELIVERY", 5),
      h("FAILED_DELIVERY", 6),
      h("RETURNED", 7),
    ];
    expect(states(buildTimeline(history, "RETURNED")).slice(-3)).toEqual([
      "OUT_FOR_DELIVERY:completed",
      "FAILED_DELIVERY:failed",
      "RETURNED:terminal",
    ]);
  });

  it("treats a rolled-back assignment as upcoming again, without its old time", () => {
    const history = [
      h("PENDING", 0),
      h("CONFIRMED", 1),
      h("ASSIGNED", 2),
      h("CONFIRMED", 3),
    ];
    const steps = buildTimeline(history, "CONFIRMED");
    expect(states(steps).slice(0, 3)).toEqual([
      "PENDING:completed",
      "CONFIRMED:current",
      "ASSIGNED:upcoming",
    ]);
    expect(steps[1].at).toBe("2026-09-01T00:03:00.000Z");
    expect(steps[2].at).toBeNull();
  });

  it("keeps a retried delivery on the normal path", () => {
    const history = [
      ...upToTransit,
      h("OUT_FOR_DELIVERY", 5),
      h("FAILED_DELIVERY", 6),
      h("OUT_FOR_DELIVERY", 7),
    ];
    const steps = buildTimeline(history, "OUT_FOR_DELIVERY");
    expect(steps[5].state).toBe("current");
    expect(steps[5].at).toBe("2026-09-01T00:07:00.000Z");
    expect(steps[6].state).toBe("upcoming");
  });
});

describe("getAgentActions", () => {
  const kinds = (status: ParcelStatus) =>
    getAgentActions(status).map((action) =>
      action.kind === "status" ? action.to : action.kind,
    );

  it("offers pickup, accept and decline for an assigned parcel", () => {
    expect(kinds("ASSIGNED")).toEqual(["pickup", "accept", "reject"]);
  });

  it("offers nothing before assignment or after the parcel is finished", () => {
    for (const status of [
      "PENDING",
      "CONFIRMED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ] as const) {
      expect(getAgentActions(status)).toEqual([]);
    }
  });

  it("never offers delivered while the parcel is only in transit", () => {
    expect(kinds("IN_TRANSIT")).toEqual([
      "OUT_FOR_DELIVERY",
      "FAILED_DELIVERY",
    ]);
    expect(kinds("PICKED_UP")).toEqual(["IN_TRANSIT", "FAILED_DELIVERY"]);
  });

  it("offers delivered or failed once the parcel is out for delivery", () => {
    expect(kinds("OUT_FOR_DELIVERY")).toEqual(["DELIVERED", "FAILED_DELIVERY"]);
  });

  it("offers a retry or a return after a failed delivery", () => {
    const actions = getAgentActions("FAILED_DELIVERY");
    expect(actions).toEqual([
      {
        kind: "status",
        to: "OUT_FOR_DELIVERY",
        label: "Retry delivery",
        tone: "primary",
      },
      {
        kind: "status",
        to: "RETURNED",
        label: "Mark returned",
        tone: "danger",
      },
    ]);
  });

  it("only offers status moves the state machine allows", () => {
    for (const status of PARCEL_STATUSES) {
      for (const action of getAgentActions(status)) {
        if (action.kind === "status")
          expect(canTransition(status, action.to)).toBe(true);
      }
    }
  });
});

describe("admin actions", () => {
  it("lets an admin confirm or cancel a pending shipment", () => {
    expect(getAdminActions("PENDING").map((action) => action.to)).toEqual([
      "CONFIRMED",
      "CANCELLED",
    ]);
  });

  it("only lets an admin cancel a confirmed shipment", () => {
    expect(getAdminActions("CONFIRMED").map((action) => action.to)).toEqual([
      "CANCELLED",
    ]);
  });

  it("offers nothing once a shipment is assigned or finished", () => {
    for (const status of [
      "ASSIGNED",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ] as const) {
      expect(getAdminActions(status)).toEqual([]);
    }
  });

  it("allows assignment only while pending or confirmed", () => {
    expect(canAssignAgent("PENDING")).toBe(true);
    expect(canAssignAgent("CONFIRMED")).toBe(true);
    expect(canAssignAgent("ASSIGNED")).toBe(false);
    expect(canAssignAgent("DELIVERED")).toBe(false);
  });
});
