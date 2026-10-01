"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AuthFormSkeleton } from "@/components/auth/auth-skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { resolvePostLoginPath } from "@/lib/auth/redirect";
import { useSessionStore } from "@/stores/session-store";

/** Signed-in users never see the login or register forms. This is also where post-login redirects happen. */
export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = useSessionStore((state) => state.status);
  const me = useCurrentUser();
  const user = me.data;

  useEffect(() => {
    if (user)
      router.replace(resolvePostLoginPath(searchParams.get("next"), user.role));
  }, [user, router, searchParams]);

  const checking =
    status === "hydrating" || (status === "authenticated" && !me.isError);
  if (checking) return <AuthFormSkeleton />;

  return <>{children}</>;
}
