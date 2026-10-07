"use client";

import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AREA_LABEL, NAV_BY_AREA, type Area, type NavItem } from "@/config/nav";
import { ROLE_HOME, ROLE_LABEL } from "@/config/roles";
import { useLogout } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";
import { MotionProvider } from "@/components/marketing/motion-provider";

/** The most specific nav item wins, so /dashboard/shipments/new highlights "Create Shipment", not "Shipments". */
function findActiveHref(nav: readonly NavItem[], pathname: string) {
  return nav
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

interface SidebarProps {
  area: Area;
  nav: readonly NavItem[];
  activeHref?: string;
  user?: User;
  signingOut: boolean;
  onSignOut: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
}

function SidebarContent({
  area,
  nav,
  activeHref,
  user,
  signingOut,
  onSignOut,
  onNavigate,
  onClose,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <Link
          href="/"
          onClick={onNavigate}
          aria-label="SwiftDrop home"
          className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Logo />
        </Link>
        {onClose ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </Button>
        ) : null}
      </div>

      <nav
        aria-label={`${AREA_LABEL[area]} navigation`}
        className="flex-1 space-y-1 overflow-y-auto p-3"
      >
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full",
                  active && "bg-primary",
                )}
              />
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-2 border-t border-border p-3">
        {user ? (
          <div className="flex items-center gap-3 px-2 py-1">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
            >
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {ROLE_LABEL[user.role]}
              </p>
            </div>
          </div>
        ) : null}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={onSignOut}
          disabled={signingOut}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function AppShell({
  area,
  children,
}: {
  area: Area;
  children: ReactNode;
}) {
  const nav = NAV_BY_AREA[area];
  const pathname = usePathname();
  const me = useCurrentUser();
  const logout = useLogout();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const user = me.data;
  const activeHref = findActiveHref(nav, pathname);

  const closeMenu = () => dialogRef.current?.close();
  const sidebar: SidebarProps = {
    area,
    nav,
    activeHref,
    user,
    signingOut: logout.isPending,
    onSignOut: () => logout.mutate(),
  };

  return (
    <MotionProvider>
      <div className="min-h-dvh bg-background">
        <a
          href="#app-main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>

        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card lg:block">
          <SidebarContent {...sidebar} />
        </aside>

        {/* A native modal dialog gives the mobile drawer its focus trap, Escape key and focus return. */}
        <dialog
          ref={dialogRef}
          aria-label="Navigation menu"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
          className="m-0 h-dvh max-h-none w-72 max-w-[85vw] border-r border-border bg-card p-0 text-foreground backdrop:bg-black/50 lg:hidden"
        >
          <SidebarContent
            {...sidebar}
            onNavigate={closeMenu}
            onClose={closeMenu}
          />
        </dialog>

        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => dialogRef.current?.showModal()}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
            <p className="text-sm font-medium text-muted-foreground lg:hidden">
              {AREA_LABEL[area]}
            </p>
            <div className="ml-auto flex items-center gap-1">
              <ThemeToggle />
              {user ? (
                <Link
                  href={`${ROLE_HOME[user.role]}/profile`}
                  aria-label="Your profile"
                  className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {initials(user.name)}
                </Link>
              ) : null}
            </div>
          </header>
          <main
            id="app-main"
            className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
          >
            {children}
          </main>
        </div>
      </div>
    </MotionProvider>
  );
}
