import { env } from "@/config/env";
import { getAccessToken, getRefreshToken, saveTokens } from "@/lib/auth/token-storage";
import { useSessionStore } from "@/stores/session-store";
import { createApiClient } from "./client";

export const api = createApiClient({
  baseUrl: env.apiBaseUrl,
  getAccessToken,
  getRefreshToken,
  onTokens: saveTokens,
  onAuthFailure: () => useSessionStore.getState().signOut(),
});