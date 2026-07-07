"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatKes } from "@/lib/utils";

const PACKAGES = [
  { id: "single", label: "1 Listing", credits: 1, priceKes: 200, blurb: "Try it out with a single property" },
  { id: "five", label: "5 Listings", credits: 5, priceKes: 500, blurb: "Best for individual landlords" },
  { id: "ten", label: "10 Listings", credits: 10, priceKes: 1500, blurb: "Best value for agents & companies" },
] as const;

export function BillingWidget({ creditsRemaining }: { creditsRemaining: number }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleBuy(packageId: string) {
    setLoadingId(packageId);
    setError("");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start payment");
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
          <CreditCard className="h-5 w-5 text-accent" /> Listing Credits
        </h2>
        <p className="text-sm font-medium text-slate-500">{creditsRemaining} remaining</p>
      </div>
      <p className="mt-1 text-sm text-slate-600">Each new property listing uses one credit. Top up via Paystack (card or M-Pesa).</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="rounded-md border border-slate-200 p-4">
            <p className="font-semibold text-primary">{pkg.label}</p>
            <p className="mt-1 text-lg font-bold text-primary">{formatKes(pkg.priceKes)}</p>
            <p className="mt-1 text-xs text-slate-500">{pkg.blurb}</p>
            <Button
              type="button"
              size="sm"
              className="mt-3 w-full"
              onClick={() => handleBuy(pkg.id)}
              disabled={loadingId !== null}
            >
              {loadingId === pkg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buy"}
            </Button>
          </div>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
