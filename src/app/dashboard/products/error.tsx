"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <AlertCircle className="size-10 text-destructive" aria-hidden />
      <p className="text-sm font-medium">Failed to load products</p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
