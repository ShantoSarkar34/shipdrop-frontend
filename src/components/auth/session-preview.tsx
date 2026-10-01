"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABEL } from "@/config/roles";
import { useLogout } from "@/hooks/use-auth";
import { useCurrentUser } from "@/hooks/use-current-user";

export function SessionPreview() {
  const me = useCurrentUser();
  const logout = useLogout();
  const user = me.data;

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Signed in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Name</dt>
              <dd>{user.name}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd>{user.email}</dd>
              <dt className="text-muted-foreground">Role</dt>
              <dd>{ROLE_LABEL[user.role]}</dd>
              <dt className="text-muted-foreground">Status</dt>
              <dd>{user.status}</dd>
            </dl>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Temporary session check. The real dashboard replaces it.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => me.refetch()}
              disabled={me.isFetching}
            >
              Reload profile
            </Button>
            <Button onClick={() => logout.mutate()} disabled={logout.isPending}>
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
