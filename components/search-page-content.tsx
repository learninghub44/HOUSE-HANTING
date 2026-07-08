"use client";

import { useMemo, useState } from "react";
import { Bot, Grid3X3, ListFilter, Loader2, Map, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Property } from "@/lib/types";

const amenityOptions = ["Parking", "Water storage", "Fiber-ready", "Gated compound"];

export function SearchPageContent({
  properties,
  areaNames,
  favoritedIds,
}: {
  properties: Property[];
  areaNames: string[];
  favoritedIds: string[] | null;
}) {
  const favoritedSet = favoritedIds ? new Set(favoritedIds) : null;
  const searchParams = useSearchParams();

  const [location, setLocation] = useState("All areas");
  const [propertyType, setPropertyType] = useState("");
  const [minBeds, setMinBeds] = useState(searchParams.get("beds") ?? "");
  const [minBaths, setMinBaths] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("budget") ?? "");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [availableOnly, setAvailableOnly] = useState(true);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [appliedAt, setAppliedAt] = useState(0);

  const [aiQuery, setAiQuery] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  function toggleAmenity(item: string) {
    setAmenities((current) => (current.includes(item) ? current.filter((a) => a !== item) : [...current, item]));
  }

  const results = useMemo(() => {
    const keyword = (searchParams.get("q") ?? "").toLowerCase();

    return properties.filter((property) => {
      if (location !== "All areas" && property.area !== location) return false;
      if (propertyType && !property.type.toLowerCase().includes(propertyType.toLowerCase())) return false;
      if (minBeds && property.bedrooms < Number(minBeds)) return false;
      if (minBaths && property.bathrooms < Number(minBaths)) return false;
      if (minPrice && property.rent < Number(minPrice)) return false;
      if (maxPrice && property.rent > Number(maxPrice)) return false;
      if (verifiedOnly && !property.verified) return false;
      if (availableOnly && !property.available) return false;
      if (
        amenities.length > 0 &&
        !amenities.every((selected) =>
          property.amenities.some((a) => a.toLowerCase().includes(selected.toLowerCase())),
        )
      )
        return false;
      if (
        keyword &&
        !`${property.title} ${property.location} ${property.area} ${property.type}`.toLowerCase().includes(keyword)
      )
        return false;
      return true;
      // appliedAt forces re-evaluation when "Apply filters" is pressed on mobile-style flows
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, location, propertyType, minBeds, minBaths, minPrice, maxPrice, amenities, verifiedOnly, availableOnly, appliedAt, searchParams]);

  async function handleAskAi(e: React.FormEvent) {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiReply("");
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: aiQuery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setAiReply(data.reply);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <>
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="container-page">
          <SearchBar compact />
        </div>
      </section>
      <section className="container-page grid gap-6 py-8 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-primary">Filters</h1>
            <SlidersHorizontal className="h-5 w-5 text-slate-500" />
          </div>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Location
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 rounded-md border border-slate-200 px-3 focus-ring"
              >
                <option>All areas</option>
                {areaNames.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Property Type
              <Input
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                placeholder="Apartment, bedsitter..."
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Min bedrooms
                <Input type="number" min={0} value={minBeds} onChange={(e) => setMinBeds(e.target.value)} placeholder="Any" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Min bathrooms
                <Input type="number" min={0} value={minBaths} onChange={(e) => setMinBaths(e.target.value)} placeholder="Any" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Price Range (KES)
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" />
                <Input type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" />
              </div>
            </label>
            <fieldset className="grid gap-3">
              <legend className="text-sm font-medium text-slate-700">Amenities</legend>
              {amenityOptions.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={amenities.includes(item)}
                    onChange={() => toggleAmenity(item)}
                    className="h-4 w-4 rounded border-slate-300 text-accent"
                  />
                  {item}
                </label>
              ))}
            </fieldset>
            <label className="flex items-center justify-between rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              Verified Only
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-accent"
              />
            </label>
            <label className="flex items-center justify-between rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
              Available Only
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-accent"
              />
            </label>
            <Button type="button" onClick={() => setAppliedAt(Date.now())}>
              <ListFilter className="h-4 w-4" /> Apply filters
            </Button>
          </div>
        </aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Property Search</p>
              <h2 className="mt-2 text-2xl font-semibold text-primary">
                {results.length} {results.length === 1 ? "rental" : "rentals"} in Kisii
              </h2>
            </div>
            <div className="flex rounded-md border border-slate-200 bg-white p-1">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                type="button"
                onClick={() => setView("grid")}
              >
                <Grid3X3 className="h-4 w-4" /> Grid
              </Button>
              <Button
                variant={view === "map" ? "secondary" : "ghost"}
                size="sm"
                type="button"
                onClick={() => setView("map")}
              >
                <Map className="h-4 w-4" /> Map
              </Button>
            </div>
          </div>
          <div className="mb-6 rounded-lg border border-blue-100 bg-white p-5 shadow-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="flex items-center gap-2 font-semibold text-primary"><Bot className="h-5 w-5 text-accent" /> AI Property Assistant</p>
                <p className="mt-1 text-sm text-slate-600">Try: Houses under KES 15,000 in Nyanchwa, bedsitters near Kisii University, family houses with parking.</p>
              </div>
              <form onSubmit={handleAskAi} className="flex w-full gap-2 md:max-w-md">
                <Input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Describe the home you want"
                />
                <Button type="submit" disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
                </Button>
              </form>
            </div>
            {aiError && <p className="mt-3 text-sm text-rose-600">{aiError}</p>}
            {aiReply && <p className="mt-3 rounded-md bg-surface p-3 text-sm leading-6 text-slate-700">{aiReply}</p>}
          </div>

          {view === "map" ? (
            <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              <div>
                <Map className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                Map view is coming soon. Switch back to Grid to browse results.
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              No listings match your filters yet. Try widening your price range or clearing an amenity filter.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavoritedInitial={favoritedSet ? favoritedSet.has(property.id) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
