import { describe, expect, it } from "vitest";
import type { AdminStats } from "@/lib/api/admin";
import {
  completionRate,
  mergeDailySeries,
  pipelineProfile,
  platformHealth,
  ratio,
} from "./chart-data";

const stats = (
  overrides: Partial<{ [K in keyof AdminStats]: Partial<AdminStats[K]> }> = {},
): AdminStats => ({
  users: {
    total: 0,
    customers: 0,
    deliveryAgents: 0,
    admins: 0,
    active: 0,
    suspended: 0,
    ...overrides.users,
  },
  parcels: {
    total: 0,
    pending: 0,
    confirmed: 0,
    assigned: 0,
    pickedUp: 0,
    inTransit: 0,
    outForDelivery: 0,
    delivered: 0,
    failedDelivery: 0,
    returned: 0,
    cancelled: 0,
    ...overrides.parcels,
  },
  payments: { total: 0, paid: 0, pending: 0, failed: 0, ...overrides.payments },
  revenue: { total: 0, ...overrides.revenue },
});

describe("ratio and completionRate", () => {
  it("is 0 when there is nothing to divide by", () => {
    expect(ratio(5, 0)).toBe(0);
    expect(completionRate(0, 0, 0)).toBe(0);
  });

  it("stays between 0 and 1", () => {
    expect(ratio(12, 10)).toBe(1);
    expect(ratio(-3, 10)).toBe(0);
  });

  it("compares completed deliveries with all finished ones", () => {
    expect(completionRate(6, 2, 2)).toBeCloseTo(0.6);
  });
});

describe("mergeDailySeries", () => {
  it("joins by date, fills gaps with 0 and sorts", () => {
    const merged = mergeDailySeries(
      [
        { date: "2026-09-03", count: 4 },
        { date: "2026-09-01", count: 1 },
      ],
      [
        { date: "2026-09-03", amount: 300 },
        { date: "2026-09-02", amount: 50 },
      ],
    );
    expect(merged).toEqual([
      { date: "2026-09-01", count: 1, amount: 0 },
      { date: "2026-09-02", count: 0, amount: 50 },
      { date: "2026-09-03", count: 4, amount: 300 },
    ]);
  });
});

describe("platformHealth", () => {
  it("is all zeros with no data", () => {
    expect(platformHealth(stats()).every((item) => item.value === 0)).toBe(
      true,
    );
  });

  it("computes each measure from the counts", () => {
    const health = platformHealth(
      stats({
        users: { total: 10, active: 9 },
        parcels: {
          total: 10,
          pending: 1,
          confirmed: 1,
          delivered: 5,
          failedDelivery: 1,
          returned: 1,
          cancelled: 1,
        },
        payments: { total: 4, paid: 3 },
      }),
    );
    expect(
      Object.fromEntries(health.map((item) => [item.label, item.value])),
    ).toEqual({
      Delivered: 50,
      Progressing: 80,
      "Payments settled": 75,
      "Active accounts": 90,
      "Clean shipments": 70,
    });
  });
});

describe("pipelineProfile", () => {
  it("groups the statuses into six axes", () => {
    const profile = pipelineProfile([
      { status: "PENDING", count: 2 },
      { status: "IN_TRANSIT", count: 3 },
      { status: "OUT_FOR_DELIVERY", count: 1 },
      { status: "DELIVERED", count: 7 },
      { status: "FAILED_DELIVERY", count: 1 },
      { status: "CANCELLED", count: 2 },
    ]);
    expect(profile.map((axis) => axis.label)).toEqual([
      "Pending",
      "Confirmed",
      "Assigned",
      "On the move",
      "Delivered",
      "Problems",
    ]);
    expect(profile.map((axis) => axis.value)).toEqual([2, 0, 0, 4, 7, 3]);
  });
});
