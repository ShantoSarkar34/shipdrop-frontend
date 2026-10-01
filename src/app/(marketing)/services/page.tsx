import { Ban, CircleAlert, Undo2 } from "lucide-react";
import { CtaBand } from "@/components/marketing/cta-band";
import { DefinitionRows, PageHero, Section, SectionHeading, SplitSection } from "@/components/marketing/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: "What SwiftDrop offers senders, delivery agents and operations teams, and how a parcel moves from booking to delivery.",
  path: "/services",
});

const SENDERS = [
  { title: "Book a shipment", description: "A guided form for sender, receiver, parcel and service details, with a review step before you submit." },
  { title: "Clear charges", description: "The delivery charge is calculated for you and shown on the shipment before you pay." },
  { title: "Tracking timeline", description: "Open any shipment to see every status change with its time and notes." },
  { title: "Payments and history", description: "Pay through Stripe Checkout and review your payment history in one place." },
  { title: "Saved pickup address", description: "Keep a default pickup address on your profile." },
  { title: "Cancel in time", description: "Cancel a shipment while it is still pending or confirmed." },
];

const AGENTS = [
  { title: "Your job queue", description: "See the deliveries assigned to you and accept or decline each one." },
  { title: "Step-by-step delivery", description: "Mark pickup, then move the parcel through transit to delivery. Only valid next steps are offered." },
  { title: "Availability", description: "Switch between available and offline. Being on a delivery is set automatically." },
  { title: "Earnings and analytics", description: "Follow what you've earned and how your deliveries are going." },
];

const OPERATIONS = [
  { title: "Shipment oversight", description: "Search, filter and sort every shipment, and open any one for its full history." },
  { title: "Agent assignment", description: "Assign an available delivery agent to a parcel." },
  { title: "User management", description: "Review accounts and suspend or reactivate them when needed." },
  { title: "Analytics and audit trail", description: "Shipment and revenue trends, plus a log of important actions." },
];

const JOURNEY = ["Pending", "Confirmed", "Assigned", "Picked up", "In transit", "Out for delivery", "Delivered"];

const EXCEPTIONS = [
  { icon: Ban, title: "Cancelled", text: "The customer cancelled before an agent picked the parcel up." },
  { icon: CircleAlert, title: "Failed delivery", text: "A delivery attempt didn't succeed. The parcel can go out again or be returned." },
  { icon: Undo2, title: "Returned", text: "The parcel was sent back after a failed delivery." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything a delivery needs, in one place"
        description="SwiftDrop gives senders, delivery agents and operations teams the tools for their part of the job."
      />

      <Section>
        <div className="space-y-20">
          <SplitSection eyebrow="For senders" title="Send and follow parcels">
            <DefinitionRows items={SENDERS} />
          </SplitSection>
          <SplitSection eyebrow="For delivery agents" title="Take jobs, deliver, get paid">
            <DefinitionRows items={AGENTS} />
          </SplitSection>
          <SplitSection eyebrow="For operations" title="Run the network">
            <DefinitionRows items={OPERATIONS} />
          </SplitSection>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="The parcel journey"
          title="Every step is recorded"
          description="A parcel moves through a fixed set of statuses, and only valid moves are allowed. Each change is added to its timeline."
        />
        <ol className="mt-10 flex flex-wrap items-center gap-2">
          {JOURNEY.map((status, index) => (
            <li key={status} className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium">{status}</span>
              {index < JOURNEY.length - 1 ? (
                <span aria-hidden="true" className="text-muted-foreground">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <h3 className="mt-12 text-xl font-bold">When things don&apos;t go to plan</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {EXCEPTIONS.map((item) => (
            <li key={item.title} className="rounded-xl border border-border bg-card p-5">
              <item.icon className="size-5 text-danger-fg" aria-hidden="true" />
              <p className="mt-3 font-display font-bold">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="Pick your workspace" description="Create a customer or delivery agent account, or sign in with a demo account." />
    </>
  );
}