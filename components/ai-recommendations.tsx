import { Sparkles } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/lib/data";

export function AiRecommendations() {
  const recommended = properties.filter((property) => property.rent <= 18000 || property.area === "Nyamataro").slice(0, 3);
  return (
    <div>
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-primary"><Sparkles className="h-5 w-5 text-accent" /> AI Property Recommendations</h2>
        <p className="mt-1 text-sm text-slate-600">Based on recent searches, saved listings, and a monthly budget below KES 18,000.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {recommended.map((property) => <PropertyCard key={property.id} property={property} />)}
      </div>
    </div>
  );
}
