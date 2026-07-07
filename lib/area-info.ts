// Editorial copy about real Kisii neighborhoods (name, description, photo).
// Not listing data — actual rental counts are merged in live from the DB
// via getAreaCounts() in lib/queries.ts.
export const AREA_INFO = [
  { name: "Kisii Town", note: "Central apartments and walkable offices", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80" },
  { name: "Daraja Mbili", note: "Budget-friendly homes near transport", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80" },
  { name: "Nyanchwa", note: "Quiet residential streets and schools", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" },
  { name: "Suneka", note: "Family houses with larger compounds", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80" },
  { name: "Keroka", note: "Town homes and commuter access", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80" },
  { name: "Ogembo", note: "Value rentals around key roads", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80" },
  { name: "Nyamataro", note: "Modern bedsitters and maisonettes", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80" },
] as const;
