import { create } from "zustand";
import type { TokenPair } from "../lib/types";
import { clearTokens, saveTokens } from "@/lib/auth/token-storage";

export type SessionStatus = "hydrating" | "authenticated" | "unauthenticated";

interface SessionState {
  /** Starts as "hydrating" on server and client alike, so first render never mismatches. */
  status: SessionStatus;
  setStatus: (status: SessionStatus) => void;
  signIn: (tokens: TokenPair) => void;
  signOut: () => void;
}

// The user object is server state and lives in TanStack Query (useCurrentUser, Phase 3).
// This store only knows whether a session exists.
export const useSessionStore = create<SessionState>((set) => ({
  status: "hydrating",
  setStatus: (status) => set({ status }),
  signIn: (tokens) => {
    saveTokens(tokens);
    set({ status: "authenticated" });
  },
  signOut: () => {
    clearTokens();
    set({ status: "unauthenticated" });
  },
}));
