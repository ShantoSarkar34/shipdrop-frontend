"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/marketing/primitives";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { ROLE_HOME } from "@/config/roles";
import { PUBLIC_NAV } from "@/config/site";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/session-store";

function AuthActions({
  stacked,
  onNavigate,
}: {
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  const status = useSessionStore((state) => state.status);
  const me = useCurrentUser();

  // Keep the action area stable while authentication state is loading.
  if (status === "hydrating" || (status === "authenticated" && me.isPending)) {
    return (
      <div
        aria-hidden="true"
        className={cn("h-9", stacked ? "w-full" : "w-44")}
      />
    );
  }

  const full = stacked ? "w-full" : "";

  if (me.data) {
    return (
      <Link
        href={ROLE_HOME[me.data.role]}
        onClick={onNavigate}
        className={cn(
          buttonVariants({ size: "sm" }),
          "rounded-lg bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md",
          full,
        )}
      >
        Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        onClick={onNavigate}
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "sm",
          }),
          "rounded-lg text-foreground transition-colors hover:bg-primary/10 hover:text-primary",
          full,
        )}
      >
        Login
      </Link>

      <Link
        href="/register"
        onClick={onNavigate}
        className={cn(
          buttonVariants({ size: "sm" }),
          "rounded-lg bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md",
          full,
        )}
      >
        Get started
      </Link>
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  const linkClass = cn(
    "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "text-muted-foreground hover:bg-primary/5 hover:text-primary",
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/85 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-background/60 backdrop-blur-md",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          aria-label="SwiftDrop home"
          className="rounded-lg transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 md:flex"
        >
          {PUBLIC_NAV.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  linkClass,
                  active &&
                    "bg-primary/10 font-semibold text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-1 md:flex">
            <AuthActions />
          </div>

          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg hover:bg-primary/10 hover:text-primary md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </Container>

      {/* Mobile navigation */}
      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background/95 shadow-lg backdrop-blur-xl md:hidden"
        >
          <Container className="py-4">
            <nav
              aria-label="Mobile"
              className="flex flex-col gap-1"
            >
              {PUBLIC_NAV.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      linkClass,
                      "w-full px-4 py-3 text-base",
                      active &&
                        "bg-primary/10 font-semibold text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <AuthActions stacked onNavigate={close} />
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
