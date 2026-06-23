import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/nav";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-surface px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-accent">
            <Compass className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-4xl font-semibold text-primary">Page not found</h1>
          <p className="mt-3 text-slate-600">
            We couldn&apos;t find the page you were looking for. It may have been moved, or the listing may no longer be available.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/"><Home className="h-4 w-4" /> Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search">Browse listings</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
