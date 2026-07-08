import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { addFavorite, getProfile, removeFavorite } from "@/lib/queries";

export const dynamic = "force-dynamic";

async function requireTenant() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  const profile = await getProfile(session.user.id);
  if (!profile || profile.role !== "tenant") {
    return { error: NextResponse.json({ error: "Only tenant accounts can save properties." }, { status: 403 }) };
  }
  return { tenantId: session.user.id };
}

export async function POST(request: Request) {
  const result = await requireTenant();
  if (result.error) return result.error;

  const body = (await request.json().catch(() => null)) as { propertyId?: string } | null;
  if (!body?.propertyId) {
    return NextResponse.json({ error: "propertyId is required." }, { status: 400 });
  }

  await addFavorite(result.tenantId, body.propertyId);
  return NextResponse.json({ favorited: true });
}

export async function DELETE(request: Request) {
  const result = await requireTenant();
  if (result.error) return result.error;

  const url = new URL(request.url);
  const propertyId = url.searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "propertyId is required." }, { status: 400 });
  }

  await removeFavorite(result.tenantId, propertyId);
  return NextResponse.json({ favorited: false });
}
