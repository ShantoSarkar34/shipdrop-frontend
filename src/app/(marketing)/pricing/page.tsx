import {
  Check,
  ClipboardList,
  Info,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { CtaSection } from "@/components/marketing/cta-section";
import { Faq } from "@/components/marketing/faq";
import { PageHeader } from "@/components/marketing/page-header";
import { PageSection } from "@/components/marketing/page-section";
import { ChargeVisual } from "@/components/marketing/page-visuals";
import { SectionHeading } from "@/components/marketing/primitives";
import { RevealGroup, RevealItem } from "@/components/marketing/reveal";
import { buttonVariants } from "@/components/ui/button";
import { CREATE_SHIPMENT_HREF } from "@/config/links";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "SwiftDrop Pricing | Delivery Services",
  description:
    "How SwiftDrop delivery charges work: calculated from your shipment details at checkout and shown before you pay.",
  path: "/pricing",
});

const OPTIONS = [
  {
    name: "Standard Delivery",
    audience: "For everyday parcel deliveries.",
    price: "Calculated at checkout",
    badge: "Available now",
    features: [
      "Shipment creation",
      "Delivery tracking",
      "Standard delivery workflow",
      "Online payment",
    ],
    cta: { label: "Create a Shipment", href: CREATE_SHIPMENT_HREF },
    featured: true,
  },
  {
    name: "Business Delivery",
    audience: "For businesses managing recurring shipments.",
    price: "Contact us",
    badge: "By inquiry",
    features: [
      "Shipment management",
      "Delivery tracking",
      "Operational visibility",
      "Admin management",
    ],
    cta: { label: "Contact us", href: "/contact" },
    featured: false,
  },
  {
    name: "Custom Logistics",
    audience: "For organizations with specialized logistics requirements.",
    price: "Contact us",
    badge: "By inquiry",
    features: [
      "Custom workflow requirements",
      "Operational support",
      "Scalable delivery management",
    ],
    cta: { label: "Contact us", href: "/contact" },
    featured: false,
  },
] as const;

const COST_FACTORS = [
  {
    icon: MapPin,
    title: "Pickup and delivery location",
    description: "Where the parcel starts and where it needs to go.",
  },
  {
    icon: Package,
    title: "Parcel information",
    description: "The details you enter about the parcel, such as its weight.",
  },
  {
    icon: ClipboardList,
    title: "Delivery requirements",
    description: "The requirements you specify for the delivery.",
  },
  {
    icon: Truck,
    title: "Service type",
    description:
      "The delivery service you choose when you book, such as Express.",
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "How is the delivery charge calculated?",
    a: "SwiftDrop calculates the charge from the shipment details you enter, such as locations, parcel information and service type. You don't enter a price yourself, and the amount is shown before you pay.",
  },
  {
    q: "How does shipment tracking work?",
    a: "Each shipment moves through structured statuses from creation to delivery. Open a shipment from your dashboard to see its timeline, including the time and any note for each status change.",
  },
  {
    q: "How do I pay for a shipment?",
    a: "Payment happens on Stripe's hosted checkout page. A shipment shows as paid once the backend has confirmed the payment. This deployment runs Stripe in test mode, so no real money moves.",
  },
  {
    q: "What do the delivery statuses mean?",
    a: "A shipment starts as pending, then is confirmed, assigned to an agent, picked up, in transit and out for delivery, and finally delivered. It can also be cancelled, marked as a failed delivery, or returned.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. Customers create an account to book, pay for and track shipments. You can register with an email and password, or sign in with Google.",
  },
  {
    q: "Can businesses or custom requirements be handled?",
    a: (
      <>
        Business and custom logistics needs are handled by inquiry.{" "}
        <Link
          href="/contact"
          className="text-primary underline-offset-4 hover:underline"
        >
          Contact us
        </Link>{" "}
        with your requirements.
      </>
    ),
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="SwiftDrop Pricing"
        title="Simple, Transparent Delivery"
        description="Your delivery cost depends on your shipment details, such as destination, parcel information and service requirements. The charge is calculated for you and shown before you pay."
        visual={<ChargeVisual />}
      />

      <PageSection>
        <SectionHeading
          eyebrow="Service options"
          title="Choose how you want to use SwiftDrop"
          description="No prices are published. Delivery charges are calculated from your shipment, and business or custom needs are handled by inquiry."
        />
        <RevealGroup stagger={0.1} className="mt-10 grid gap-6 lg:grid-cols-3">
          {OPTIONS.map((option) => (
            <RevealItem
              key={option.name}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-6",
                option.featured
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold">{option.name}</h3>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    option.featured
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground",
                  )}
                >
                  {option.badge}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {option.audience}
              </p>
              <p className="mt-6 text-lg font-semibold">{option.price}</p>
              <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6">
                {option.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={option.cta.href}
                className={cn(
                  buttonVariants({
                    variant: option.featured ? "default" : "outline",
                    size: "lg",
                  }),
                  "mt-8 w-full",
                )}
              >
                {option.cta.label}
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <div
          role="note"
          className="mt-8 flex gap-3 rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground"
        >
          <Info
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            This is a demo deployment: the options above describe how SwiftDrop
            can be used, not separate paid plans. Payments run in Stripe test
            mode. At checkout, use the test card{" "}
            <span className="font-mono text-foreground">
              4242 4242 4242 4242
            </span>{" "}
            with any future expiry date and any CVC.
          </p>
        </div>
      </PageSection>

      <PageSection tone="muted">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="What affects delivery cost?"
            title="Your shipment sets the charge"
            description="The final amount is calculated from the details of your shipment. You'll see it before you pay."
          />
          <RevealGroup
            stagger={0.08}
            className="grid gap-x-8 gap-y-6 sm:grid-cols-2"
          >
            {COST_FACTORS.map((factor) => {
              const Icon = factor.icon;
              return (
                <RevealItem
                  key={factor.title}
                  className="border-t border-border pt-4"
                >
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 font-bold">{factor.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {factor.description}
                  </p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </PageSection>

      <PageSection>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <SectionHeading eyebrow="FAQ" title="Pricing questions" />
          <Faq items={FAQ_ITEMS} />
        </div>
      </PageSection>

      <CtaSection
        title="Have a delivery requirement?"
        description="Create an account to see the charge for your shipment, or tell us about a business or custom need."
        primary={{ label: "Create a Shipment", href: CREATE_SHIPMENT_HREF }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
