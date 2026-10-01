import Link from "next/link";
import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero, Section } from "@/components/marketing/primitives";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with the SwiftDrop team, or manage your shipments from your account.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about the platform or a partnership? Send us a message. For a specific shipment, your dashboard has the full history."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-8">
            {site.contactEmail ? (
              <div>
                <h2 className="font-display text-lg font-bold">Email</h2>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="mt-1 inline-block text-primary underline-offset-4 hover:underline"
                >
                  {site.contactEmail}
                </a>
              </div>
            ) : null}
            <div>
              <h2 className="font-display text-lg font-bold">
                Already a customer?
              </h2>
              <p className="mt-1 text-muted-foreground">
                Open the shipment from your dashboard to see its status timeline
                and payment state.{" "}
                <Link
                  href="/login"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">
                Want to deliver with us?
              </h2>
              <p className="mt-1 text-muted-foreground">
                Delivery agents sign up like everyone else.{" "}
                <Link
                  href="/register"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Create an agent account
                </Link>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            {site.contactEmail ? (
              <ContactForm to={site.contactEmail} />
            ) : (
              <p className="text-muted-foreground">
                Email contact is being set up. In the meantime, sign in to
                manage your shipments from your dashboard.
              </p>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
