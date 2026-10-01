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
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-extrabold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your SwiftDrop account.
        </p>
      </div>

      <LoginForm />

      <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton />
      <DemoLogin />

      <p className="text-center text-sm text-muted-foreground">
        New to SwiftDrop?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
