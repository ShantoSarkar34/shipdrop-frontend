import Link from "next/link";
import { Suspense } from "react";
import { AuthAside } from "@/components/auth/auth-aside";
import { AuthFormSkeleton } from "@/components/auth/auth-skeleton";
import { GoogleProvider } from "@/components/auth/google-provider";
import { GuestGuard } from "@/components/auth/guest-guard";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[5fr_6fr]">
      <AuthAside />
      <div className="flex min-h-dvh flex-col">
        <header className="flex items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/" aria-label="SwiftDrop home" className="rounded-md lg:hidden">
            <Logo />
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-8">
          <div className="w-full max-w-sm">
            <GoogleProvider>
              <Suspense fallback={<AuthFormSkeleton />}>
                <GuestGuard>{children}</GuestGuard>
              </Suspense>
            </GoogleProvider>
          </div>
        </main>
      </div>
    </div>
  );
}