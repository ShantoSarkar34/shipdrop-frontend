"use client";

import { useId, type ComponentProps } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps extends ComponentProps<typeof Textarea> {
  label: string;
  error?: string;
}

export function TextareaField({ label, error, id, ...props }: TextareaFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <Textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}