import { cn } from "@/lib/utils";

// Placeholder mark: replace the letter (or this whole file) with the final logo.
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg bg-brand-gradient font-display text-base font-extrabold text-primary-foreground",
        className,
      )}
    >
      S
    </span>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark ? (
        <span className="font-display text-lg font-extrabold tracking-tight">SwiftDrop</span>
      ) : (
        <span className="sr-only">SwiftDrop</span>
      )}
    </span>
  );
}