import type { Metadata } from "next";
import { Check } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/marketing/cta-band";
import { Faq } from "@/components/marketing/faq";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/marketing/primitives";
import { ShipmentPreview } from "@/components/marketing/shipment-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute: "SwiftDrop — Courier delivery with a clear tracking timeline",
  },
  description:
    "Book a parcel, see the exact delivery charge before you pay, and follow every status change. SwiftDrop connects customers, delivery agents and operations in one platform.",
  alternates: { canonical: "/" },
};

const STEPS = [
  {
    title: "Book",
    text: "Enter sender, receiver and parcel details. The delivery charge is calculated for you.",
  },
  {
    title: "Pay",
    text: "Check the charge, then pay on Stripe's secure checkout page.",
  },
  {
    title: "Follow",
    text: "Your shipment is confirmed and assigned to an agent. Each step lands on your timeline.",
  },
  {
    title: "Delivered",
    text: "The agent completes the delivery and the shipment is marked delivered. Problems are recorded too.",
  },
];

const ROLES = [
  {
    title: "Customers",
    text: "Send parcels and keep an eye on them.",
    points: [
      "Book a pickup with a guided, step-by-step form",
      "See the delivery charge before you pay",
      "Follow every status change on a timeline",
      "Cancel while a shipment is pending or confirmed",
    ],
  },
  {
    title: "Delivery agents",
    text: "Take jobs and move parcels along.",
    points: [
      "Accept or decline assigned deliveries",
      "Only valid next steps are offered at each stage",
      "Switch between available and offline",
      "Follow your earnings and delivery performance",
    ],
  },
  {
    title: "Operations",
    text: "Keep the whole network running.",
    points: [
      "Search, filter and review every shipment",
      "Assign available agents to parcels",
      "Suspend or reactivate accounts",
      "Review analytics and an audit trail",
    ],
  },
];

const PRICE_FACTORS = [
  {
    title: "Weight",
    text: "You enter the parcel's weight in kilograms when you book.",
  },
  {
    title: "Service type",
    text: "The service you choose, such as Express, is part of the calculation.",
  },
  {
    title: "Route",
    text: "Pickup and delivery cities are mapped to zones, and the route between them matters.",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I track a shipment?",
    a: "Sign in and open the shipment from your dashboard. Its timeline lists every status change with the time and any note the agent added.",
  },
  {
    q: "Can I cancel a shipment?",
    a: "Yes, while it is still pending or confirmed. Once it has been assigned to an agent or picked up, cancellation is no longer available.",
  },
  {
    q: "When is my payment confirmed?",
    a: "Payments run through Stripe Checkout. A shipment is marked paid only after Stripe confirms the payment to our servers, which happens shortly after you return to the site.",
  },
  {
    q: "What happens if a delivery fails?",
    a: "The agent records the failed attempt, and the parcel can be sent out again or returned. Every outcome is added to the shipment's timeline.",
  },
  {
    q: "How do delivery agents earn?",
    a: "Agents earn a commission on the delivery charge for each delivered and paid shipment. Earnings are shown on the agent dashboard.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-hero-glow">
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Courier &amp; logistics management
            </p>
            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Courier delivery you can follow from pickup to doorstep.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Book a parcel, see the exact delivery charge before you pay, and
              follow every status change on a clear timeline. Agents and
              operations work from the same record.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className={buttonVariants({ size: "lg" })}>
                Create an account
              </Link>
              <a
                href="#how-it-works"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                See how it works
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Delivery agent?{" "}
              <Link
                href="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Join as an agent
              </Link>
              . Just looking?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Try a demo account
              </Link>
              .
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <ShipmentPreview />
          </div>
        </Container>
      </section>

      <Section id="how-it-works">
        <SectionHeading
          eyebrow="How it works"
          title="From booking to delivered, in four steps"
        />
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="border-t-2 border-primary pt-4">
              <p className="font-mono text-sm text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Who it's for"
          title="One platform, three workspaces"
          description="Customers, delivery agents and administrators each get a workspace built for their job. All three run on the same backend, and each role sees only what it should."
        />
        <div className="mt-12 grid divide-y divide-border overflow-hidden rounded-xl border border-border bg-card md:grid-cols-3 md:divide-x md:divide-y-0">
          {ROLES.map((role) => (
            <div key={role.title} className="p-6">
              <h3 className="text-xl font-bold">{role.title}</h3>
              <p className="mt-1 text-muted-foreground">{role.text}</p>
              <ul className="mt-5 space-y-3">
                {role.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Pricing"
          title="A charge you can understand"
          description="SwiftDrop calculates every delivery charge on the server from three things. You never type a price, and you see the exact amount on your shipment before you pay."
        />
        <dl className="mt-10 grid gap-6 sm:grid-cols-3">
          {PRICE_FACTORS.map((factor) => (
            <div
              key={factor.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <dt className="font-display text-lg font-bold">{factor.title}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {factor.text}
              </dd>
            </div>
          ))}
        </dl>
        <Link
          href="/pricing"
          className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          How pricing works
        </Link>
      </Section>

      <Section tone="muted">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Payments"
            title="Paid means paid"
            description="Checkout happens on Stripe's secure page. Coming back to SwiftDrop isn't treated as proof of payment: a shipment is marked paid only once Stripe confirms it to our servers."
          />
          <ol className="space-y-3 rounded-xl border border-border bg-card p-6">
            {[
              "You complete checkout on Stripe",
              "Stripe confirms the payment to SwiftDrop's servers",
              "Your shipment is marked as paid",
            ].map((text, index) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success-soft font-mono text-xs font-medium text-success-fg"
                >
                  {index + 1}
                </span>
                {text}
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <Faq items={FAQ_ITEMS} />
        </div>
      </Section>

      <CtaBand
        title="Ready to send your first parcel?"
        description="Create an account and book a shipment in a few minutes. Delivery agents can sign up the same way."
      />
    </>
  );
}
