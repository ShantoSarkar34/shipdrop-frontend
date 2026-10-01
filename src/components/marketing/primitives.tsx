import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  tone,
  className,
  children,
}: {
  id?: string;
  tone?: "muted";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-16 sm:py-24",
        tone === "muted" && "border-y border-border bg-secondary/50",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold tracking-wide text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-lg text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

/** Heading on the left, content on the right (stacked on small screens). */
export function SplitSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div>{children}</div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-border/60 bg-hero-glow">
      <Container className="py-16 sm:py-20">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
      </Container>
    </section>
  );
}

export function DefinitionRows({
  items,
}: {
  items: readonly { title: string; description: string }[];
}) {
  return (
    <dl className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <div
          key={item.title}
          className="grid gap-1 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8"
        >
          <dt className="font-display font-bold">{item.title}</dt>
          <dd className="text-muted-foreground">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
