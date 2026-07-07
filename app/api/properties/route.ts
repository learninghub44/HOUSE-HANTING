import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { createPropertyConsumingCredit, getProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

type CreatePropertyBody = {
  title: string;
  location: string;
  area: string;
  type: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: string;
  image: string;
  gallery?: string[];
  amenities?: string[];
  description?: string;
};

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to list a property." }, { status: 401 });
  }

  const profile = await getProfile(session.user.id);
  if (!profile || (profile.role !== "landlord" && profile.role !== "agent")) {
    return NextResponse.json({ error: "Only landlord or agent accounts can list properties." }, { status: 403 });
  }

  // Agents must be verified before their listings go live. Individual
  // landlords are unverified-by-default but allowed to list immediately;
  // landlord companies follow the same pending-review flow as agents.
  const needsVerification = profile.role === "agent" || (profile.role === "landlord" && profile.accountType === "company");
  if (needsVerification && profile.verificationStatus !== "verified") {
    return NextResponse.json({ error: "Your account must be verified before you can list properties." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as CreatePropertyBody | null;
  if (!body?.title || !body.location || !body.area || !body.type || !body.image) {
    return NextResponse.json({ error: "Title, location, area, type, and image are required." }, { status: 400 });
  }
  if (!Number.isFinite(body.rent) || body.rent <= 0) {
    return NextResponse.json({ error: "Rent must be a positive number." }, { status: 400 });
  }
  if (!Number.isFinite(body.bedrooms) || body.bedrooms < 0 || !Number.isFinite(body.bathrooms) || body.bathrooms < 0) {
    return NextResponse.json({ error: "Bedrooms and bathrooms must be non-negative numbers." }, { status: 400 });
  }

  // No separate "list on behalf of a landlord" flow exists yet, so an
  // agent's listing is attributed to the agent's own profile as both
  // landlord and agent of record.
  const result = await createPropertyConsumingCredit({
    landlordId: session.user.id,
    agentId: profile.role === "agent" ? session.user.id : undefined,
    title: body.title,
    location: body.location,
    area: body.area,
    type: body.type,
    rent: Math.round(body.rent),
    bedrooms: Math.round(body.bedrooms),
    bathrooms: Math.round(body.bathrooms),
    size: body.size,
    image: body.image,
    gallery: body.gallery ?? [],
    amenities: body.amenities ?? [],
    description: body.description ?? "",
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "You're out of listing credits. Buy a package to publish more properties." },
      { status: 402 },
    );
  }

  return NextResponse.json({ property: result.property });
}
