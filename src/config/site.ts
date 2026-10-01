import { env } from "@/config/env";

export const site = {
  name: "SwiftDrop",
  description:
    "Book parcel deliveries, follow every status change and pay securely. SwiftDrop connects customers, delivery agents and operations in one platform.",
  url: env.siteUrl,
  contactEmail: env.contactEmail,
} as const;

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;