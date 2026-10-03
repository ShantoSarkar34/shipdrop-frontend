import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AuthAside } from "@/components/auth/auth-aside";
import { AuthFormSkeleton } from "@/components/auth/auth-skeleton";
import { GoogleProvider } from "@/components/auth/google-provider";
import { GuestGuard } from "@/components/auth/guest-guard";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-cream p-4 sm:p-5 lg:p-6">
      <div className="grid min-h-[calc(100dvh-2rem)] gap-4 lg:grid-cols-[1fr_1fr] xl:gap-5">
        {/* Left green card */}
        <AuthAside />

        {/* Right auth section */}
        <section className="relative min-h-[calc(100dvh-2rem)] overflow-hidden rounded-[2rem] bg-background">
          {/* Decorative leaf crossing the top boundary */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 140"
            className="pointer-events-none absolute left-0 top-5 z-20 h-28 w-20 -translate-x-1/4 text-primary/15"
            fill="none"
          >
            <path
              d="M38 130C38 130 40 75 65 39"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M39 91C22 83 14 68 16 50C34 53 42 67 39 91Z"
              fill="currentColor"
            />
            <path
              d="M41 72C45 50 59 36 78 34C77 53 64 67 41 72Z"
              fill="currentColor"
            />
          </svg>

          {/* Subtle decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-harvest/10 blur-3xl"
          />

          {/* Top controls */}
          <header className="relative z-30 flex items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
            <Link
              href="/"
              aria-label="SwiftDrop home"
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            >
              <Logo />
            </Link>

            <Link
              href="/"
              className="group ml-auto hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:flex"
            >
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to home
            </Link>

            <div className="ml-4">
              <ThemeToggle />
            </div>
          </header>

          {/* White form card */}
          <main className="relative z-10 flex px-4 pb-8 sm:px-8 lg:px-10 lg:pb-10">
            <div className="w-full rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm sm:p-8 lg:p-10 xl:p-11">
              <div className="mx-auto w-full max-w-xl">
                <GoogleProvider>
                  <Suspense fallback={<AuthFormSkeleton />}>
                    <GuestGuard>{children}</GuestGuard>
                  </Suspense>
                </GoogleProvider>
              </div>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}