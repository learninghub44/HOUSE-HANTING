/**
 * Seeds the database with initial landlord accounts (via Neon Auth) and
 * property listings so the site has real content on first run.
 *
 * Usage: npm run db:seed
 * Requires DATABASE_URL and NEON_AUTH_BASE_URL to be set (see .env.example).
 */
import "dotenv/config";
import { db } from "../lib/db/client";
import { profiles, properties } from "../lib/db/schema";

const NEON_AUTH_BASE_URL = process.env.NEON_AUTH_BASE_URL;
if (!NEON_AUTH_BASE_URL) {
  throw new Error("NEON_AUTH_BASE_URL is not set. See .env.example.");
}

const DEFAULT_PASSWORD = "ChangeMe123!";

const gallery = [
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
];

type SignUpResult = { id: string } | null;

async function signUpLandlord(name: string, email: string, phone: string, responseTime: string): Promise<SignUpResult> {
  const response = await fetch(`${NEON_AUTH_BASE_URL}/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: DEFAULT_PASSWORD, name }),
  });

  if (!response.ok) {
    // Most common case: account already exists from a previous seed run.
    console.warn(`Skipping sign-up for ${email}: ${response.status} ${response.statusText}`);
    return null;
  }

  const body = (await response.json()) as { user?: { id: string } };
  if (!body.user) return null;

  await db
    .insert(profiles)
    .values({ id: body.user.id, role: "landlord", phone, responseTime })
    .onConflictDoNothing({ target: profiles.id });

  return { id: body.user.id };
}

async function seed() {
  console.log("Seeding landlord accounts via Neon Auth...");

  const landlordSeeds = [
    { name: "Miriam Bosibori", email: "miriam.b@example.com", phone: "+254 711 284 910", responseTime: "Usually replies within 2 hours" },
    { name: "Peter Nyakundi", email: "peter.n@example.com", phone: "+254 724 601 332", responseTime: "Usually replies same day" },
    { name: "James Mogaka", email: "james.m@example.com", phone: "+254 733 842 194", responseTime: "Usually replies within 4 hours" },
    { name: "Grace Moraa", email: "grace.moraa@example.com", phone: "+254 700 118 509", responseTime: "Usually replies within 1 day" },
    { name: "Dennis Ombati", email: "dennis.ombati@example.com", phone: "+254 716 930 442", responseTime: "Usually replies within 1 hour" },
    { name: "Samuel Onchari", email: "samuel.o@example.com", phone: "+254 722 408 771", responseTime: "Usually replies within 6 hours" },
  ];

  const landlordIdByName = new Map<string, string>();
  for (const seedData of landlordSeeds) {
    const result = await signUpLandlord(seedData.name, seedData.email, seedData.phone, seedData.responseTime);
    if (result) landlordIdByName.set(seedData.name, result.id);
  }
  console.log(`Created ${landlordIdByName.size} landlord accounts (password: ${DEFAULT_PASSWORD}).`);

  if (landlordIdByName.size === 0) {
    console.warn(
      "No landlord accounts were created — they may already exist. Re-run after clearing neon_auth.user if you want fresh seed data, or seed properties manually."
    );
    return;
  }

  console.log("Seeding properties...");
  const propertySeeds = [
    {
      landlordName: "Miriam Bosibori",
      title: "Three-bedroom maisonette with private parking",
      location: "Nyanchwa Estate, Kisii",
      area: "Nyanchwa",
      type: "Maisonette",
      rent: 28000,
      bedrooms: 3,
      bathrooms: 2,
      size: "132 sqm",
      status: "Available" as const,
      verified: true,
      available: true,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      amenities: ["Private parking", "Water storage", "Gated compound", "Tiled floors", "Kitchen cabinets"],
      description: "A well-kept family maisonette in a quiet Nyanchwa pocket with reliable water storage, a secure gate, and quick access to Kisii School, town services, and local shops.",
    },
    {
      landlordName: "Peter Nyakundi",
      title: "Bright bedsitter near Daraja Mbili market",
      location: "Daraja Mbili, Kisii",
      area: "Daraja Mbili",
      type: "Bedsitter",
      rent: 8500,
      bedrooms: 1,
      bathrooms: 1,
      size: "28 sqm",
      status: "Available" as const,
      verified: true,
      available: true,
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      amenities: ["Token electricity", "Borehole water", "Secure entry", "Close to matatu stage"],
      description: "A clean, practical bedsitter for students or working tenants who need fast access to Daraja Mbili, Kisii University routes, and daily amenities.",
    },
    {
      landlordName: "James Mogaka",
      title: "Executive two-bedroom apartment in Kisii Town",
      location: "Kisii Town CBD fringe",
      area: "Kisii Town",
      type: "Apartment",
      rent: 24000,
      bedrooms: 2,
      bathrooms: 2,
      size: "86 sqm",
      status: "Reserved" as const,
      verified: true,
      available: false,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      amenities: ["Lift access", "Backup water", "Balcony", "Fiber-ready", "Resident caretaker"],
      description: "A polished apartment close to town offices, hospitals, supermarkets, and restaurants, with a balcony and a resident caretaker for smooth day-to-day living.",
    },
    {
      landlordName: "Grace Moraa",
      title: "Four-bedroom compound home in Suneka",
      location: "Suneka, Kisii County",
      area: "Suneka",
      type: "Bungalow",
      rent: 32000,
      bedrooms: 4,
      bathrooms: 3,
      size: "168 sqm",
      status: "Under Maintenance" as const,
      verified: false,
      available: false,
      image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1200&q=80",
      amenities: ["Large compound", "Servant quarter", "Kitchen garden", "Water tank", "Perimeter fence"],
      description: "A spacious family bungalow with room for outdoor living, currently receiving maintenance before the next tenant moves in.",
    },
    {
      landlordName: "Dennis Ombati",
      title: "Modern one-bedroom apartment in Nyamataro",
      location: "Nyamataro, Kisii",
      area: "Nyamataro",
      type: "Apartment",
      rent: 14500,
      bedrooms: 1,
      bathrooms: 1,
      size: "48 sqm",
      status: "Available" as const,
      verified: true,
      available: true,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      amenities: ["Hot shower", "Cabinet kitchen", "Secure parking", "Caretaker", "Prepaid power"],
      description: "A modern one-bedroom apartment with clean finishes, secure parking, and quick access to Kisii town through Nyamataro road.",
    },
    {
      landlordName: "Samuel Onchari",
      title: "Two-bedroom townhouse near Keroka road",
      location: "Keroka town",
      area: "Keroka",
      type: "Townhouse",
      rent: 18000,
      bedrooms: 2,
      bathrooms: 1,
      size: "74 sqm",
      status: "Occupied" as const,
      verified: true,
      available: false,
      image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
      amenities: ["Paved access", "Water tank", "Shared parking", "Close to school"],
      description: "A practical townhouse in Keroka suited to small families who value access to schools, shopping, and transport links.",
    },
  ];

  let insertedCount = 0;
  for (const seedData of propertySeeds) {
    const landlordId = landlordIdByName.get(seedData.landlordName);
    if (!landlordId) {
      console.warn(`Skipping "${seedData.title}" — no account id for landlord "${seedData.landlordName}" (likely already existed).`);
      continue;
    }
    const { landlordName: _landlordName, ...rest } = seedData;
    await db.insert(properties).values({ ...rest, landlordId, gallery });
    insertedCount += 1;
  }
  console.log(`Seeded ${insertedCount} properties.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
