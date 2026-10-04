import type { Metadata } from "next";
import { Suspense } from "react";
import { AuditLogsList } from "@/components/admin/audit-logs-list";
import { PageHeading } from "@/components/layout/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Audit logs" };

export default function AuditLogsPage() {
  return (
    <>
      <PageHeading
        title="Audit logs"
        description="A record of important actions on the platform."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <AuditLogsList />
      </Suspense>
    </>
  );
}
