import Link from "next/link";
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
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-14">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
              <p className="mt-3 text-primary-foreground/80">{description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={primary.href}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  })}
                >
                  {primary.label}
                </Link>
                {secondary ? (
                  <Link
                    href={secondary.href}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-primary-foreground/40 dark:bg-transparent dark:hover:bg-primary-foreground/10",
                    )}
                  >
                    {secondary.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
