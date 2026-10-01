import type { Role } from "@/types/user";

export const ROLE_HOME: Record<Role, string> = {
  CUSTOMER: "/dashboard",
  DELIVERY_AGENT: "/provider",
  ADMIN: "/admin",
};

export const ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: "Customer",
  DELIVERY_AGENT: "Delivery agent",
  ADMIN: "Admin",
};
