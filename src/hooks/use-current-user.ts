"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/lib/api/users";
import { queryKeys } from "@/lib/query/keys";
import { useSessionStore } from "@/stores/session-store";

export function useCurrentUser() {
  const status = useSessionStore((state) => state.status);
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    enabled: status === "authenticated",
    staleTime: 5 * 60_000,
  });
}
