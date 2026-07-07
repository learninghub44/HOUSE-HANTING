export type PropertyStatus = "Available" | "Reserved" | "Occupied" | "Under Maintenance";
export type PaymentStatus = "Paid" | "Pending" | "Overdue";

export type Landlord = {
  name: string;
  phone: string;
  rating: number;
  responseTime: string;
};

export type Property = {
  id: string;
  title: string;
  location: string;
  area: string;
  type: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  size: string;
  status: PropertyStatus;
  verified: boolean;
  available: boolean;
  image: string;
  gallery: string[];
  amenities: string[];
  landlord: Landlord;
  description: string;
};

export const areas = [
  { name: "Kisii Town", count: 26, note: "Central apartments and walkable offices", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80" },
  { name: "Daraja Mbili", count: 18, note: "Budget-friendly homes near transport", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80" },
  { name: "Nyanchwa", count: 21, note: "Quiet residential streets and schools", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" },
  { name: "Suneka", count: 14, note: "Family houses with larger compounds", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80" },
  { name: "Keroka", count: 12, note: "Town homes and commuter access", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80" },
  { name: "Ogembo", count: 9, note: "Value rentals around key roads", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80" },
  { name: "Nyamataro", count: 15, note: "Modern bedsitters and maisonettes", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80" },
];

const gallery = [
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
];

export const properties: Property[] = [
  {
    id: "nyanchwa-family-house",
    title: "Three-bedroom maisonette with private parking",
    location: "Nyanchwa Estate, Kisii",
    area: "Nyanchwa",
    type: "Maisonette",
    rent: 28000,
    bedrooms: 3,
    bathrooms: 2,
    size: "132 sqm",
    status: "Available",
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    gallery,
    amenities: ["Private parking", "Water storage", "Gated compound", "Tiled floors", "Kitchen cabinets"],
    landlord: { name: "Miriam Bosibori", phone: "+254 711 284 910", rating: 4.8, responseTime: "Usually replies within 2 hours" },
    description: "A well-kept family maisonette in a quiet Nyanchwa pocket with reliable water storage, a secure gate, and quick access to Kisii School, town services, and local shops.",
  },
  {
    id: "daraja-mbili-bedsitter",
    title: "Bright bedsitter near Daraja Mbili market",
    location: "Daraja Mbili, Kisii",
    area: "Daraja Mbili",
    type: "Bedsitter",
    rent: 8500,
    bedrooms: 1,
    bathrooms: 1,
    size: "28 sqm",
    status: "Available",
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    gallery,
    amenities: ["Token electricity", "Borehole water", "Secure entry", "Close to matatu stage"],
    landlord: { name: "Peter Nyakundi", phone: "+254 724 601 332", rating: 4.6, responseTime: "Usually replies same day" },
    description: "A clean, practical bedsitter for students or working tenants who need fast access to Daraja Mbili, Kisii University routes, and daily amenities.",
  },
  {
    id: "kisii-town-apartment",
    title: "Executive two-bedroom apartment in Kisii Town",
    location: "Kisii Town CBD fringe",
    area: "Kisii Town",
    type: "Apartment",
    rent: 24000,
    bedrooms: 2,
    bathrooms: 2,
    size: "86 sqm",
    status: "Reserved",
    verified: true,
    available: false,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    gallery,
    amenities: ["Lift access", "Backup water", "Balcony", "Fiber-ready", "Resident caretaker"],
    landlord: { name: "James Mogaka", phone: "+254 733 842 194", rating: 4.7, responseTime: "Usually replies within 4 hours" },
    description: "A polished apartment close to town offices, hospitals, supermarkets, and restaurants, with a balcony and a resident caretaker for smooth day-to-day living.",
  },
  {
    id: "suneka-compound-home",
    title: "Four-bedroom compound home in Suneka",
    location: "Suneka, Kisii County",
    area: "Suneka",
    type: "Bungalow",
    rent: 32000,
    bedrooms: 4,
    bathrooms: 3,
    size: "168 sqm",
    status: "Under Maintenance",
    verified: false,
    available: false,
    image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1200&q=80",
    gallery,
    amenities: ["Large compound", "Servant quarter", "Kitchen garden", "Water tank", "Perimeter fence"],
    landlord: { name: "Grace Moraa", phone: "+254 700 118 509", rating: 4.4, responseTime: "Usually replies within 1 day" },
    description: "A spacious family bungalow with room for outdoor living, currently receiving maintenance before the next tenant moves in.",
  },
  {
    id: "nyamataro-one-bedroom",
    title: "Modern one-bedroom apartment in Nyamataro",
    location: "Nyamataro, Kisii",
    area: "Nyamataro",
    type: "Apartment",
    rent: 14500,
    bedrooms: 1,
    bathrooms: 1,
    size: "48 sqm",
    status: "Available",
    verified: true,
    available: true,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    gallery,
    amenities: ["Hot shower", "Cabinet kitchen", "Secure parking", "Caretaker", "Prepaid power"],
    landlord: { name: "Dennis Ombati", phone: "+254 716 930 442", rating: 4.9, responseTime: "Usually replies within 1 hour" },
    description: "A modern one-bedroom apartment with clean finishes, secure parking, and quick access to Kisii town through Nyamataro road.",
  },
  {
    id: "keroka-townhouse",
    title: "Two-bedroom townhouse near Keroka road",
    location: "Keroka town",
    area: "Keroka",
    type: "Townhouse",
    rent: 18000,
    bedrooms: 2,
    bathrooms: 1,
    size: "74 sqm",
    status: "Occupied",
    verified: true,
    available: false,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
    gallery,
    amenities: ["Paved access", "Water tank", "Shared parking", "Close to school"],
    landlord: { name: "Samuel Onchari", phone: "+254 722 408 771", rating: 4.5, responseTime: "Usually replies within 6 hours" },
    description: "A practical townhouse in Keroka suited to small families who value access to schools, shopping, and transport links.",
  },
];

export const inquiries = [
  { property: "Modern one-bedroom apartment in Nyamataro", date: "18 Jun 2026", status: "Landlord replied" },
  { property: "Bright bedsitter near Daraja Mbili market", date: "16 Jun 2026", status: "Viewing requested" },
  { property: "Executive two-bedroom apartment in Kisii Town", date: "10 Jun 2026", status: "Reserved" },
];

export const payments = [
  { item: "Professional landlord plan", date: "01 Jun 2026", amount: 2500, status: "Paid" as PaymentStatus },
  { item: "Listing boost: Nyanchwa maisonette", date: "22 May 2026", amount: 800, status: "Paid" as PaymentStatus },
  { item: "Listing boost: Nyamataro one-bedroom", date: "14 May 2026", amount: 500, status: "Pending" as PaymentStatus },
];
