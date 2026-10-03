import type { ParcelListParams } from "@/lib/api/parcels";
import type { ParcelStatus } from "@/lib/parcel-status";

export const queryKeys = {
  me: ["me"] as const,
  parcels: {
    all: ["parcels"] as const,
    count: (status?: ParcelStatus) =>
      ["parcels", "count", status ?? "all"] as const,
    list: (params: ParcelListParams) => ["parcels", "list", params] as const,
  },
};
