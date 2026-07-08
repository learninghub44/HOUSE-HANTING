import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { getProfile, searchLandlords } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const profile = await getProfile(session.user.id);
  if (!profile || profile.role !== "agent") {
    return NextResponse.json({ error: "Only agent accounts can search landlords." }, { status: 403 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ landlords: [] });
  }

  const landlords = await searchLandlords(q);
  return NextResponse.json({ landlords });
}
