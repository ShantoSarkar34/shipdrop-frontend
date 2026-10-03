import {
  Activity,
  ArrowRight,
  Check,
  CircleCheck,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  type LucideIcon,
  Package,
  PackageCheck,
  PackagePlus,
  Power,
  Route,
  ScrollText,
  ShieldCheck,
  Truck,
  UserRound,
  Users,
  MapPin,
} from "lucide-react";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHeader } from "@/components/marketing/page-header";
import { PageSection } from "@/components/marketing/page-section";
import { StatusVisual } from "@/components/marketing/page-visuals";
import { SectionHeading } from "@/components/marketing/primitives";
import {
  ProcessFlow,
  type FlowStep,
} from "@/components/marketing/process-flow";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "SwiftDrop Services | Courier & Delivery Management",
  description:
    "Shipment management, tracking, delivery workflows, online payments and analytics for customers, delivery agents and administrators.",
  path: "/services",
});

type Visual =
  | { kind: "chips" | "timeline" | "list"; items: readonly string[] }
  | { kind: "payment" | "bars" | "roles" };

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  span: string;
  visual: Visual;
}

const SERVICES: readonly Service[] = [
  {
    icon: Package,
    title: "Shipment Management",
    description:
      "Create and manage parcels with sender, receiver, delivery address, parcel details, pricing and shipment status.",
    span: "md:col-span-2 lg:col-span-4",
    visual: {
      kind: "chips",
      items: [
        "Sender",
        "Receiver",
        "Delivery address",
        "Parcel details",
        "Pricing",
        "Status",
      ],
    },
  },
  {
    icon: Route,
    title: "Shipment Tracking",
    description:
      "Follow progress through structured delivery statuses, from creation to final delivery.",
    span: "lg:col-span-2",
    visual: {
      kind: "timeline",
      items: ["Pending", "Confirmed", "Picked up", "In transit", "Delivered"],
    },
  },
  {
    icon: Truck,
    title: "Delivery Management",
    description:
      "Agents manage availability, accept assignments, pick up parcels and update delivery progress.",
    span: "lg:col-span-2",
    visual: {
      kind: "list",
      items: ["Availability", "Assignments", "Pickup", "Status updates"],
    },
  },
  {
    icon: CreditCard,
    title: "Secure Online Payments",
    description:
      "Online checkout through the integrated payment system, with payment status verified by the backend.",
    span: "lg:col-span-2",
    visual: { kind: "payment" },
  },
  {
    icon: Activity,
    title: "Delivery Analytics",
    description:
      "Operational insights for delivery agents and administrators through dashboards and analytics.",
    span: "lg:col-span-2",
    visual: { kind: "bars" },
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Management",
    description:
      "Customer, delivery agent and administrator capabilities are separated, with appropriate access control.",
    span: "md:col-span-2 lg:col-span-6",
    visual: { kind: "roles" },
  },
];

const CUSTOMER_STEPS: readonly FlowStep[] = [
  {
    icon: PackagePlus,
    title: "Create Shipment",
    description:
      "Enter sender, receiver and parcel details. The charge is calculated for you.",
  },
  {
    icon: CreditCard,
    title: "Pay",
    description:
      "Check out online. Payment status is confirmed by the backend.",
  },
  {
    icon: MapPin,
    title: "Track",
    description:
      "Follow structured status updates from creation to final delivery.",
  },
  {
    icon: PackageCheck,
    title: "Receive",
    description:
      "The delivery is completed and the shipment is marked delivered.",
  },
];

const AGENT_STEPS: readonly FlowStep[] = [
  {
    icon: Power,
    title: "Availability",
    description: "Set yourself available or offline.",
  },
  {
    icon: ClipboardList,
    title: "Assignment",
    description: "See the deliveries assigned to you.",
  },
  {
    icon: CircleCheck,
    title: "Accept",
    description: "Accept the delivery, or decline it.",
  },
  {
    icon: Package,
    title: "Pickup",
    description: "Mark the parcel as picked up.",
  },
  {
    icon: Truck,
    title: "Delivery",
    description: "Update progress until the parcel is delivered.",
  },
];

const AGENT_EXTRAS = [
  "Status updates",
  "Delivery history",
  "Earnings and analytics",
];

const ADMIN_AREAS = [
  {
    icon: Users,
    title: "Users",
    description: "Review accounts and suspend or reactivate them.",
  },
  {
    icon: Package,
    title: "Shipments",
    description: "Search, filter and inspect every shipment.",
  },
  {
    icon: Route,
    title: "Delivery assignments",
    description: "Assign available delivery agents to parcels.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Monitor payment status and revenue.",
  },
  {
    icon: ScrollText,
    title: "Audit activity",
    description: "Review a log of important actions.",
  },
  {
    icon: Activity,
    title: "Analytics",
    description: "Track shipment and revenue trends.",
  },
] as const;

const BAR_HEIGHTS = [40, 65, 50, 80, 60, 90];

function ServiceVisual({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "chips":
      return (
        <ul className="mt-5 flex flex-wrap gap-2">
          {visual.items.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "timeline":
      return (
        <ol className="mt-5 space-y-2 border-l border-border pl-4">
          {visual.items.map((item, index) => (
            <li key={item} className="relative text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1.5 -left-5.25 size-2 rounded-full",
                  index === visual.items.length - 1
                    ? "bg-primary"
                    : "bg-primary/50",
                )}
              />
              {item}
            </li>
          ))}
        </ol>
      );
    case "list":
      return (
        <ul className="mt-5 space-y-2">
          {visual.items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <Check
                className="size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "payment":
      return (
        <div className="mt-5">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="rounded-full border border-border px-2.5 py-1">
              Pending
            </span>
            <ArrowRight
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="rounded-full bg-primary px-2.5 py-1 text-primary-foreground">
              Paid
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Marked paid only after the backend confirms it.
          </p>
        </div>
      );
    case "bars":
      return (
        <div
          aria-hidden="true"
          className="mt-5 flex h-16 items-end gap-1.5 border-b border-border"
        >
          {BAR_HEIGHTS.map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-t bg-primary/70"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      );
    case "roles":
      return (
        <ul className="mt-5 flex flex-wrap gap-2">
          {[
            { icon: UserRound, label: "Customers" },
            { icon: Truck, label: "Delivery agents" },
            { icon: LayoutDashboard, label: "Administrators" },
          ].map((role) => {
            const Icon = role.icon;
            return (
              <li
                key={role.label}
                className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {role.label}
              </li>
            );
          })}
        </ul>
      );
  }
}

function AdminPreview() {
  return (
    <figure
      role="img"
      aria-label="Illustration of an administrator dashboard with sections for users, shipments, assignments, payments, audit activity and analytics"
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <div
        aria-hidden="true"
        className="flex items-center gap-1.5 border-b border-border px-4 py-3"
      >
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-3 text-xs text-muted-foreground">Admin</span>
      </div>
      <div aria-hidden="true" className="grid grid-cols-[8.5rem_1fr]">
        <ul className="space-y-1 border-r border-border p-3">
          {ADMIN_AREAS.map((area, index) => {
            const Icon = area.icon;
            return (
              <li
                key={area.title}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                  index === ADMIN_AREAS.length - 1
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="truncate">{area.title}</span>
              </li>
            );
          })}
        </ul>
        <div className="p-4">
          <p className="text-xs font-medium">Analytics</p>
          <div className="mt-3 flex h-24 items-end gap-1.5 border-b border-border">
            {[35, 50, 42, 60, 55, 70, 48, 66].map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t bg-primary/70"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <span className="h-8 rounded bg-muted" />
            <span className="h-8 rounded bg-muted" />
            <span className="h-8 rounded bg-muted" />
          </div>
        </div>
      </div>
      <figcaption className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        Illustration
      </figcaption>
    </figure>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="SwiftDrop Services"
        title="Everything You Need to Manage Deliveries"
        description="From creating a shipment to tracking it, paying for it and managing the whole operation: shipment creation, delivery management, tracking, payments and administration in one platform."
        visual={<StatusVisual />}
      />

      <PageSection>
        <SectionHeading
          eyebrow="Core services"
          title="What SwiftDrop provides"
        />
        <RevealGroup
          stagger={0.07}
          className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <RevealItem
                key={service.title}
                className={cn(
                  "flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40",
                  service.span,
                )}
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{service.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {service.description}
                </p>
                <ServiceVisual visual={service.visual} />
              </RevealItem>
            );
          })}
        </RevealGroup>
      </PageSection>

      <PageSection tone="muted">
        <SectionHeading
          eyebrow="Customer experience"
          title="From booking to doorstep"
          description="Customers manage the whole journey from their dashboard."
        />
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
          <ProcessFlow steps={CUSTOMER_STEPS} label="Customer workflow" />
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Delivery agent experience"
              title="From availability to delivered"
              description="Agents see their assignments, work through each delivery step by step, and keep track of their results."
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {AGENT_EXTRAS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm"
                >
                  <Check className="size-4 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <ProcessFlow
              steps={AGENT_STEPS}
              orientation="vertical"
              label="Delivery agent workflow"
            />
          </div>
        </div>
      </PageSection>

      <PageSection tone="muted">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Admin operations"
              title="Run the whole operation"
              description="Administrators oversee users, shipments and payments from one workspace."
            />
            <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {ADMIN_AREAS.map((area) => {
                const Icon = area.icon;
                return (
                  <div key={area.title} className="flex gap-3">
                    <Icon
                      className="mt-0.5 size-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="font-medium">{area.title}</dt>
                      <dd className="text-sm text-muted-foreground">
                        {area.description}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>
          <AdminPreview />
        </div>
      </PageSection>

      <CtaSection
        title="Ready to streamline your deliveries?"
        description="Create an account to start sending parcels, or get in touch about your requirements."
        primary={{ label: "Get Started", href: "/register" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
