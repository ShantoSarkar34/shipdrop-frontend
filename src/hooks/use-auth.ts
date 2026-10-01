"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi, type LoginInput, type RegisterInput } from "@/lib/api/auth";
import { startSession } from "@/lib/auth/session";
import { getRefreshToken } from "@/lib/auth/token-storage";
import { useSessionStore } from "@/stores/session-store";
import type { User } from "@/types/user";

const firstName = (user: User) => user.name.split(" ")[0];

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: LoginInput) =>
      startSession(queryClient, await authApi.login(input)),
    onSuccess: (user) => toast.success(`Welcome back, ${firstName(user)}`),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterInput) =>
      startSession(queryClient, await authApi.register(input)),
    onSuccess: (user) =>
      toast.success(`Welcome to SwiftDrop, ${firstName(user)}`),
  });
}

export function useGoogleSignIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idToken: string) =>
      startSession(queryClient, await authApi.googleLogin(idToken)),
    onSuccess: (user) => toast.success(`Welcome, ${firstName(user)}`),
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return;
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Best effort: the local session is cleared below even if the server call fails.
      }
    },
    onSettled: () => {
      useSessionStore.getState().signOut();
      router.replace("/login");
    },
  });
}
