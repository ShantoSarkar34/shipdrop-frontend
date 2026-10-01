"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { makeQueryClient } from "@/lib/query/query-client";
import { useSessionStore } from "@/stores/session-store";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  // Drop all cached server data when a session ends, so the next account never sees it.
  useEffect(
    () =>
      useSessionStore.subscribe((state, previous) => {
        if (
          previous.status === "authenticated" &&
          state.status === "unauthenticated"
        ) {
          queryClient.clear();
        }
      }),
    [queryClient],
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
