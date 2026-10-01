"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { env } from "@/config/env";
import { useGoogleSignIn } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/errors";

export function GoogleButton() {
  const { resolvedTheme } = useTheme();
  const googleSignIn = useGoogleSignIn();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Google renders its own fixed-width button (200 to 400px); fit it to the card.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.min(400, Math.floor(entry.contentRect.width)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!env.googleClientId) return null;

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="flex min-h-10 justify-center">
        {width >= 200 ? (
          <GoogleLogin
            key={resolvedTheme}
            width={width}
            theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
            size="large"
            text="continue_with"
            shape="rectangular"
            onSuccess={(response) => {
              if (!response.credential) {
                toast.error(
                  "Google didn't return a sign-in token. Please try again.",
                );
                return;
              }
              googleSignIn.mutate(response.credential, {
                onError: (error) => toast.error(getErrorMessage(error)),
              });
            }}
            onError={() =>
              toast.error("Google sign-in failed or was cancelled.")
            }
          />
        ) : null}
      </div>
      {googleSignIn.isPending ? (
        <p role="status" className="text-center text-xs text-muted-foreground">
          Signing you in…
        </p>
      ) : null}
    </div>
  );
}
