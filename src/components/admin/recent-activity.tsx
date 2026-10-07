"use client";

import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditLogs } from "@/hooks/use-admin";
import { formatAuditAction, shortId } from "@/lib/audit";
import { formatDateTime } from "@/lib/format";

export function RecentActivity() {
  const logs = useAuditLogs({ page: 1, limit: 6 });
  const items = logs.data?.data ?? [];

  return (
    <section
      aria-labelledby="activity-heading"
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <h2 id="activity-heading" className="text-lg font-bold">
          Recent activity
        </h2>
        <Link
          href="/admin/audit-logs"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="mt-4">
        {logs.isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : logs.isError ? (
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t load recent activity.
          </p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Important actions appear here as they happen.
          </p>
        ) : (
          <RevealGroup stagger={0.06}>
            <ol className="relative space-y-4 border-l border-border pl-5">
              {items.map((log) => (
                <li key={log.id}>
                  <RevealItem className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-6.25 size-2.5 rounded-full border-2 border-card bg-primary"
                    />
                    <p className="text-sm font-medium">
                      {formatAuditAction(log.action)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.entityType} ·{" "}
                      {log.entityType === "Parcel" ? (
                        <Link
                          href={`/admin/shipments/${log.entityId}`}
                          className="font-mono text-primary hover:underline"
                        >
                          {shortId(log.entityId)}
                        </Link>
                      ) : (
                        <span className="font-mono">
                          {shortId(log.entityId)}
                        </span>
                      )}{" "}
                      ·{" "}
                      <time dateTime={log.createdAt}>
                        {formatDateTime(log.createdAt)}
                      </time>
                    </p>
                  </RevealItem>
                </li>
              ))}
            </ol>
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
