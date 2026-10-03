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

const ON_DARK_SOLID = "bg-white text-[#0b1020] hover:bg-white/90";
const ON_DARK_GHOST = "text-white hover:bg-white/10 hover:text-white";

function AuthActions({
  stacked,
  overlay,
  onNavigate,
}: {
  stacked?: boolean;
  overlay?: boolean;
  onNavigate?: () => void;
}) {
  const status = useSessionStore((state) => state.status);
  const me = useCurrentUser();

  // Hold the space while we find out who's signed in, so the buttons don't jump.
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
          overlay && ON_DARK_SOLID,
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
            variant: stacked ? "outline" : "ghost",
            size: "sm",
          }),
          overlay && ON_DARK_GHOST,
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
          overlay && ON_DARK_SOLID,
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

  // Transparent over the banner, solid once the page scrolls or the mobile menu is open.
  const overlay = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
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
    "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    overlay
      ? "text-white/80 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white"
      : "text-muted-foreground hover:text-foreground aria-[current=page]:bg-secondary aria-[current=page]:text-foreground",
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        overlay
          ? "border-transparent bg-transparent text-white"
          : "border-border/70 bg-background/85 text-foreground backdrop-blur",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="SwiftDrop home"
          className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={linkClass}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className={overlay ? ON_DARK_GHOST : undefined} />
          <div className="hidden items-center gap-2 md:flex">
            <AuthActions overlay={overlay} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", overlay && ON_DARK_GHOST)}
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

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background md:hidden"
        >
          <Container className="space-y-4 py-4">
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {PUBLIC_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(linkClass, "text-base")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              <AuthActions stacked onNavigate={close} />
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
