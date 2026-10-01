import { ROLE_HOME } from "@/config/roles";
import type { Role } from "@/types/user";

/** Only same-site paths inside the user's own area are honored, so this can't become an open redirect. */
export function resolvePostLoginPath(next: string | null, role: Role): string {
  const home = ROLE_HOME[role];
  if (!next || !next.startsWith("/") || next.startsWith("//")) return home;
  return next === home || next.startsWith(`${home}/`) ? next : home;
}