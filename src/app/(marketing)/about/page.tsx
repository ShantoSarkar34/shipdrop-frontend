import { CtaBand } from "@/components/marketing/cta-band";
import { DefinitionRows, PageHero, Section, SplitSection } from "@/components/marketing/primitives";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description: "SwiftDrop brings customers, delivery agents and operations into one system, with clear records and honest pricing.",
  path: "/about",
});

const PRINCIPLES = [
  {
    title: "One record per parcel",
    description:
      "Every status change is stored with its time and an optional note. Customers, agents and administrators all read the same history.",
  },
  {
    title: "Prices come from the system",
    description:
      "The delivery charge is calculated on the server from weight, service type and route. There is no price field to edit or argue with.",
  },
  {
    title: "Payments are confirmed, not assumed",
    description:
      "A shipment becomes paid only when Stripe's confirmation reaches our servers. Returning from checkout is not proof.",
  },
  {
    title: "Access follows the role",
    description:
      "Customers, delivery agents and administrators each see only their own area, and the server checks every request. Important admin actions are written to an audit log.",
  },
  {
    title: "Safe under pressure",
    description:
      "Assigning an agent is concurrency-safe, so two administrators can't give the same agent two parcels at once.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built around clear records and honest pricing"
        description="SwiftDrop is a courier and logistics platform that brings customers, delivery agents and operations teams into one system. Every parcel has a single record, and everyone works from it."
      />
      <Section>
        <SplitSection
          eyebrow="Principles"
          title="How SwiftDrop is designed"
          description="A few decisions shape how the platform behaves."
        >
          <DefinitionRows items={PRINCIPLES} />
        </SplitSection>
      </Section>
      <CtaBand title="See it for yourself" description="Create an account, or sign in with a demo account to explore each workspace." />
    </>
  );
}