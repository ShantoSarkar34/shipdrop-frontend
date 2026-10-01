import { Info } from "lucide-react";
import { CtaBand } from "@/components/marketing/cta-band";
import { Faq } from "@/components/marketing/faq";
import { DefinitionRows, PageHero, Section, SplitSection } from "@/components/marketing/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing",
  description: "How SwiftDrop calculates delivery charges from weight, service type and route, and when you see the amount.",
  path: "/pricing",
});

const FACTORS = [
  { title: "Weight", description: "You enter the parcel's weight in kilograms when you book." },
  { title: "Service type", description: "The service you choose, such as Express, is part of the calculation." },
  { title: "Route", description: "Your pickup and delivery cities are mapped to zones, and the route between them affects the charge." },
];

const STEPS = [
  "Enter the parcel details when you book a shipment.",
  "SwiftDrop calculates the charge on the server.",
  "The exact amount appears on your shipment.",
  "Pay on Stripe's secure checkout page when you're ready.",
];

const FAQ_ITEMS = [
  {
    q: "Can I set or change the price?",
    a: "No. The charge is always calculated by SwiftDrop's server from your parcel details, so it can't be edited from the booking form.",
  },
  {
    q: "When do I see the charge?",
    a: "Right after you create the shipment, on the shipment itself, before you decide to pay.",
  },
  {
    q: "How do I pay?",
    a: "Payment happens on Stripe's hosted checkout page. Your shipment shows as paid once Stripe has confirmed the payment to us.",
  },
  {
    q: "Why was my charge different from a similar parcel?",
    a: "Weight, service type and the route between your pickup and delivery cities can all change the amount.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="A charge you can understand"
        description="Every delivery charge is calculated on the server from the details you enter. You see the exact amount before you pay."
      />

      <Section>
        <div className="space-y-16">
          <SplitSection eyebrow="The calculation" title="Three things set your charge">
            <DefinitionRows items={FACTORS} />
          </SplitSection>

          <SplitSection eyebrow="What you'll see" title="From booking to payment">
            <ol className="space-y-4">
              {STEPS.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="font-mono text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div role="note" className="mt-8 flex gap-3 rounded-xl bg-info-soft p-4 text-sm text-info-fg">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>
                This deployment runs Stripe in test mode, so no real money moves. At checkout, use the test card{" "}
                <span className="font-mono">4242 4242 4242 4242</span> with any future expiry date and any CVC.
              </p>
            </div>
          </SplitSection>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">FAQ</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Pricing questions</h2>
          </div>
          <Faq items={FAQ_ITEMS} />
        </div>
      </Section>

      <CtaBand title="See your charge before you pay" description="Create an account and book a shipment to see the exact amount." />
    </>
  );
}