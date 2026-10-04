"use client";

import { ScrollText, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type ChangeEvent } from "react";
import { FormError } from "@/components/forms/form-error";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import {
  RBody,
  RCell,
  RHead,
  RHeadCell,
  RRow,
  ResponsiveTable,
  TableShell,
} from "@/components/shared/responsive-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuditLogs } from "@/hooks/use-admin";
import {
  AUDIT_PAGE_LIMIT,
  useAuditLogParams,
} from "@/hooks/use-admin-list-params";
import type { AuditLog } from "@/lib/api/admin";
import { formatAuditAction, shortId, summarizeMetadata } from "@/lib/audit";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

// Suggestions only: the filter accepts any exact action name.
const KNOWN_ACTIONS = ["SHIPMENT_CREATED", "USER_STATUS_CHANGED"];

function MetadataCell({ metadata }: { metadata: unknown }) {
  const { shown, rest } = summarizeMetadata(metadata);
  if (shown.length === 0)
    return <span className="text-muted-foreground">—</span>;

  const rows = (entries: [string, string][]) =>
    entries.map(([key, value]) => (
      <div key={key} className="flex gap-1.5">
        <dt className="shrink-0 text-muted-foreground">{key}:</dt>
        <dd className="font-mono break-all">{value}</dd>
      </div>
    ));

  return (
    <div className="space-y-1">
      <dl className="space-y-0.5 text-xs">{rows(shown)}</dl>
      {rest.length > 0 ? (
        <details className="text-xs">
          <summary className="cursor-pointer text-primary">
            +{rest.length} more
          </summary>
          <dl className="mt-1 space-y-0.5">{rows(rest)}</dl>
        </details>
      ) : null}
    </div>
  );
}

function EntityCell({ log }: { log: AuditLog }) {
  const label = (
    <>
      {log.entityType} ·{" "}
      <span className="font-mono text-xs">{shortId(log.entityId)}</span>
    </>
  );
  if (log.entityType === "Parcel") {
    return (
      <Link
        href={`/admin/shipments/${log.entityId}`}
        className="text-primary underline-offset-4 hover:underline"
      >
        {label}
      </Link>
    );
  }
  return <span>{label}</span>;
}

export function AuditLogsList() {
  const { state, update } = useAuditLogParams();
  const query = useAuditLogs({
    page: state.page,
    limit: AUDIT_PAGE_LIMIT,
    action: state.action || undefined,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const input = inputRef.current;
    if (
      input &&
      document.activeElement !== input &&
      input.value !== state.action
    )
      input.value = state.action;
  }, [state.action]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onActionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => update({ action: value.trim() || undefined }, { replace: true }),
      400,
    );
  };

  const logs = query.data?.data ?? [];
  const meta = query.data?.meta;

  let content;
  if (query.isPending) {
    content = <Skeleton className="h-96 w-full rounded-xl" />;
  } else if (query.isError && !query.data) {
    content = (
      <div className="space-y-3">
        <FormError>{getErrorMessage(query.error)}</FormError>
        <Button variant="outline" size="sm" onClick={() => query.refetch()}>
          Try again
        </Button>
      </div>
    );
  } else if (logs.length === 0) {
    content = (
      <EmptyState
        icon={ScrollText}
        title="No audit entries"
        description={
          state.action
            ? "No entries match this action."
            : "Important actions are recorded here as they happen."
        }
        action={
          state.action ? (
            <Button onClick={() => update({ action: undefined })}>
              Clear filter
            </Button>
          ) : undefined
        }
      />
    );
  } else {
    content = (
      <>
        <TableShell>
          <ResponsiveTable>
            <RHead>
              <RHeadCell>When</RHeadCell>
              <RHeadCell>Action</RHeadCell>
              <RHeadCell>Entity</RHeadCell>
              <RHeadCell>Actor</RHeadCell>
              <RHeadCell>Details</RHeadCell>
            </RHead>
            <RBody>
              {logs.map((log) => (
                <RRow key={log.id}>
                  <RCell label="When" className="whitespace-nowrap">
                    <time dateTime={log.createdAt}>
                      {formatDateTime(log.createdAt)}
                    </time>
                  </RCell>
                  <RCell label="Action">
                    <p className="font-medium">
                      {formatAuditAction(log.action)}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {log.action}
                    </p>
                  </RCell>
                  <RCell label="Entity">
                    <EntityCell log={log} />
                  </RCell>
                  <RCell label="Actor">
                    <span className="font-mono text-xs" title={log.actorId}>
                      {shortId(log.actorId)}
                    </span>
                  </RCell>
                  <RCell label="Details">
                    <MetadataCell metadata={log.metadata} />
                  </RCell>
                </RRow>
              ))}
            </RBody>
          </ResponsiveTable>
        </TableShell>
        {meta ? (
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={(page) =>
              update({
                page: page === 1 ? undefined : String(page),
                action: state.action || undefined,
              })
            }
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="mb-6 max-w-md">
        <label
          htmlFor="audit-action"
          className="mb-1.5 block text-sm font-medium"
        >
          Filter by action
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="audit-action"
            ref={inputRef}
            type="search"
            list="audit-actions"
            defaultValue={state.action}
            onChange={onActionChange}
            placeholder="For example SHIPMENT_CREATED"
            aria-describedby="audit-action-hint"
            className="pl-9"
          />
          <datalist id="audit-actions">
            {KNOWN_ACTIONS.map((action) => (
              <option key={action} value={action} />
            ))}
          </datalist>
        </div>
        <p
          id="audit-action-hint"
          className="mt-1.5 text-xs text-muted-foreground"
        >
          Type an exact action name. The actor column shows the first part of
          the user&apos;s ID.
        </p>
      </div>

      <p role="status" className="sr-only">
        {meta ? `${meta.total} entries found` : ""}
      </p>
      <div
        aria-busy={query.isFetching}
        className={cn(
          "transition-opacity",
          query.isPlaceholderData && "opacity-60",
        )}
      >
        {content}
      </div>
    </>
  );
}
