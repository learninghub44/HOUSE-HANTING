"use client";

import { Bath, BedDouble, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const areas = ["Kisii Town", "Daraja Mbili", "Nyanchwa", "Suneka", "Keroka", "Ogembo", "Nyamataro"];

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [beds, setBeds] = useState(searchParams.get("beds") ?? "");
  const [budget, setBudget] = useState(searchParams.get("budget") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (beds) params.set("beds", beds);
    if (budget) params.set("budget", budget);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      onSubmit={handleSubmit}
      className={
        compact
          ? "grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-card md:grid-cols-[1.5fr_1fr_1fr_auto]"
          : "grid gap-3 rounded-lg bg-white p-3 shadow-premium md:grid-cols-[1.6fr_1fr_1fr_auto]"
      }
    >
      <label className="relative">
        <span className="sr-only">Location or keyword</span>
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nyanchwa, bedsitter, parking..."
          className="pl-9"
          list="area-suggestions"
        />
        <datalist id="area-suggestions">
          {areas.map((area) => <option key={area} value={area} />)}
        </datalist>
      </label>

      <label className="relative">
        <span className="sr-only">Bedrooms</span>
        <BedDouble className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          name="beds"
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
          placeholder="Bedrooms"
          className="pl-9"
          type="number"
          min={0}
          max={10}
        />
      </label>

      <label className="relative">
        <span className="sr-only">Max rent</span>
        <Bath className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          name="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Max rent (KES)"
          className="pl-9"
          type="number"
          min={0}
        />
      </label>

      <Button type="submit" size="lg">
        <Search className="h-4 w-4" /> Search
      </Button>
    </motion.form>
  );
}
