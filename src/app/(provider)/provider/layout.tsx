import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard role="DELIVERY_AGENT">{children}</RoleGuard>;
}