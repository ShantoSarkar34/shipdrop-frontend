import Link from "next/link";
import { BackdropImage } from "@/components/marketing/backdrop-image";
import { Container } from "@/components/marketing/primitives";
import { Reveal } from "@/components/marketing/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaLink {
  label: string;
  href: string;
}

export function CtaSection({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: CtaLink;
  secondary?: CtaLink;
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[1.75rem] px-6 py-12 text-white shadow-xl sm:px-10 sm:py-16 lg:px-14">
            <BackdropImage className="object-cover object-center" />

            {/* Background overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#123d2b]/80"
            />

            {/* Subtle brand glow */}
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 size-72 rounded-full bg-(--harvest)/15 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-32 -left-24 size-80 rounded-full bg-primary/20 blur-3xl"
            />

            {/* Content */}
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-display text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                {description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={primary.href}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group bg-(--harvest) text-(--harvest-foreground) shadow-lg shadow-black/10 hover:bg-(--harvest)/90",
                  )}
                >
                  {primary.label}
                </Link>

                {secondary ? (
                  <Link
                    href={secondary.href}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "lg",
                      }),
                      "border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {secondary.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
