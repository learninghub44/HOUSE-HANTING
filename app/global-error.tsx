"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="grid min-h-screen place-items-center bg-surface px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="font-serif text-4xl font-semibold text-primary">Something went wrong</h1>
            <p className="mt-3 text-slate-600">
              An unexpected error occurred while loading this page. Please try again, or head back to the homepage.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={() => reset()}>
                <RotateCw className="h-4 w-4" /> Try again
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
