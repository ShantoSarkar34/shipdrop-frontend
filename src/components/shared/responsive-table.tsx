import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="md:overflow-x-auto md:rounded-xl md:border md:border-border md:bg-card">
      {children}
    </div>
  );
}

export function ResponsiveTable({
  className,
  ...props
}: ComponentProps<"table">) {
  return (
    <table
      className={cn("w-full text-sm md:border-collapse", className)}
      {...props}
    />
  );
}

export function RHead({ children }: { children: ReactNode }) {
  return (
    <thead className="hidden md:table-header-group">
      <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
        {children}
      </tr>
    </thead>
  );
}

export function RHeadCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th scope="col" className={cn("px-4 py-3 font-medium", className)}>
      {children}
    </th>
  );
}

export function RBody({ children }: { children: ReactNode }) {
  return (
    <tbody className="block space-y-3 md:table-row-group md:space-y-0">
      {children}
    </tbody>
  );
}

export function RRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "block rounded-xl border border-border bg-card p-4 md:table-row md:rounded-none md:border-0 md:border-b md:bg-transparent md:p-0 md:last:border-b-0",
        className,
      )}
    >
      {children}
    </tr>
  );
}

/** On phones the label is printed above the value. On wide screens the header row does that job. */
export function RCell({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <td
      data-label={label}
      className={cn(
        "block py-1.5 align-top before:mb-0.5 before:block before:text-xs before:text-muted-foreground before:content-[attr(data-label)] md:table-cell md:px-4 md:py-3 md:before:hidden",
        className,
      )}
    >
      {children}
    </td>
  );
}
