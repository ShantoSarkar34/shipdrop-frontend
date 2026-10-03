import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BackdropImage } from "@/components/marketing/backdrop-image";
import { Reveal } from "@/components/marketing/reveal";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(" container mx-auto w-full px-4 sm:px-6 lg:px-8", className)}
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
      <Container>
        <Reveal>{children}</Reveal>
      </Container>
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
    <section className="relative isolate -mt-16 overflow-hidden bg-[#0b1020] pt-16 text-white">
      <BackdropImage className="object-[50%_70%]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(95deg,rgba(11,16,32,0.96)_0%,rgba(11,16,32,0.85)_55%,rgba(11,16,32,0.6)_100%)]"
      />
      <Container className="relative py-16 sm:py-24">
        <p className="animate-sd-fade text-sm font-semibold tracking-wide text-blue-300 uppercase">
          {eyebrow}
        </p>
        <h1
          className="mt-3 max-w-3xl animate-sd-rise text-4xl font-extrabold sm:text-5xl"
          style={{ animationDelay: "80ms" }}
        >
          {title}
        </h1>
        <p
          className="mt-4 max-w-2xl animate-sd-rise text-lg text-white/75"
          style={{ animationDelay: "160ms" }}
        >
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
