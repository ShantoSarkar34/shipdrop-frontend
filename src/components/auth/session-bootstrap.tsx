"use client";

import { useEffect } from "react";
import { getAccessToken, getRefreshToken } from "@/lib/auth/token-storage";
import { useSessionStore } from "@/stores/session-store";

const hasCredentials = () => Boolean(getAccessToken() || getRefreshToken());

/** Decides the initial session status on the client, then keeps tabs in sync. */
export function SessionBootstrap() {
  useEffect(() => {
    useSessionStore
      .getState()
      .setStatus(hasCredentials() ? "authenticated" : "unauthenticated");

    // Signing out in another tab clears shared storage; follow it here.
    const onStorage = () => {
      const { status, signOut } = useSessionStore.getState();
      if (status === "authenticated" && !hasCredentials()) signOut();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}
