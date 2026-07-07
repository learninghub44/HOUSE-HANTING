"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Property } from "@/lib/types";

export function AiRecommendations({ recommended }: { recommended: Property[] }) {
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSuggestion("");

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setSuggestion(data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {/* AI search prompt */}
      <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-card">
        <p className="flex items-center gap-2 font-semibold text-primary">
          <Sparkles className="h-5 w-5 text-accent" /> AI Property Assistant
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Try: &quot;Houses under KES 15,000 in Nyanchwa&quot; · &quot;Bedsitters near Kisii University&quot; · &quot;Family house with parking&quot;
        </p>
        <form onSubmit={handleAsk} className="mt-3 flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the home you want..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask AI"}
          </Button>
        </form>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        {suggestion && (
          <div className="mt-3 rounded-md bg-surface p-3 text-sm leading-6 text-slate-700">
            {suggestion}
          </div>
        )}
      </div>

      {/* Recommended listings */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-primary">
          <Sparkles className="h-5 w-5 text-accent" /> Recommended for you
        </h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommended.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}
