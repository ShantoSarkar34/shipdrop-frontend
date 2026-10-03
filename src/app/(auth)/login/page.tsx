import type { Metadata } from "next";
import Link from "next/link";
import { DemoLogin } from "@/components/auth/demo-login";
import { GoogleButton } from "@/components/auth/google-button";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to manage your SwiftDrop shipments, deliveries and operations.",
};

export default function LoginPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Welcome back
        </h1>

        <p className="text-sm leading-6 text-muted-foreground">
          Log in to check your shipments, deliveries and payments.
        </p>
      </div>

      <LoginForm />

      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton />

      <DemoLogin />

      <p className="text-center text-sm text-muted-foreground">
        New to SwiftDrop?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}