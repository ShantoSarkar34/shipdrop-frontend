import { Check } from "lucide-react";
import Link from "next/link";
import { BackdropImage } from "@/components/marketing/backdrop-image";
import { HeroShipmentCard } from "@/components/marketing/hero-shipment-card";
import { Container } from "@/components/marketing/primitives";
import { RouteAnimation } from "@/components/marketing/route-animation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HIGHLIGHTS = [
  "Charges calculated by the server",
  "Payments confirmed by Stripe",
  "Every status change recorded",
];

export function HomeHero() {
  return (
    <section className="relative isolate -mt-16 overflow-hidden bg-[#0b1020] pt-16 text-white">
      <BackdropImage priority />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(95deg,rgba(11,16,32,0.95)_0%,rgba(11,16,32,0.82)_45%,rgba(11,16,32,0.4)_100%)]"
      />
      <RouteAnimation />

      <Container className="relative">
        <div className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
          <div>
            <p className="animate-sd-fade text-sm font-semibold tracking-wide text-blue-300 uppercase">
              Courier &amp; logistics management
            </p>
            <h1
              className="mt-4 animate-sd-rise text-4xl font-extrabold sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "80ms" }}
            >
              Courier delivery you can follow from pickup to doorstep.
            </h1>
            <p
              className="mt-5 max-w-xl animate-sd-rise text-lg text-white/75"
              style={{ animationDelay: "160ms" }}
            >
              Book a parcel, see the exact delivery charge before you pay, and
              follow every status change on a clear timeline. Agents and
              operations work from the same record.
            </p>
            <div
              className="mt-8 flex animate-sd-rise flex-wrap gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-[#0b1020] hover:bg-white/90",
                )}
              >
                Create an account
              </Link>
              <a
                href="#how-it-works"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white dark:border-white/30 dark:bg-transparent dark:hover:bg-white/10",
                )}
              >
                See how it works
              </a>
            </div>
            <p
              className="mt-6 animate-sd-fade text-sm text-white/70"
              style={{ animationDelay: "400ms" }}
            >
              Delivery agent?{" "}
              <Link
                href="/register"
                className="font-medium text-white underline-offset-4 hover:underline"
              >
                Join as an agent
              </Link>
              . Just looking?{" "}
              <Link
                href="/login"
                className="font-medium text-white underline-offset-4 hover:underline"
              >
                Try a demo account
              </Link>
              .
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroShipmentCard />
          </div>
        </div>

        <ul className="grid gap-3 border-t border-white/15 py-6 text-sm text-white/80 sm:grid-cols-3">
          {HIGHLIGHTS.map((text) => (
            <li key={text} className="flex items-center gap-2">
              <Check
                className="size-4 shrink-0 text-emerald-300"
                aria-hidden="true"
              />
              {text}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
