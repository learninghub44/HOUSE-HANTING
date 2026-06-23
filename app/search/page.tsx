import { Bot, Grid3X3, ListFilter, Map, SlidersHorizontal } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/nav";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { areas, properties } from "@/lib/data";

export default function SearchPage() {
  return (
    <>
      <Navigation />
      <main className="bg-surface">
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
              <label className="grid gap-2 text-sm font-medium text-slate-700">Location
                <select className="h-11 rounded-md border border-slate-200 px-3 focus-ring">
                  {areas.map((area) => <option key={area.name}>{area.name}</option>)}
                </select>
              </label>
              {["Property Type", "Bedrooms", "Bathrooms"].map((label) => (
                <label key={label} className="grid gap-2 text-sm font-medium text-slate-700">{label}
                  <Input placeholder={label === "Property Type" ? "Apartment, bedsitter..." : "Any"} />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-medium text-slate-700">Price Range
                <div className="grid grid-cols-2 gap-2"><Input placeholder="Min" /><Input placeholder="Max" /></div>
              </label>
              <fieldset className="grid gap-3">
                <legend className="text-sm font-medium text-slate-700">Amenities</legend>
                {["Parking", "Water storage", "Fiber-ready", "Gated compound"].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-accent" /> {item}</label>
                ))}
              </fieldset>
              <label className="flex items-center justify-between rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
                Verified Only <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-accent" defaultChecked />
              </label>
              <label className="flex items-center justify-between rounded-md bg-surface p-3 text-sm font-medium text-slate-700">
                Available Only <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-accent" defaultChecked />
              </label>
              <Button type="button"><ListFilter className="h-4 w-4" /> Apply filters</Button>
            </div>
          </aside>
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Property Search</p>
                <h2 className="mt-2 text-2xl font-semibold text-primary">Verified rentals in Kisii</h2>
              </div>
              <div className="flex rounded-md border border-slate-200 bg-white p-1">
                <Button variant="ghost" size="sm"><Grid3X3 className="h-4 w-4" /> Grid</Button>
                <Button variant="ghost" size="sm"><Map className="h-4 w-4" /> Map</Button>
              </div>
            </div>
            <div className="mb-6 rounded-lg border border-blue-100 bg-white p-5 shadow-card">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-primary"><Bot className="h-5 w-5 text-accent" /> AI Property Assistant</p>
                  <p className="mt-1 text-sm text-slate-600">Try: Houses under KES 15,000 in Nyanchwa, bedsitters near Kisii University, family houses with parking.</p>
                </div>
                <Input className="md:max-w-md" placeholder="Describe the home you want" />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
