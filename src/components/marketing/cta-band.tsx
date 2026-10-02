import Link from "next/link";
import { BackdropImage } from "@/components/marketing/backdrop-image";
import { Container } from "@/components/marketing/primitives";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBand({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="pb-16 sm:pb-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-2xl bg-[#0b1020] px-6 py-12 text-white sm:px-12 sm:py-16">
          <BackdropImage className="object-[50%_65%]" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(95deg,rgba(11,16,32,0.95)_0%,rgba(11,16,32,0.8)_55%,rgba(11,16,32,0.5)_100%)]"
          />
          <div className="relative max-w-xl space-y-4">
            <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
            <p className="text-white/75">{description}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-[#0b1020] hover:bg-white/90",
                )}
              >
                Create an account
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white dark:border-white/30 dark:bg-transparent dark:hover:bg-white/10",
                )}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
