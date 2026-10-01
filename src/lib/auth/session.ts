import type { QueryClient } from "@tanstack/react-query";
import type { TokenPair } from "../../lib/types";
import { fetchMe } from "@/lib/api/users";
import { queryKeys } from "@/lib/query/keys";
import { useSessionStore } from "@/stores/session-store";
import type { User } from "@/types/user";
import { clearTokens, saveTokens } from "./token-storage";

export async function startSession(queryClient: QueryClient, tokens: TokenPair): Promise<User> {
  saveTokens(tokens);
  try {
    const user = await fetchMe();
    queryClient.setQueryData(queryKeys.me, user);
    useSessionStore.getState().signIn(tokens);
    return user;
  } catch (error) {
    clearTokens();
    throw error;
  }
}