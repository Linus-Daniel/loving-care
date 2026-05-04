"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <section className="max-w-md rounded-xl border yellow-50 p-6 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="font-display text-xl font-bold text-green">Admin Page Error</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong while loading this admin page. Try again, or check the server logs if it repeats.
        </p>
        <Button onClick={reset} className="mt-5 bg-green text-white">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </section>
    </main>
  );
}
