import type { ReactNode } from "react";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

const SPACING = {
  sm: "py-16",
  md: "py-16 sm:py-20",
  lg: "py-16 sm:py-24",
} as const;

export function PageSection({
  id,
  tone,
  spacing = "md",
  reveal = true,
  className,
  children,
}: {
  id?: string;
  tone?: "muted";
  spacing?: keyof typeof SPACING;
  reveal?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20",
        SPACING[spacing],
        tone === "muted" && "border-y border-border bg-muted/40",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        {reveal ? <Reveal>{children}</Reveal> : children}
      </div>
    </section>
  );
}
