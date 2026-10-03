import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="CUSTOMER">
      <AppShell area="customer">{children}</AppShell>
    </RoleGuard>
  );
}