import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/marketing/cta-band";
import { Faq } from "@/components/marketing/faq";
import { HomeHero } from "@/components/marketing/home-hero";
import { Section, SectionHeading } from "@/components/marketing/primitives";
import {
  RevealBar,
  RevealGroup,
  RevealItem,
} from "@/components/marketing/reveal";
import { RolesShowcase } from "@/components/marketing/roles-showcase";

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

const PAYMENT_STEPS = [
  "You complete checkout on Stripe",
  "Stripe confirms the payment to SwiftDrop's servers",
  "Your shipment is marked as paid",
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
      <HomeHero />

      <Section id="how-it-works">
        <SectionHeading
          eyebrow="How it works"
          title="From booking to delivered, in four steps"
        />
        <RevealGroup stagger={0.2} className="mt-12">
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <RevealItem>
                  <div className="h-0.5 bg-border">
                    <RevealBar className="h-full bg-primary" />
                  </div>
                  <p className="mt-4 font-mono text-sm text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.text}</p>
                </RevealItem>
              </li>
            ))}
          </ol>
        </RevealGroup>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Who it's for"
          title="One platform, three workspaces"
          description="Customers, delivery agents and administrators each get a workspace built for their job. All three run on the same backend, and each role sees only what it should."
        />
        <div className="mt-10">
          <RolesShowcase />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Pricing"
          title="A charge you can understand"
          description="SwiftDrop calculates every delivery charge on the server from three things. You never type a price, and you see the exact amount on your shipment before you pay."
        />
        <RevealGroup stagger={0.12} className="mt-10">
          <dl className="grid gap-6 sm:grid-cols-3">
            {PRICE_FACTORS.map((factor) => (
              <RevealItem
                key={factor.title}
                className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <dt className="font-display text-lg font-bold">
                  {factor.title}
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {factor.text}
                </dd>
              </RevealItem>
            ))}
          </dl>
        </RevealGroup>
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
          <RevealGroup stagger={0.35}>
            <ol className="space-y-3 rounded-xl border border-border bg-card p-6">
              {PAYMENT_STEPS.map((text, index) => (
                <li key={text}>
                  <RevealItem className="flex items-center gap-3 text-sm">
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success-soft font-mono text-xs font-medium text-success-fg"
                    >
                      {index + 1}
                    </span>
                    {text}
                  </RevealItem>
                </li>
              ))}
            </ol>
          </RevealGroup>
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
