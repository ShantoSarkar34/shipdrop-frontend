import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="DELIVERY_AGENT">
      <AppShell area="provider">{children}</AppShell>
    </RoleGuard>
  );
}
