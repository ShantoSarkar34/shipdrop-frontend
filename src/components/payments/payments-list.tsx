"use client";

import { CreditCard } from "lucide-react";
import Link from "next/link";
import { FormError } from "@/components/forms/form-error";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PAYMENT_CURRENCY } from "@/config/currency";
import { PAYMENT_PAGE_LIMIT, usePaymentHistory } from "@/hooks/use-payments";
import { useUrlParams } from "@/hooks/use-url-params";
import { getErrorMessage } from "@/lib/api/errors";
import { formatDateTime, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PaymentsList() {
  const { searchParams, update } = useUrlParams();
  const parsed = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  const query = usePaymentHistory(page);

  const payments = query.data?.data ?? [];
  const meta = query.data?.meta;
  const showDate = payments.some((payment) => payment.createdAt);
  const showShipment = payments.some((payment) => payment.parcelId);

  let content;
  if (query.isPending) {
    content = <Skeleton className="h-64 w-full rounded-xl" />;
  } else if (query.isError && !query.data) {
    content = (
      <div className="space-y-3">
        <FormError>{getErrorMessage(query.error)}</FormError>
        <Button variant="outline" size="sm" onClick={() => query.refetch()}>
          Try again
        </Button>
      </div>
    );
  } else if (payments.length === 0) {
    content =
      page > 1 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments on this page"
          description="This page is past the end of your payment history."
          action={
            <Button onClick={() => update({ page: undefined })}>
              Go to the first page
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="Payments appear here after you pay for a shipment."
          action={
            <Link href="/dashboard/shipments" className={buttonVariants()}>
              View shipments
            </Link>
          }
        />
      );
  } else {
    content = (
      <>
        <TableShell>
          <ResponsiveTable>
            <RHead>
              <RHeadCell>Amount</RHeadCell>
              <RHeadCell>Status</RHeadCell>
              {showDate ? <RHeadCell>Date</RHeadCell> : null}
              {showShipment ? (
                <RHeadCell className="text-right">
                  <span className="sr-only">Shipment</span>
                </RHeadCell>
              ) : null}
            </RHead>
            <RBody>
              {payments.map((payment, index) => (
                <RRow key={payment.id ?? `${index}-${payment.amount}`}>
                  <RCell label="Amount" className="font-medium">
                    {formatMoney(
                      payment.amount,
                      payment.currency ?? PAYMENT_CURRENCY,
                    )}
                  </RCell>
                  <RCell label="Status">
                    <PaymentStatusBadge status={payment.status} />
                  </RCell>
                  {showDate ? (
                    <RCell label="Date">
                      {payment.createdAt
                        ? formatDateTime(payment.createdAt)
                        : "—"}
                    </RCell>
                  ) : null}
                  {showShipment ? (
                    <RCell label="" className="md:text-right">
                      {payment.parcelId ? (
                        <Link
                          href={`/dashboard/shipments/${payment.parcelId}`}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          View shipment
                        </Link>
                      ) : null}
                    </RCell>
                  ) : null}
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
            limit={meta.limit ?? PAYMENT_PAGE_LIMIT}
            onPageChange={(next) =>
              update({ page: next === 1 ? undefined : String(next) })
            }
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <p role="status" className="sr-only">
        {meta ? `${meta.total} payments found` : ""}
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
