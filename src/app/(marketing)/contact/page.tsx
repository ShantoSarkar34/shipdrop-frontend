import { Briefcase, LifeBuoy, Mail } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/contact-form";
import { CtaSection } from "@/components/marketing/cta-section";
import { Faq } from "@/components/marketing/faq";
import { PageHeader } from "@/components/marketing/page-header";
import { PageSection } from "@/components/marketing/page-section";
import { SectionHeading } from "@/components/marketing/primitives";
import { CREATE_SHIPMENT_HREF } from "@/config/links";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact SwiftDrop | Delivery & Logistics",
  description:
    "Get in touch with SwiftDrop about shipments, account support or business logistics requirements.",
  path: "/contact",
});

const linkClass = "text-primary underline-offset-4 hover:underline";

const FAQ_ITEMS = [
  {
    q: "How do I create a shipment?",
    a: (
      <>
        <Link href="/register" className={linkClass}>
          Create an account
        </Link>{" "}
        or sign in, then start a new shipment from your dashboard and follow the
        guided steps.
      </>
    ),
  },
  {
    q: "Can I track my parcel?",
    a: "Yes. Open the shipment from your dashboard to see its status timeline, from creation to final delivery.",
  },
  {
    q: "How does delivery assignment work?",
    a: "Once a shipment is confirmed, an administrator assigns an available delivery agent. The agent can accept or decline the delivery, then picks up the parcel and updates its status.",
  },
  {
    q: "What payment methods are supported?",
    a: (
      <>
        Payment happens on Stripe&apos;s hosted checkout page, so the available
        methods are the ones Stripe offers there. See{" "}
        <Link href="/pricing" className={linkClass}>
          how pricing works
        </Link>
        .
      </>
    ),
  },
  {
    q: "How can I contact support?",
    a: site.contactEmail ? (
      <>
        Use the form on this page or email{" "}
        <a href={`mailto:${site.contactEmail}`} className={linkClass}>
          {site.contactEmail}
        </a>
        .
      </>
    ) : (
      "Use the form on this page. If you already have an account, your dashboard shows each shipment's status and payment state."
    ),
  },
];

export default function ContactPage() {
  const contactCards = [
    ...(site.contactEmail
      ? [
          {
            icon: Mail,
            title: "Email",
            body: (
              <a href={`mailto:${site.contactEmail}`} className={linkClass}>
                {site.contactEmail}
              </a>
            ),
          },
        ]
      : []),
    {
      icon: LifeBuoy,
      title: "Support",
      body: "Help with your account, a shipment or a payment. Include the tracking ID if your question is about a specific parcel.",
    },
    {
      icon: Briefcase,
      title: "Business inquiries",
      body: "Tell us about your logistics requirements, such as recurring shipments or custom workflows.",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact SwiftDrop"
        title="Let's Talk About Your Delivery Needs"
        description="Questions about the platform, a shipment or a business requirement? Send us a message."
      />

      <PageSection>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <ul className="space-y-4">
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <li
                  key={card.title}
                  className="flex gap-4 rounded-xl border border-border bg-card p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-bold">{card.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {card.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold">Send us a message</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              We&apos;ll use your email address only to reply.
            </p>
            <ContactForm fallbackEmail={site.contactEmail || undefined} />
          </div>
        </div>
      </PageSection>

      <PageSection tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <SectionHeading eyebrow="Common questions" title="Quick answers" />
          <Faq items={FAQ_ITEMS} />
        </div>
      </PageSection>

      <CtaSection
        title="Need to send a parcel?"
        description="Create an account and book your first shipment."
        primary={{ label: "Create a Shipment", href: CREATE_SHIPMENT_HREF }}
      />
    </>
  );
}
