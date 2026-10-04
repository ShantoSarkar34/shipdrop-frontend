"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

class ChartBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div
          role="alert"
          className="flex h-64 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground"
        >
          This chart couldn&apos;t be displayed.
          <Button
            variant="outline"
            size="sm"
            onClick={() => this.setState({ failed: false })}
          >
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-4">
        <ChartBoundary>{children}</ChartBoundary>
      </div>
    </section>
  );
}
