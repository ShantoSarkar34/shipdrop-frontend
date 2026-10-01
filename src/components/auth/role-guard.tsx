"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { AppShellSkeleton } from "@/components/layout/app-shell-skeleton";
import { Button } from "@/components/ui/button";
import { ROLE_HOME } from "@/config/roles";
import { useLogout } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getErrorMessage, isApiError } from "@/lib/api/errors";
import { useSessionStore } from "@/stores/session-store";
import type { Role } from "@/types/user";

/**
 * UX layer only. It keeps people out of screens that aren't theirs, but the backend
 * enforces every permission, so nothing here is a security boundary.
 */
export function RoleGuard({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const status = useSessionStore((state) => state.status);
  const me = useCurrentUser();
  const user = me.data;
  const wasAuthenticated = useRef(false);
  const accountBlocked = isApiError(me.error) && me.error.status === 403;

  // Not signed in: go to login and remember where they wanted to go.
  // If they signed out during this visit, don't carry a stale destination along.
  useEffect(() => {
    if (status === "authenticated") wasAuthenticated.current = true;
    if (status === "unauthenticated") {
      router.replace(
        wasAuthenticated.current
          ? "/login"
          : `/login?next=${encodeURIComponent(pathname)}`,
      );
    }
  }, [status, pathname, router]);

  // Signed in with the wrong role: send them home, not to an error page.
  useEffect(() => {
    if (user && user.role !== role) router.replace(ROLE_HOME[user.role]);
  }, [user, role, router]);

  // A suspended or blocked account is signed out with the server's own message.
  useEffect(() => {
    if (accountBlocked) {
      toast.error(getErrorMessage(me.error));
      useSessionStore.getState().signOut();
    }
  }, [accountBlocked, me.error]);

  if (user && user.role === role) return <>{children}</>;

  if (status === "authenticated" && me.isError && !accountBlocked) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div role="alert" className="max-w-sm space-y-4 text-center">
          <h1 className="text-xl font-extrabold">
            We couldn&apos;t load your account
          </h1>
          <p className="text-sm text-muted-foreground">
            {getErrorMessage(me.error)}
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => me.refetch()} disabled={me.isFetching}>
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <AppShellSkeleton />;
}
