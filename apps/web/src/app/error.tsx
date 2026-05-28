"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="glass max-w-md rounded-lg p-6 text-center">
        <p className="text-sm font-medium text-primary">FlowForge recovered the workspace shell.</p>
        <h1 className="mt-3 text-2xl font-semibold">Something drifted out of place.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Button className="mt-5" onClick={reset}>
          <RotateCcw />
          Retry
        </Button>
      </section>
    </main>
  );
}
