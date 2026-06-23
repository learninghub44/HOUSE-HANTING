"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  type: z.string().min(2),
  location: z.string().min(2),
  amenities: z.string().min(5),
});

type Values = z.infer<typeof schema>;

export function AiListingGenerator() {
  const [values, setValues] = useState<Values>({ type: "Two-bedroom apartment", location: "Kisii Town", amenities: "balcony, backup water, secure parking" });
  const { register, getValues } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: values });

  const output = useMemo(
    () =>
      `${values.type} in ${values.location} offering ${values.amenities}. This home is suited for tenants who want clean finishes, dependable access, and a professionally managed viewing process. Contact the landlord to confirm availability, deposit terms, and preferred move-in date.`,
    [values],
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-primary">AI Listing Description Generator</h2>
          <p className="mt-1 text-sm text-slate-600">Turn structured property details into a polished landlord description.</p>
        </div>
        <Wand2 className="h-6 w-6 text-accent" />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Input {...register("type")} placeholder="Property type" />
        <Input {...register("location")} placeholder="Location" />
        <Input {...register("amenities")} placeholder="Amenities" />
      </div>
      <Button type="button" className="mt-4" onClick={() => setValues(getValues())}>Generate description</Button>
      <div className="mt-5 rounded-md bg-surface p-4 text-sm leading-6 text-slate-700">{output}</div>
    </div>
  );
}
