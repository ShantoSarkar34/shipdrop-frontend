"use client";

import { LoaderCircle, ShieldCheck, Truck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/config/demo-accounts";
import { useLogin } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/errors";

const ICONS = [UserRound, Truck, ShieldCheck];

// These buttons only call the real login endpoint with the seeded demo credentials.
export function DemoLogin() {
  const login = useLogin();

  return (
    <section
      aria-labelledby="demo-heading"
      className="space-y-3 rounded-xl border border-border bg-card p-4"
    >
      <div>
        <h2 id="demo-heading" className="font-display text-sm font-bold">
          Try a demo account
        </h2>
        <p className="text-xs text-muted-foreground">
          One click signs you in with seeded test data.
        </p>
      </div>
      <div className="space-y-2">
        {DEMO_ACCOUNTS.map((account, index) => {
          const Icon = ICONS[index];
          const isThisPending =
            login.isPending && login.variables?.email === account.email;
          return (
            <Button
              key={account.email}
              type="button"
              variant="outline"
              disabled={login.isPending}
              className="h-auto w-full justify-start gap-3 py-2.5 text-left"
              onClick={() =>
                login.mutate(
                  { email: account.email, password: DEMO_PASSWORD },
                  { onError: (error) => toast.error(getErrorMessage(error)) },
                )
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="flex flex-1 flex-col">
                <span className="text-sm font-medium">
                  Continue as {account.label}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {account.description}
                </span>
              </span>
              {isThisPending ? (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-label="Signing in"
                />
              ) : null}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
