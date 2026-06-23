"use client";

import { Bath, BedDouble, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={compact ? "grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-card md:grid-cols-[1.5fr_1fr_1fr_auto]" : "grid gap-3 rounded-lg bg-white p-3 shadow-premium md:grid-cols-[1.6fr_1fr_1fr_auto]"}
      action="/search"
    >
      <label className="relative">
        <span className="sr-only">Location or keyword</span>
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input name="q" placeholder="Nyanchwa, bedsitter, parking..." className="pl-9" />
      </label>
      <label className="relative">
        <span className="sr-only">Bedrooms</span>
        <BedDouble className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input name="beds" placeholder="Bedrooms" className="pl-9" />
      </label>
      <label className="relative">
        <span className="sr-only">Bathrooms</span>
        <Bath className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input name="budget" placeholder="Max rent" className="pl-9" />
      </label>
      <Button type="submit" size="lg">
        <Search className="h-4 w-4" /> Search
      </Button>
    </motion.form>
  );
}
