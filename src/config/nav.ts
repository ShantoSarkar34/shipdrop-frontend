import {
  Activity,
  CreditCard,
  LayoutDashboard,
  type LucideIcon,
  Package,
  PackagePlus,
  ScrollText,
  Truck,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

export type Area = "customer" | "provider" | "admin";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const AREA_LABEL: Record<Area, string> = {
  customer: "Customer",
  provider: "Delivery agent",
  admin: "Admin",
};

export const NAV_BY_AREA: Record<Area, readonly NavItem[]> = {
  customer: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/shipments", label: "Shipments", icon: Package },
    { href: "/dashboard/shipments/new", label: "Create Shipment", icon: PackagePlus },
    { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ],
  provider: [
    { href: "/provider", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider/deliveries", label: "Deliveries", icon: Truck },
    { href: "/provider/earnings", label: "Earnings", icon: Wallet },
    { href: "/provider/analytics", label: "Analytics", icon: Activity },
    { href: "/provider/profile", label: "Profile", icon: UserRound },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/shipments", label: "Shipments", icon: Package },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: Activity },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    { href: "/admin/profile", label: "Profile", icon: UserRound },
  ],
};