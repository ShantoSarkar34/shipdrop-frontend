import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/google-button";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a SwiftDrop account to send parcels, or sign up as a delivery agent.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Create your account
        </h1>

        <p className="text-sm leading-6 text-muted-foreground">
          Start sending parcels or delivering with SwiftDrop.
        </p>
      </div>

      <RegisterForm />

      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton />

      <p className="text-center text-xs leading-5 text-muted-foreground">
        Signing up with Google creates a customer account.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}