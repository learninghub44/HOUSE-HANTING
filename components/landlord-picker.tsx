"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type Landlord = { id: string; name: string; phone: string };

export function LandlordPicker({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Landlord[]>([]);
  const [selected, setSelected] = useState<Landlord | null>(null);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/landlords/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(res.ok ? data.landlords : []);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function select(landlord: Landlord) {
    setSelected(landlord);
    onChange(landlord.id);
    setOpen(false);
    setQuery("");
  }

  function clear() {
    setSelected(null);
    onChange(null);
  }

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-surface px-3 py-2 text-sm">
        <span className="flex items-center gap-2 font-medium text-primary">
          <Check className="h-4 w-4 text-emerald-600" /> {selected.name} {selected.phone && `- ${selected.phone}`}
        </span>
        <button type="button" onClick={clear} className="text-slate-400 hover:text-rose-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search landlord by name or phone (optional)"
          className="pl-9"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-card">
          {results.map((landlord) => (
            <button
              key={landlord.id}
              type="button"
              onClick={() => select(landlord)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-surface"
            >
              <span className="font-medium text-primary">{landlord.name}</span>
              <span className="text-slate-500">{landlord.phone}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
