"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";
import { env } from "@/config/env";

// Only the auth pages load Google's script.
export function GoogleProvider({ children }: { children: ReactNode }) {
  if (!env.googleClientId) return <>{children}</>;
  return (
    <GoogleOAuthProvider clientId={env.googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
