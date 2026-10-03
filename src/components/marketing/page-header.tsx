import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  visual,
}: {
  eyebrow: string;
  title: string;
  description: string;
  visual?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-muted/30 py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[56px_56px] opacity-50 mask-[radial-gradient(ellipse_80%_90%_at_50%_0%,black,transparent)]"
      />
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "grid items-center gap-10",
            visual && "lg:grid-cols-[1.15fr_0.85fr]",
          )}
        >
          <div>
            <p className="animate-sd-fade text-sm font-semibold tracking-wide text-primary uppercase">
              {eyebrow}
            </p>
            <h1
              className="mt-3 max-w-2xl animate-sd-rise text-4xl font-extrabold tracking-tight sm:text-5xl"
              style={{ animationDelay: "80ms" }}
            >
              {title}
            </h1>
            <p
              className="mt-4 max-w-2xl animate-sd-rise text-lg text-muted-foreground"
              style={{ animationDelay: "160ms" }}
            >
              {description}
            </p>
          </div>
          {visual ? <div className="hidden lg:block">{visual}</div> : null}
        </div>
      </div>
    </section>
  );
}
