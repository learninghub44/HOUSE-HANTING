"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  type: z.string().min(2, "Required"),
  location: z.string().min(2, "Required"),
  amenities: z.string().min(5, "List at least one amenity"),
});

type Values = z.infer<typeof schema>;

export function AiListingGenerator() {
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "Two-bedroom apartment",
      location: "Nyanchwa, Kisii",
      amenities: "private parking, backup water, gated compound, tiled floors",
    },
  });

  async function onSubmit(values: Values) {
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error ?? "Failed to generate description");
      setOutput(data.description);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate description. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-primary">AI Listing Description Generator</h2>
          <p className="mt-1 text-sm text-slate-600">
            Enter your property details and get a polished listing description instantly.
          </p>
        </div>
        <Wand2 className="h-6 w-6 text-accent flex-shrink-0" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="grid gap-1">
          <Input {...register("type")} placeholder="Property type (e.g. 2-bed apartment)" />
          {errors.type && <span className="text-xs text-rose-600">{errors.type.message}</span>}
        </div>
        <div className="grid gap-1">
          <Input {...register("location")} placeholder="Location (e.g. Nyanchwa, Kisii)" />
          {errors.location && <span className="text-xs text-rose-600">{errors.location.message}</span>}
        </div>
        <div className="grid gap-1">
          <Input {...register("amenities")} placeholder="Amenities (e.g. parking, water)" />
          {errors.amenities && <span className="text-xs text-rose-600">{errors.amenities.message}</span>}
        </div>
        <Button type="submit" disabled={loading} className="md:col-span-3 md:w-fit">
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
            : <><Wand2 className="h-4 w-4" /> Generate description</>}
        </Button>
      </form>

      {error && (
        <div className="mt-4 rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {output && (
        <div className="mt-5 rounded-md border border-blue-100 bg-surface p-4 text-sm leading-7 text-slate-700">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">Generated description</p>
          {output}
        </div>
      )}

      {!output && !error && !loading && (
        <div className="mt-5 rounded-md bg-surface p-4 text-sm leading-7 text-slate-400 italic">
          Your generated description will appear here...
        </div>
      )}
    </div>
  );
}
