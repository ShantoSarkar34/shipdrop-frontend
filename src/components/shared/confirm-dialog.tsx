"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  dismissLabel = "Go back",
  pending,
  destructive,
  children,
  onConfirm,
  onDismiss,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  dismissLabel?: string;
  pending?: boolean;
  destructive?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        if (pending) event.preventDefault();
      }}
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) onDismiss();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground backdrop:bg-black/50"
    >
      <h2 id={titleId} className="text-lg font-bold">
        {title}
      </h2>
      <p id={descriptionId} className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onDismiss} disabled={pending}>
          {dismissLabel}
        </Button>
        <Button
          variant={destructive ? "destructive" : "default"}
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : null}
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
