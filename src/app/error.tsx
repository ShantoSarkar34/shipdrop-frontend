"use client";

import { Button } from "@/components/ui/button";

export default function RootError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div role="alert" className="max-w-md text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-2 text-muted-foreground">
          An unexpected error occurred. You can try again.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
