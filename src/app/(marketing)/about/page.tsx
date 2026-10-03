import {
  BadgeCheck,
  Eye,
  Gauge,
  Layers,
  LayoutDashboard,
  MapPin,
  PackagePlus,
  ShieldCheck,
  Truck,
  UserRound,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHeader } from "@/components/marketing/page-header";
import { RouteVisual } from "@/components/marketing/page-visuals";
import { PageSection } from "@/components/marketing/page-section";
import { SectionHeading } from "@/components/marketing/primitives";
import { ProcessFlow, type FlowStep } from "@/components/marketing/process-flow";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { CREATE_SHIPMENT_HREF } from "@/config/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About SwiftDrop | Courier & Logistics Platform",
  description:
    "SwiftDrop is a courier and logistics management platform that connects customers, delivery agents and administrators through one shared shipment record.",
  path: "/about",
});

const HOW_IT_WORKS: readonly FlowStep[] = [
  { icon: PackagePlus, title: "Create", description: "A customer creates a shipment with sender, receiver and parcel details." },
  { icon: BadgeCheck, title: "Confirm", description: "Payment and shipment confirmation are processed." },
  { icon: Truck, title: "Deliver", description: "A delivery agent handles pickup and delivery." },
  { icon: MapPin, title: "Track", description: "Shipment progress can be monitored through status updates." },
];

const ROLES = [
  {
    icon: UserRound,
    name: "Customers",
    summary: "Create shipments, make payments, track parcels, and manage delivery history.",
    capabilities: ["Create shipments", "Pay online", "Track parcels", "Review delivery history"],
    cta: { label: "Create a customer account", href: "/register" },
  },
  {
    icon: Truck,
    name: "Delivery agents",
    summary: "Manage availability, accept deliveries, update shipment status, and monitor earnings.",
    capabilities: ["Set availability", "Accept deliveries", "Update shipment status", "Monitor earnings"],
    cta: { label: "Join as a delivery agent", href: "/register" },
  },
  {
    icon: LayoutDashboard,
    name: "Administrators",
    summary: "Manage users, assign deliveries, monitor shipments, and view operational analytics.",
    capabilities: ["Manage users", "Assign deliveries", "Monitor shipments", "View analytics"],
    note: "Administrator access is not available through public sign-up.",
  },
] as const;

const PRINCIPLES = [
  { icon: Eye, title: "Transparency", description: "Clear shipment status and tracking, so everyone can see where a parcel stands." },
  { icon: Workflow, title: "Reliability", description: "Structured delivery workflows, with only valid next steps available at each stage." },
  { icon: ShieldCheck, title: "Security", description: "Authenticated, role-based access, so each user reaches only their own workspace." },
  { icon: Gauge, title: "Efficiency", description: "Centralized management of shipments, assignments and payments for logistics operations." },
] as const;

function PlatformDiagram() {
  const roles = [
    { icon: UserRound, label: "Customers", note: "Create and pay for shipments" },
    { icon: Truck, label: "Delivery agents", note: "Pick up and deliver" },
    { icon: LayoutDashboard, label: "Administrators", note: "Assign and oversee" },
  ];

  return (
    <figure
      role="img"
      aria-label="Diagram: customers, delivery agents and administrators all work from the same SwiftDrop shipment record"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div key={role.label} className="rounded-lg border border-border bg-background p-3 text-center">
              <Icon className="mx-auto size-5 text-primary" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium">{role.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{role.note}</p>
            </div>
          );
        })}
      </div>
      <div aria-hidden="true" className="hidden justify-around px-10 sm:flex">
        <span className="h-6 w-px bg-border" />
        <span className="h-6 w-px bg-border" />
        <span className="h-6 w-px bg-border" />
      </div>
      <div className="mt-3 rounded-lg border border-primary/40 bg-primary/5 p-4 text-center sm:mt-0">
        <Layers className="mx-auto size-5 text-primary" aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold">SwiftDrop platform</p>
        <p className="mt-0.5 text-xs text-muted-foreground">One shared shipment record</p>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {["Shipments", "Payments", "Status history", "Analytics"].map((item) => (
            <li key={item} className="rounded-md border border-border bg-card px-2 py-0.5 text-xs">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-4 text-xs text-muted-foreground">Illustration of how the three roles share one system.</figcaption>
    </figure>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About SwiftDrop"
        title="Simplifying Every Step of Delivery"
        description="SwiftDrop is a courier and logistics management platform that connects customers, delivery agents and administrators through one system, so every shipment is handled from a single, shared record."
        visual={<RouteVisual />}
      />

      <PageSection>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="What is SwiftDrop?" title="One platform for the whole delivery" />
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Sending a parcel involves several people: the customer who books it, the agent who delivers it, and the
                team that keeps operations running. SwiftDrop gives each of them a workspace on the same shipment record.
              </p>
              <p>
                Customers can create and manage shipments. Delivery agents manage their assigned deliveries and update
                shipment status as they go.
              </p>
              <p>
                Administrators manage users, shipments, assignments, payments and operational analytics from one place.
              </p>
            </div>
          </div>
          <PlatformDiagram />
        </div>
      </PageSection>

      <PageSection tone="muted">
        <SectionHeading eyebrow="How SwiftDrop works" title="From a new shipment to a tracked delivery" />
        <div className="mt-12">
          <ProcessFlow steps={HOW_IT_WORKS} label="How SwiftDrop works" />
        </div>
      </PageSection>

      <PageSection>
        <SectionHeading
          eyebrow="Built around three roles"
          title="A workspace for every role"
          description="Each role has its own area of the platform, with the tools its job needs."
        />
        <RevealGroup stagger={0.12} className="mt-10 divide-y divide-border border-y border-border">
          {ROLES.map((role, index) => {
            const Icon = role.icon;
            return (
              <RevealItem key={role.name} className="grid gap-5 py-8 md:grid-cols-[15rem_1fr] md:gap-10">
                <div className="flex items-start gap-4">
                  <span className="pt-1 font-mono text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-xl font-bold">{role.name}</h3>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">{role.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {role.capabilities.map((capability) => (
                      <li key={capability} className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium">
                        {capability}
                      </li>
                    ))}
                  </ul>
                  {"cta" in role ? (
                    <Link href={role.cta.href} className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
                      {role.cta.label}
                    </Link>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">{role.note}</p>
                  )}
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </PageSection>

      <PageSection tone="muted">
        <SectionHeading eyebrow="Platform principles" title="What the platform is designed around" />
        <RevealGroup stagger={0.1} className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((principle) => {
            const Icon = principle.icon;
            return (
              <RevealItem key={principle.title} className="border-t-2 border-primary pt-4">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-bold">{principle.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{principle.description}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </PageSection>

      <CtaSection
        title="Ready to simplify your delivery workflow?"
        description="Create an account to book your first shipment, or explore what the platform offers."
        primary={{ label: "Create a Shipment", href: CREATE_SHIPMENT_HREF }}
        secondary={{ label: "Explore Services", href: "/services" }}
      />
    </>
  );
}