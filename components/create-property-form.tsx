"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// All fields are kept as strings at the form-input level (even numeric
// ones) and converted with Number(...) in onSubmit. Mixing z.coerce.number()
// into the schema makes react-hook-form's input type diverge from zod's
// output type and breaks generic inference — this keeps it simple.
const schema = z.object({
  title: z.string().min(5, "Give the listing a descriptive title"),
  location: z.string().min(3, "Required"),
  area: z.string().min(2, "Required"),
  type: z.string().min(2, "Required"),
  rent: z.string().refine((v) => Number(v) > 0, "Enter a valid monthly rent"),
  bedrooms: z.string().refine((v) => Number(v) >= 0, "Required"),
  bathrooms: z.string().refine((v) => Number(v) >= 0, "Required"),
  size: z.string().optional(),
  image: z.string().url("Enter a valid image URL"),
  amenities: z.string().optional(),
  description: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function CreatePropertyForm({ creditsRemaining, onCreated }: { creditsRemaining: number; onCreated?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      location: "",
      area: "",
      type: "",
      rent: "",
      bedrooms: "1",
      bathrooms: "1",
      size: "",
      image: "",
      amenities: "",
      description: "",
    },
  });

  async function handleGenerateDescription() {
    const { type, location, amenities } = getValues();
    if (!type || !location || !amenities) {
      setError("Fill in property type, location, and amenities first to generate a description.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, location, amenities }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate description");
      setValue("description", data.description);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate description.");
    } finally {
      setGenerating(false);
    }
  }

  async function onSubmit(values: Values) {
    if (creditsRemaining < 1) {
      setError("You're out of listing credits. Buy a package below to publish more properties.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          location: values.location,
          area: values.area,
          type: values.type,
          rent: Number(values.rent),
          bedrooms: Number(values.bedrooms),
          bathrooms: Number(values.bathrooms),
          size: values.size || undefined,
          image: values.image,
          amenities: values.amenities
            ? values.amenities.split(",").map((a) => a.trim()).filter(Boolean)
            : [],
          description: values.description || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create property");
      setSuccess("Property published.");
      reset();
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-primary">Create Property</h2>
        <p className="text-sm font-medium text-slate-500">{creditsRemaining} credit{creditsRemaining === 1 ? "" : "s"} left</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="grid gap-1">
          <Input {...register("title")} placeholder="Property title" />
          {errors.title && <span className="text-xs text-rose-600">{errors.title.message}</span>}
        </div>
        <div className="grid gap-1">
          <Input {...register("location")} placeholder="Location (e.g. Nyanchwa Estate, Kisii)" />
          {errors.location && <span className="text-xs text-rose-600">{errors.location.message}</span>}
        </div>
        <div className="grid gap-1">
          <Input {...register("area")} placeholder="Area (e.g. Nyanchwa)" />
          {errors.area && <span className="text-xs text-rose-600">{errors.area.message}</span>}
        </div>
        <div className="grid gap-1">
          <Input {...register("type")} placeholder="Property type (e.g. Apartment)" />
          {errors.type && <span className="text-xs text-rose-600">{errors.type.message}</span>}
        </div>
        <div className="grid gap-1">
          <Input {...register("rent")} type="number" min={0} placeholder="Monthly rent (KES)" />
          {errors.rent && <span className="text-xs text-rose-600">{errors.rent.message}</span>}
        </div>
        <div className="grid gap-1">
          <Input {...register("size")} placeholder="Size (e.g. 86 sqm)" />
        </div>
        <div className="grid gap-1">
          <Input {...register("bedrooms")} type="number" min={0} placeholder="Bedrooms" />
          {errors.bedrooms && <span className="text-xs text-rose-600">{errors.bedrooms.message}</span>}
        </div>
        <div className="grid gap-1">
          <Input {...register("bathrooms")} type="number" min={0} placeholder="Bathrooms" />
          {errors.bathrooms && <span className="text-xs text-rose-600">{errors.bathrooms.message}</span>}
        </div>
        <div className="grid gap-1 md:col-span-2">
          <Input {...register("image")} placeholder="Main image URL (https://...)" />
          {errors.image && <span className="text-xs text-rose-600">{errors.image.message}</span>}
        </div>
        <div className="grid gap-1 md:col-span-2">
          <Input {...register("amenities")} placeholder="Amenities, comma-separated (e.g. parking, backup water, gated compound)" />
        </div>
        <div className="grid gap-1 md:col-span-2">
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Description"
            className="rounded-md border border-slate-200 px-3 py-2 text-sm focus-ring"
          />
          <Button type="button" variant="outline" size="sm" className="w-fit" onClick={handleGenerateDescription} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Generate with AI
          </Button>
        </div>
        <Button type="submit" disabled={submitting || creditsRemaining < 1} className="md:col-span-2 w-fit">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />} Publish property
        </Button>
      </form>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      {success && <p className="mt-3 text-sm text-emerald-600">{success}</p>}
    </div>
  );
}
