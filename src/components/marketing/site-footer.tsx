import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/marketing/primitives";

const GROUPS = [
  {
    title: "Product",
    links: [
      { href: "/services", label: "Services" },
      { href: "/pricing", label: "Pricing" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Login" },
      { href: "/register", label: "Get started" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="grid gap-10 py-12 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-xs space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Courier and logistics management for customers, delivery agents and
            operations teams.
          </p>
        </div>
        {GROUPS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="font-display text-sm font-bold">{group.title}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="border-t border-border py-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SwiftDrop. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
