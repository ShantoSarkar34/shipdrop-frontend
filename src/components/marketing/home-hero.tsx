import { ArrowRight, Check, Package, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { HeroShipmentCard } from "@/components/marketing/hero-shipment-card";
import { Container } from "@/components/marketing/primitives";
import { RouteAnimation } from "@/components/marketing/route-animation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HIGHLIGHTS = [
  "Server-calculated delivery charges",
  "Secure Stripe payments",
  "Complete shipment history",
];

export function HomeHero() {
  return (
    <section className="relative isolate -mt-5 md:-mt-16 overflow-hidden bg-(--cream)  text-foreground">
      {/* Soft decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-20 size-96 rounded-full bg-(--harvest)/15 blur-3xl" />
        <div className="absolute -right-32 top-32 size-128 rounded-full bg-(--forest)/10 blur-3xl" />

        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-(--forest)/20" />
      </div>

      {/* Existing route animation */}
      <RouteAnimation />

      <Container className="relative">
        <div className="grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
          {/* Left content */}
          <div className="max-w-2xl">
            <div className="animate-sd-fade inline-flex items-center gap-2 rounded-full border border-(--forest)/15 bg-white/70  dark:bg-white/90 px-3.5 py-1.5 text-sm font-medium text-(--forest) shadow-sm backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-harvest" />
              Courier &amp; logistics management
            </div>

            <h1
              className="mt-6 animate-sd-rise font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
              style={{ animationDelay: "80ms" }}
            >
              Move every parcel with{" "}
              <span className="text-primary">confidence.</span>
            </h1>

            <p
              className="mt-6 max-w-xl animate-sd-rise text-base leading-7 text-muted-foreground sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              Book deliveries, calculate charges, track every status change, and
              manage your entire courier workflow from one reliable platform.
            </p>

            <div
              className="mt-8 flex animate-sd-rise flex-wrap gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group rounded-xl bg-primary px-6 text-primary-foreground shadow-lg shadow-(--primary)/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--primary)/90 hover:shadow-xl hover:shadow-(--primary)/25",
                )}
              >
                Create an account
                <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-xl border-border bg-white/70 px-6 text-foreground backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-(--primary)/30 hover:bg-white",
                )}
              >
                See how it works
              </a>
            </div>

            <div
              className="mt-7 animate-sd-fade text-sm text-muted-foreground"
              style={{ animationDelay: "400ms" }}
            >
              Delivery agent?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Join the network
              </Link>
              <span className="mx-2 text-border">•</span>
              Already registered?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>

            {/* Feature mini-cards */}
            <div
              className="mt-10 grid max-w-xl grid-cols-1 gap-3 animate-sd-rise sm:grid-cols-3"
              style={{ animationDelay: "480ms" }}
            >
              <div className="rounded-2xl border border-border bg-white/70 dark:bg-white/5 p-4 shadow-sm backdrop-blur-sm">
                <Package className="size-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Easy booking</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Create shipments in a few simple steps.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 dark:bg-white/5 p-4 shadow-sm backdrop-blur-sm">
                <Truck className="size-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Live workflow</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Follow delivery progress from pickup to arrival.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-white/70 dark:bg-white/5 p-4 shadow-sm backdrop-blur-sm">
                <ShieldCheck className="size-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Secure payments</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Payments are handled securely through Stripe.
                </p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div
            className="relative flex animate-sd-rise items-center justify-center lg:justify-end"
            style={{ animationDelay: "180ms" }}
          >
            {/* Decorative glow behind shipment card */}
            <div
              aria-hidden="true"
              className="absolute right-4 top-1/2 size-72 -translate-y-1/2 rounded-full bg-(--harvest)/20 blur-3xl"
            />

            <div className="relative w-full flex justify-end ">
              <HeroShipmentCard />
            </div>
          </div>
        </div>

        {/* Trust / highlights */}
        <div className="border-t border-border py-6">
          <ul className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            {HIGHLIGHTS.map((text) => (
              <li
                key={text}
                className="flex items-center justify-center gap-2 sm:justify-start"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft">
                  <Check className="size-3 text-success" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
